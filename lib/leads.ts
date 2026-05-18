import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveDataFilePath } from "@/lib/storage-path";
import { isSupabaseServerConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type LeadInput = {
  email: string;
  name: string;
  niche: string;
  phone?: string;
  storeName: string;
};

type StoredLead = LeadInput & {
  createdAt: string;
  source: "landing-page";
};

type SupabaseLeadRow = {
  created_at: string;
  email: string | null;
  id: string;
  name: string;
  niche: string | null;
  phone: string | null;
  source: string | null;
  store_name: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveLeadsFilePath() {
  return resolveDataFilePath(process.env.LEADS_FILE_PATH, "leads.json");
}

export function validateLeadInput(input: LeadInput) {
  const normalized = {
    name: input.name.trim(),
    storeName: input.storeName.trim(),
    email: input.email.trim().toLowerCase(),
    niche: input.niche.trim(),
    phone: input.phone?.trim() || "",
  };

  if (!normalized.name || normalized.name.length < 2) {
    throw new Error("Informe um nome valido.");
  }

  if (!normalized.storeName || normalized.storeName.length < 2) {
    throw new Error("Informe o nome da loja.");
  }

  if (!EMAIL_REGEX.test(normalized.email)) {
    throw new Error("Informe um e-mail valido.");
  }

  if (!normalized.niche) {
    throw new Error("Selecione o nicho da sua loja.");
  }

  return normalized;
}

async function readExistingLeads(filePath: string) {
  try {
    const fileContent = await readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContent) as StoredLead[];
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

export async function saveLead(input: LeadInput) {
  const normalized = validateLeadInput(input);
  const newLead: StoredLead = {
    ...normalized,
    createdAt: new Date().toISOString(),
    source: "landing-page",
  };

  if (isSupabaseServerConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        created_at: newLead.createdAt,
        email: newLead.email,
        name: newLead.name,
        niche: newLead.niche,
        phone: newLead.phone || null,
        source: newLead.source,
        store_name: newLead.storeName,
      })
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase leads: ${error.message}`);
    }

    if (!data) {
      throw new Error("Nao foi possivel salvar o lead.");
    }

    const row = data as SupabaseLeadRow;

    return {
      createdAt: row.created_at,
      email: row.email ?? "",
      name: row.name,
      niche: row.niche ?? "",
      phone: row.phone ?? "",
      source: "landing-page",
      storeName: row.store_name,
    } satisfies StoredLead;
  }

  const filePath = resolveLeadsFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const leads = await readExistingLeads(filePath);
  leads.push(newLead);
  await writeFile(filePath, JSON.stringify(leads, null, 2), "utf8");

  return newLead;
}
