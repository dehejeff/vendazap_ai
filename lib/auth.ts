import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveDataFilePath } from "@/lib/storage-path";
import { isSupabaseServerConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const AUTH_COOKIE_NAME = "vendazap_session";

type StoredUser = {
  createdAt: string;
  email: string;
  id: string;
  niche?: string;
  name: string;
  onboardingCompleted?: boolean;
  passwordHash: string;
  phone?: string;
  storeName: string;
  whatsappAccessTokenHint?: string;
  whatsappBusinessPhoneId?: string;
  whatsappConnected?: boolean;
  whatsappDisplayNumber?: string;
  whatsappWebhookReady?: boolean;
  whatsappNumber?: string;
};

type SupabaseUserRow = {
  created_at: string;
  email: string;
  id: string;
  niche: string | null;
  name: string;
  onboarding_completed: boolean;
  password_hash: string;
  phone: string | null;
  store_name: string;
  whatsapp_access_token_hint: string | null;
  whatsapp_business_phone_id: string | null;
  whatsapp_connected: boolean;
  whatsapp_display_number: string | null;
  whatsapp_number: string | null;
  whatsapp_webhook_ready: boolean;
};

type SessionPayload = {
  email: string;
  name: string;
  storeName: string;
  userId: string;
};

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
  storeName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

const TEMP_ACCESS_EMAIL = "acesso-demo@vendazap.local";

export type StoreProfileInput = {
  niche: string;
  phone?: string;
  storeName: string;
  userId: string;
  whatsappNumber?: string;
};

export type WhatsappConfigInput = {
  accessTokenHint?: string;
  businessPhoneId?: string;
  connected?: boolean;
  displayNumber?: string;
  webhookReady?: boolean;
  userId: string;
};

function resolveUsersFilePath() {
  return resolveDataFilePath(process.env.USERS_FILE_PATH, "users.json");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapSupabaseUser(row: SupabaseUserRow): StoredUser {
  return {
    createdAt: row.created_at,
    email: row.email,
    id: row.id,
    niche: row.niche ?? undefined,
    name: row.name,
    onboardingCompleted: row.onboarding_completed,
    passwordHash: row.password_hash,
    phone: row.phone ?? undefined,
    storeName: row.store_name,
    whatsappAccessTokenHint: row.whatsapp_access_token_hint ?? undefined,
    whatsappBusinessPhoneId: row.whatsapp_business_phone_id ?? undefined,
    whatsappConnected: row.whatsapp_connected,
    whatsappDisplayNumber: row.whatsapp_display_number ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    whatsappWebhookReady: row.whatsapp_webhook_ready,
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const hashBuffer = Buffer.from(originalHash, "hex");
  const candidateBuffer = scryptSync(password, salt, 64);

  return (
    hashBuffer.length === candidateBuffer.length &&
    timingSafeEqual(hashBuffer, candidateBuffer)
  );
}

async function readUsers(): Promise<StoredUser[]> {
  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    return (data ?? []).map((row) => mapSupabaseUser(row as SupabaseUserRow));
  }

  const filePath = resolveUsersFilePath();

  try {
    const fileContent = await readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContent) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeUsers(users: StoredUser[]) {
  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const payload = users.map((user) => ({
      created_at: user.createdAt,
      email: user.email,
      id: user.id,
      niche: user.niche ?? null,
      name: user.name,
      onboarding_completed: user.onboardingCompleted ?? false,
      password_hash: user.passwordHash,
      phone: user.phone ?? null,
      store_name: user.storeName,
      whatsapp_access_token_hint: user.whatsappAccessTokenHint ?? null,
      whatsapp_business_phone_id: user.whatsappBusinessPhoneId ?? null,
      whatsapp_connected: user.whatsappConnected ?? false,
      whatsapp_display_number: user.whatsappDisplayNumber ?? null,
      whatsapp_number: user.whatsappNumber ?? null,
      whatsapp_webhook_ready: user.whatsappWebhookReady ?? false,
    }));

    const { error } = await supabase.from("users").upsert(payload, {
      onConflict: "id",
    });

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    return;
  }

  const filePath = resolveUsersFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
}

export function validateRegisterInput(input: RegisterInput) {
  const normalized = {
    email: normalizeEmail(input.email),
    name: input.name.trim(),
    password: input.password.trim(),
    storeName: input.storeName.trim(),
  };

  if (normalized.name.length < 2) {
    throw new Error("Informe seu nome.");
  }

  if (normalized.storeName.length < 2) {
    throw new Error("Informe o nome da loja.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    throw new Error("Informe um e-mail válido.");
  }

  if (normalized.password.length < 6) {
    throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  }

  return normalized;
}

export function validateLoginInput(input: LoginInput) {
  const normalized = {
    email: normalizeEmail(input.email),
    password: input.password.trim(),
  };

  if (!normalized.email) {
    throw new Error("Informe seu e-mail.");
  }

  if (!normalized.password) {
    throw new Error("Informe sua senha.");
  }

  return normalized;
}

export async function registerUser(input: RegisterInput) {
  const normalized = validateRegisterInput(input);
  const users = await readUsers();
  const alreadyExists = users.some((user) => user.email === normalized.email);

  if (alreadyExists) {
    throw new Error("Já existe uma conta com este e-mail.");
  }

  const newUser: StoredUser = {
    id: randomUUID(),
    email: normalized.email,
    name: normalized.name,
    storeName: normalized.storeName,
    passwordHash: hashPassword(normalized.password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return {
    email: newUser.email,
    name: newUser.name,
    storeName: newUser.storeName,
    userId: newUser.id,
  } satisfies SessionPayload;
}

export async function loginUser(input: LoginInput) {
  const normalized = validateLoginInput(input);
  const users = await readUsers();

  const user = users.find((item) => item.email === normalized.email);

  if (!user || !verifyPassword(normalized.password, user.passwordHash)) {
    throw new Error("E-mail ou senha inválidos.");
  }

  return {
    email: user.email,
    name: user.name,
    storeName: user.storeName,
    userId: user.id,
  } satisfies SessionPayload;
}

export async function getTemporaryAccessSession() {
  const users = await readUsers();
  const existingDemoUser = users.find((user) => user.email === TEMP_ACCESS_EMAIL);

  if (existingDemoUser) {
    return {
      email: existingDemoUser.email,
      name: existingDemoUser.name,
      storeName: existingDemoUser.storeName,
      userId: existingDemoUser.id,
    } satisfies SessionPayload;
  }

  const firstUser = users[0];

  if (firstUser) {
    return {
      email: firstUser.email,
      name: firstUser.name,
      storeName: firstUser.storeName,
      userId: firstUser.id,
    } satisfies SessionPayload;
  }

  const demoPassword = randomBytes(12).toString("hex");
  const demoUser: StoredUser = {
    createdAt: new Date().toISOString(),
    email: TEMP_ACCESS_EMAIL,
    id: randomUUID(),
    name: "Acesso temporário",
    passwordHash: hashPassword(demoPassword),
    storeName: "Loja Demo VendaZap",
  };

  users.push(demoUser);
  await writeUsers(users);

  return {
    email: demoUser.email,
    name: demoUser.name,
    storeName: demoUser.storeName,
    userId: demoUser.id,
  } satisfies SessionPayload;
}

export async function getUserById(userId: string) {
  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    return data ? mapSupabaseUser(data as SupabaseUserRow) : null;
  }

  const users = await readUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export async function getUserByWhatsappBusinessPhoneId(businessPhoneId: string) {
  const normalizedId = businessPhoneId.trim();

  if (!normalizedId) {
    return null;
  }

  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("whatsapp_business_phone_id", normalizedId)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    return data ? mapSupabaseUser(data as SupabaseUserRow) : null;
  }

  const users = await readUsers();
  return users.find((user) => user.whatsappBusinessPhoneId === normalizedId) ?? null;
}

export function validateStoreProfileInput(input: StoreProfileInput) {
  const normalized = {
    niche: input.niche.trim(),
    phone: input.phone?.trim() || "",
    storeName: input.storeName.trim(),
    userId: input.userId.trim(),
    whatsappNumber: input.whatsappNumber?.trim() || "",
  };

  if (!normalized.userId) {
    throw new Error("Usuário inválido.");
  }

  if (normalized.storeName.length < 2) {
    throw new Error("Informe o nome da loja.");
  }

  if (normalized.niche.length < 2) {
    throw new Error("Selecione o nicho da loja.");
  }

  return normalized;
}

export async function updateStoreProfile(input: StoreProfileInput) {
  const normalized = validateStoreProfileInput(input);

  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        niche: normalized.niche,
        onboarding_completed: true,
        phone: normalized.phone || null,
        store_name: normalized.storeName,
        whatsapp_number: normalized.whatsappNumber || null,
      })
      .eq("id", normalized.userId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    if (!data) {
      throw new Error("Usuário não encontrado.");
    }

    return mapSupabaseUser(data as SupabaseUserRow);
  }

  const users = await readUsers();
  const userIndex = users.findIndex((user) => user.id === normalized.userId);

  if (userIndex === -1) {
    throw new Error("Usuário não encontrado.");
  }

  const updatedUser: StoredUser = {
    ...users[userIndex],
    niche: normalized.niche,
    onboardingCompleted: true,
    phone: normalized.phone,
    storeName: normalized.storeName,
    whatsappNumber: normalized.whatsappNumber,
  };

  users[userIndex] = updatedUser;
  await writeUsers(users);

  return updatedUser;
}

export function validateWhatsappConfigInput(input: WhatsappConfigInput) {
  const normalized = {
    accessTokenHint: input.accessTokenHint?.trim() || "",
    businessPhoneId: input.businessPhoneId?.trim() || "",
    connected: Boolean(input.connected),
    displayNumber: input.displayNumber?.trim() || "",
    userId: input.userId.trim(),
    webhookReady: Boolean(input.webhookReady),
  };

  if (!normalized.userId) {
    throw new Error("Usuário inválido.");
  }

  return normalized;
}

export async function updateWhatsappConfig(input: WhatsappConfigInput) {
  const normalized = validateWhatsappConfigInput(input);

  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        whatsapp_access_token_hint: normalized.accessTokenHint || null,
        whatsapp_business_phone_id: normalized.businessPhoneId || null,
        whatsapp_connected: normalized.connected,
        whatsapp_display_number: normalized.displayNumber || null,
        whatsapp_webhook_ready: normalized.webhookReady,
      })
      .eq("id", normalized.userId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase users: ${error.message}`);
    }

    if (!data) {
      throw new Error("Usuário não encontrado.");
    }

    return mapSupabaseUser(data as SupabaseUserRow);
  }

  const users = await readUsers();
  const userIndex = users.findIndex((user) => user.id === normalized.userId);

  if (userIndex === -1) {
    throw new Error("Usuário não encontrado.");
  }

  const updatedUser: StoredUser = {
    ...users[userIndex],
    whatsappAccessTokenHint: normalized.accessTokenHint || undefined,
    whatsappBusinessPhoneId: normalized.businessPhoneId || undefined,
    whatsappConnected: normalized.connected,
    whatsappDisplayNumber: normalized.displayNumber || undefined,
    whatsappWebhookReady: normalized.webhookReady,
  };

  users[userIndex] = updatedUser;
  await writeUsers(users);

  return updatedUser;
}

export function encodeSession(session: SessionPayload) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  try {
    const decoded = Buffer.from(rawValue, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as SessionPayload;

    if (!parsed?.userId || !parsed?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
