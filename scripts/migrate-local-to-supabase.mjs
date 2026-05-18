import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env.local");
const dataDir = path.join(rootDir, "data");

function parseEnvFile(content) {
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

async function readJsonIfExists(filename) {
  try {
    const raw = await readFile(path.join(dataDir, filename), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function main() {
  const envContent = await readFile(envPath, "utf8");
  const env = parseEnvFile(envContent);
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: /** @type {never} */ (WebSocket) },
  });

  const users = await readJsonIfExists("users.json");
  const products = await readJsonIfExists("products.json");
  const conversations = await readJsonIfExists("conversations.json");
  const leads = await readJsonIfExists("leads.json");

  if (users.length > 0) {
    const { error } = await supabase.from("users").upsert(
      users.map((user) => ({
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
      })),
      { onConflict: "id" },
    );

    if (error) {
      throw new Error(`Falha ao migrar users: ${error.message}`);
    }
  }

  if (products.length > 0) {
    const { error } = await supabase.from("products").upsert(
      products.map((product) => ({
        active: product.active,
        category: product.category,
        compatibility: product.compatibility ?? null,
        created_at: product.createdAt,
        description: product.description,
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku ?? null,
        stock_quantity: product.stockQuantity,
        updated_at: product.updatedAt,
        user_id: product.userId,
      })),
      { onConflict: "id" },
    );

    if (error) {
      throw new Error(`Falha ao migrar products: ${error.message}`);
    }
  }

  if (conversations.length > 0) {
    const { error: conversationsError } = await supabase.from("conversations").upsert(
      conversations.map((conversation) => ({
        client_name: conversation.clientName,
        client_phone: conversation.clientPhone,
        deal_stage: conversation.dealStage ?? null,
        id: conversation.id,
        priority_label: conversation.priorityLabel,
        reserved_pickup_name: conversation.reservedPickupName ?? null,
        reserved_pickup_window: conversation.reservedPickupWindow ?? null,
        reserved_product: conversation.reservedProduct ?? null,
        status: conversation.status,
        updated_at: conversation.updatedAt,
        user_id: conversation.userId,
      })),
      { onConflict: "id" },
    );

    if (conversationsError) {
      throw new Error(`Falha ao migrar conversations: ${conversationsError.message}`);
    }

    const messages = conversations.flatMap((conversation) =>
      (conversation.messages ?? []).map((message) => ({
        author: message.author,
        content: message.content,
        conversation_id: conversation.id,
        id: message.id,
        input_type: message.inputType ?? null,
        timestamp: message.timestamp,
      })),
    );

    if (messages.length > 0) {
      const { error: messagesError } = await supabase
        .from("conversation_messages")
        .upsert(messages, { onConflict: "id" });

      if (messagesError) {
        throw new Error(`Falha ao migrar conversation_messages: ${messagesError.message}`);
      }
    }
  }

  if (leads.length > 0) {
    const { error } = await supabase.from("leads").insert(
      leads.map((lead) => ({
        created_at: lead.createdAt,
        email: lead.email,
        name: lead.name,
        niche: lead.niche,
        phone: lead.phone ?? null,
        source: lead.source ?? "landing-page",
        store_name: lead.storeName,
      })),
    );

    if (error) {
      throw new Error(`Falha ao migrar leads: ${error.message}`);
    }
  }

  console.log(
    `Migração concluída. users=${users.length} products=${products.length} conversations=${conversations.length} leads=${leads.length}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
