import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveDataFilePath } from "@/lib/storage-path";
import { isSupabaseServerConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ConversationStatus =
  | "nova"
  | "aguardando_dados"
  | "respondida_pela_ia"
  | "aguardando_humano"
  | "em_atendimento_humano"
  | "reservada";

export type MessageAuthor = "cliente" | "ia" | "humano" | "sistema";
export type MessageInputType = "texto" | "audio";

export type StoredMessage = {
  author: MessageAuthor;
  content: string;
  id: string;
  inputType?: MessageInputType;
  timestamp: string;
};

export type StoredConversation = {
  clientName: string;
  clientPhone: string;
  dealStage?:
    | "novo_contato"
    | "qualificacao"
    | "oferta_enviada"
    | "negociacao"
    | "reserva_em_andamento"
    | "fechado"
    | "parado";
  id: string;
  messages: StoredMessage[];
  priorityLabel: "Quente" | "Médio" | "Humano";
  reservedProduct?: string;
  reservedPickupName?: string;
  reservedPickupWindow?: string;
  status: ConversationStatus;
  updatedAt: string;
  userId: string;
};

export type ConversationMessageInput = {
  author: MessageAuthor;
  content: string;
  inputType?: MessageInputType;
  userId: string;
};

export type ConversationReservationInput = {
  pickupName: string;
  pickupWindow: string;
  productName: string;
  userId: string;
};

type SupabaseConversationRow = {
  client_name: string;
  client_phone: string;
  deal_stage: string | null;
  id: string;
  priority_label: "Quente" | "Médio" | "Humano";
  reserved_pickup_name: string | null;
  reserved_pickup_window: string | null;
  reserved_product: string | null;
  status: ConversationStatus;
  updated_at: string;
  user_id: string;
};

type SupabaseConversationMessageRow = {
  author: MessageAuthor;
  content: string;
  conversation_id: string;
  id: string;
  input_type: MessageInputType | null;
  timestamp: string;
};

const PARADO_AFTER_HOURS = 12;

function createDeterministicId(...parts: string[]) {
  const hash = createHash("sha1").update(parts.join("::")).digest("hex").slice(0, 32);
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function inferDealStageFromStatus(status: ConversationStatus) {
  switch (status) {
    case "nova":
      return "novo_contato" as const;
    case "aguardando_dados":
      return "qualificacao" as const;
    case "respondida_pela_ia":
      return "oferta_enviada" as const;
    case "aguardando_humano":
      return "negociacao" as const;
    case "em_atendimento_humano":
      return "negociacao" as const;
    case "reservada":
      return "reserva_em_andamento" as const;
    default:
      return "novo_contato" as const;
  }
}

function inferClosedSignal(conversation: StoredConversation) {
  const latestMessage = conversation.messages[conversation.messages.length - 1];
  const latestContent = normalizeText(latestMessage?.content ?? "");

  if (!latestContent) {
    return false;
  }

  const directCloseTerms = [
    "pedido concluido",
    "venda concluida",
    "retirada concluida",
    "compra finalizada",
    "pagamento aprovado",
    "pagamento confirmado",
    "fechado",
    "fechou",
  ];

  if (directCloseTerms.some((term) => latestContent.includes(term))) {
    return true;
  }

  const thanksTerms = ["obrigado", "obrigada", "valeu", "agradeco"];
  const pickupTerms = [
    "vou passar",
    "vou retirar",
    "passo ai",
    "retirar ai",
    "buscar ai",
    "pegar ai",
  ];

  return (
    conversation.status === "reservada" &&
    latestMessage?.author === "cliente" &&
    thanksTerms.some((term) => latestContent.includes(term)) &&
    pickupTerms.some((term) => latestContent.includes(term))
  );
}

function inferParadoSignal(conversation: StoredConversation) {
  if (
    conversation.status === "reservada" ||
    conversation.status === "em_atendimento_humano" ||
    conversation.status === "aguardando_humano"
  ) {
    return false;
  }

  const latestMessage = conversation.messages[conversation.messages.length - 1];

  if (!latestMessage || latestMessage.author === "cliente") {
    return false;
  }

  const updatedAtMs = new Date(conversation.updatedAt).getTime();

  if (Number.isNaN(updatedAtMs)) {
    return false;
  }

  return Date.now() - updatedAtMs >= PARADO_AFTER_HOURS * 60 * 60 * 1000;
}

function inferLifecycleDealStage(conversation: StoredConversation) {
  if (inferClosedSignal(conversation)) {
    return "fechado" as const;
  }

  if (inferParadoSignal(conversation)) {
    return "parado" as const;
  }

  if (
    conversation.dealStage &&
    conversation.dealStage !== "fechado" &&
    conversation.dealStage !== "parado"
  ) {
    return conversation.dealStage;
  }

  return inferDealStageFromStatus(conversation.status);
}

function refreshConversationLifecycle(conversation: StoredConversation) {
  const nextDealStage = inferLifecycleDealStage(conversation);
  const nextPriorityLabel =
    nextDealStage === "fechado" || nextDealStage === "parado"
      ? "Médio"
      : inferPriorityFromStatus(conversation.status);

  if (
    conversation.dealStage === nextDealStage &&
    conversation.priorityLabel === nextPriorityLabel
  ) {
    return conversation;
  }

  return {
    ...conversation,
    dealStage: nextDealStage,
    priorityLabel: nextPriorityLabel,
  };
}

function resolveConversationsFilePath() {
  return resolveDataFilePath(
    process.env.CONVERSATIONS_FILE_PATH,
    "conversations.json",
  );
}

function mapSupabaseMessage(row: SupabaseConversationMessageRow): StoredMessage {
  return {
    author: row.author,
    content: row.content,
    id: row.id,
    inputType: row.input_type ?? undefined,
    timestamp: row.timestamp,
  };
}

function mapSupabaseConversation(
  row: SupabaseConversationRow,
  messages: StoredMessage[],
): StoredConversation {
  return {
    clientName: row.client_name,
    clientPhone: row.client_phone,
    dealStage: (row.deal_stage as StoredConversation["dealStage"]) ?? undefined,
    id: row.id,
    messages,
    priorityLabel: row.priority_label,
    reservedPickupName: row.reserved_pickup_name ?? undefined,
    reservedPickupWindow: row.reserved_pickup_window ?? undefined,
    reservedProduct: row.reserved_product ?? undefined,
    status: row.status,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
}

async function listSupabaseConversationMessages(conversationIds: string[]) {
  if (conversationIds.length === 0) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("*")
    .in("conversation_id", conversationIds)
    .order("timestamp", { ascending: true });

  if (error) {
    throw new Error(`Supabase conversations: ${error.message}`);
  }

  return (data ?? []) as SupabaseConversationMessageRow[];
}

async function listSupabaseConversationsByUserId(userId: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase conversations: ${error.message}`);
  }

  const rows = (data ?? []) as SupabaseConversationRow[];
  const messages = await listSupabaseConversationMessages(rows.map((row) => row.id));
  const messagesByConversation = new Map<string, StoredMessage[]>();

  for (const message of messages) {
    const current = messagesByConversation.get(message.conversation_id) ?? [];
    current.push(mapSupabaseMessage(message));
    messagesByConversation.set(message.conversation_id, current);
  }

  return rows.map((row) =>
    mapSupabaseConversation(row, messagesByConversation.get(row.id) ?? []),
  );
}

async function dedupeSupabaseConversationsForUser(userId: string) {
  const conversations = await listSupabaseConversationsByUserId(userId);
  const supabase = getSupabaseServerClient();
  const seenPhones = new Set<string>();
  const duplicateIds: string[] = [];

  for (const conversation of conversations) {
    const phoneKey = conversation.clientPhone.trim();

    if (!phoneKey) {
      continue;
    }

    if (seenPhones.has(phoneKey)) {
      duplicateIds.push(conversation.id);
      continue;
    }

    seenPhones.add(phoneKey);
  }

  if (duplicateIds.length > 0) {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .in("id", duplicateIds)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Supabase conversations: ${error.message}`);
    }
  }

  return duplicateIds.length > 0
    ? listSupabaseConversationsByUserId(userId)
    : conversations;
}

async function insertSupabaseConversation(conversation: StoredConversation) {
  const supabase = getSupabaseServerClient();
  const { error: conversationError } = await supabase.from("conversations").upsert(
    {
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
    },
    { onConflict: "id" },
  );

  if (conversationError) {
    throw new Error(`Supabase conversations: ${conversationError.message}`);
  }

  if (conversation.messages.length > 0) {
    const { error: messagesError } = await supabase
      .from("conversation_messages")
      .upsert(
        conversation.messages.map((message) => ({
          author: message.author,
          content: message.content,
          conversation_id: conversation.id,
          id: message.id,
          input_type: message.inputType ?? null,
          timestamp: message.timestamp,
        })),
        { onConflict: "id" },
      );

    if (messagesError) {
      throw new Error(`Supabase conversations: ${messagesError.message}`);
    }
  }
}

async function updateSupabaseConversation(conversation: StoredConversation) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("conversations")
    .update({
      client_name: conversation.clientName,
      client_phone: conversation.clientPhone,
      deal_stage: conversation.dealStage ?? null,
      priority_label: conversation.priorityLabel,
      reserved_pickup_name: conversation.reservedPickupName ?? null,
      reserved_pickup_window: conversation.reservedPickupWindow ?? null,
      reserved_product: conversation.reservedProduct ?? null,
      status: conversation.status,
      updated_at: conversation.updatedAt,
      user_id: conversation.userId,
    })
    .eq("id", conversation.id)
    .eq("user_id", conversation.userId);

  if (error) {
    throw new Error(`Supabase conversations: ${error.message}`);
  }
}

async function insertSupabaseConversationMessage(
  conversationId: string,
  message: StoredMessage,
) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("conversation_messages").insert({
    author: message.author,
    content: message.content,
    conversation_id: conversationId,
    id: message.id,
    input_type: message.inputType ?? null,
    timestamp: message.timestamp,
  });

  if (error) {
    throw new Error(`Supabase conversations: ${error.message}`);
  }
}

async function readConversations(): Promise<StoredConversation[]> {
  const filePath = resolveConversationsFilePath();

  try {
    const fileContent = await readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContent) as StoredConversation[];
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

async function writeConversations(conversations: StoredConversation[]) {
  const filePath = resolveConversationsFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(conversations, null, 2), "utf8");
}

function buildSeedConversations(userId: string): StoredConversation[] {
  const now = new Date();
  const minutesAgo = (minutes: number) =>
    new Date(now.getTime() - minutes * 60_000).toISOString();

  return [
    {
      id: createDeterministicId(userId, "seed", "11987654321"),
      userId,
      clientName: "Carlos XRE 300",
      clientPhone: "11987654321",
      dealStage: "reserva_em_andamento",
      status: "reservada",
      priorityLabel: "Quente",
      reservedProduct: "Correia Gates XRE 300 2020",
      updatedAt: minutesAgo(6),
      messages: [
        {
          id: createDeterministicId(userId, "seed-message", "11987654321", "1"),
          author: "cliente",
          content: "Boa tarde, vocês têm correia da XRE 300?",
          inputType: "texto",
          timestamp: minutesAgo(12),
        },
        {
          id: createDeterministicId(userId, "seed-message", "11987654321", "2"),
          author: "ia",
          content: "Boa tarde 😊 Você sabe me informar o ano da moto?",
          inputType: "texto",
          timestamp: minutesAgo(11),
        },
        {
          id: createDeterministicId(userId, "seed-message", "11987654321", "3"),
          author: "cliente",
          content: "2020",
          inputType: "texto",
          timestamp: minutesAgo(10),
        },
        {
          id: createDeterministicId(userId, "seed-message", "11987654321", "4"),
          author: "ia",
          content:
            "Temos sim 😊 Correia Gates compatível com XRE 300 2020 por R$189,90. Posso deixar separada?",
          inputType: "texto",
          timestamp: minutesAgo(8),
        },
      ],
    },
    {
      id: createDeterministicId(userId, "seed", "11999887766"),
      userId,
      clientName: "Juliana Titan",
      clientPhone: "11999887766",
      dealStage: "qualificacao",
      status: "aguardando_dados",
      priorityLabel: "Médio",
      updatedAt: minutesAgo(18),
      messages: [
        {
          id: createDeterministicId(userId, "seed-message", "11999887766", "1"),
          author: "cliente",
          content: "Tem kit relação pra Titan?",
          inputType: "texto",
          timestamp: minutesAgo(20),
        },
        {
          id: createDeterministicId(userId, "seed-message", "11999887766", "2"),
          author: "ia",
          content: "Temos algumas opções 😊 Você consegue me dizer o ano da moto?",
          inputType: "texto",
          timestamp: minutesAgo(18),
        },
      ],
    },
    {
      id: createDeterministicId(userId, "seed", "11995554433"),
      userId,
      clientName: "Rafael Capacete",
      clientPhone: "11995554433",
      dealStage: "negociacao",
      status: "em_atendimento_humano",
      priorityLabel: "Humano",
      updatedAt: minutesAgo(35),
      messages: [
        {
          id: createDeterministicId(userId, "seed-message", "11995554433", "1"),
          author: "cliente",
          content: "Consegue melhorar no preço desse capacete?",
          inputType: "texto",
          timestamp: minutesAgo(40),
        },
        {
          id: createDeterministicId(userId, "seed-message", "11995554433", "2"),
          author: "sistema",
          content: "Conversa direcionada para atendimento humano.",
          inputType: "texto",
          timestamp: minutesAgo(35),
        },
      ],
    },
  ];
}

async function ensureSeedConversations(userId: string) {
  if (isSupabaseServerConfigured()) {
    const existing = await dedupeSupabaseConversationsForUser(userId);

    if (existing.length > 0) {
      return existing;
    }

    const seededConversations = buildSeedConversations(userId);

    for (const conversation of seededConversations) {
      await insertSupabaseConversation(conversation);
    }

    return dedupeSupabaseConversationsForUser(userId);
  }

  const conversations = await readConversations();
  const hasUserConversation = conversations.some((item) => item.userId === userId);

  if (hasUserConversation) {
    return conversations;
  }

  const seeded = [...conversations, ...buildSeedConversations(userId)];
  await writeConversations(seeded);
  return seeded;
}

async function refreshLifecycleStateForUser(userId: string) {
  const conversations = await ensureSeedConversations(userId);
  let hasChanges = false;

  const refreshed = conversations.map((conversation) => {
    if (conversation.userId !== userId) {
      return conversation;
    }

    const nextConversation = refreshConversationLifecycle(conversation);

    if (nextConversation !== conversation) {
      hasChanges = true;
    }

    return nextConversation;
  });

  if (hasChanges) {
    if (isSupabaseServerConfigured()) {
      for (const conversation of refreshed) {
        if (conversation.userId === userId) {
          await updateSupabaseConversation(conversation);
        }
      }
    } else {
      await writeConversations(refreshed);
    }
  }

  return refreshed;
}

export async function listConversationsByUserId(userId: string) {
  const seeded = await refreshLifecycleStateForUser(userId);
  return seeded
    .filter((conversation) => conversation.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getConversationById(conversationId: string, userId: string) {
  const seeded = await refreshLifecycleStateForUser(userId);
  return (
    seeded.find(
      (conversation) =>
        conversation.id === conversationId && conversation.userId === userId,
    ) ?? null
  );
}

function inferPriorityFromStatus(status: ConversationStatus) {
  if (status === "em_atendimento_humano") {
    return "Humano" as const;
  }

  if (status === "reservada") {
    return "Quente" as const;
  }

  return "Médio" as const;
}

export async function appendConversationMessage(
  conversationId: string,
  input: ConversationMessageInput,
) {
  const normalizedContent = input.content.trim();

  if (normalizedContent.length < 2) {
    throw new Error("Informe a mensagem da conversa.");
  }

  const currentConversation = await getConversationById(conversationId, input.userId);

  if (!currentConversation) {
    throw new Error("Conversa não encontrada.");
  }
  const nextStatus: ConversationStatus =
    currentConversation.status === "reservada"
      ? "reservada"
      : currentConversation.status === "em_atendimento_humano" &&
          input.author === "cliente"
        ? "em_atendimento_humano"
      : input.author === "cliente"
        ? "nova"
        : input.author === "ia"
          ? "respondida_pela_ia"
          : input.author === "humano"
            ? "em_atendimento_humano"
            : currentConversation.status;

  const newMessage: StoredMessage = {
    id: randomUUID(),
    author: input.author,
    content: normalizedContent,
    inputType: input.inputType ?? "texto",
    timestamp: new Date().toISOString(),
  };

  const updatedConversation: StoredConversation = {
    ...currentConversation,
    status: nextStatus,
    priorityLabel: inferPriorityFromStatus(nextStatus),
    updatedAt: newMessage.timestamp,
    messages: [
      ...currentConversation.messages,
      newMessage,
    ],
  };

  const normalizedConversation = refreshConversationLifecycle(updatedConversation);

  if (isSupabaseServerConfigured()) {
    await updateSupabaseConversation(normalizedConversation);
    await insertSupabaseConversationMessage(conversationId, newMessage);
  } else {
    const conversations = await readConversations();
    const conversationIndex = conversations.findIndex(
      (item) => item.id === conversationId && item.userId === input.userId,
    );

    if (conversationIndex === -1) {
      throw new Error("Conversa não encontrada.");
    }

    conversations[conversationIndex] = normalizedConversation;
    await writeConversations(conversations);
  }

  return normalizedConversation;
}

export async function syncConversationAssistantState(params: {
  conversationId: string;
  dealStage: StoredConversation["dealStage"];
  status: ConversationStatus;
  userId: string;
}) {
  const currentConversation = await getConversationById(
    params.conversationId,
    params.userId,
  );

  if (!currentConversation) {
    throw new Error("Conversa não encontrada.");
  }

  const updatedConversation: StoredConversation = refreshConversationLifecycle({
    ...currentConversation,
    dealStage: params.dealStage,
    priorityLabel: inferPriorityFromStatus(params.status),
    status: params.status,
  });

  if (isSupabaseServerConfigured()) {
    await updateSupabaseConversation(updatedConversation);
  } else {
    const conversations = await readConversations();
    const conversationIndex = conversations.findIndex(
      (item) =>
        item.id === params.conversationId && item.userId === params.userId,
    );

    if (conversationIndex === -1) {
      throw new Error("Conversa não encontrada.");
    }

    conversations[conversationIndex] = updatedConversation;
    await writeConversations(conversations);
  }

  return updatedConversation;
}

export async function reserveConversationProduct(
  conversationId: string,
  input: ConversationReservationInput,
) {
  const normalizedProductName = input.productName.trim();
  const normalizedPickupName = input.pickupName.trim();
  const normalizedPickupWindow = input.pickupWindow.trim();

  if (!normalizedProductName) {
    throw new Error("Produto inválido para reserva.");
  }

  if (normalizedPickupName.length < 2) {
    throw new Error("Informe o nome para retirada.");
  }

  if (normalizedPickupWindow.length < 2) {
    throw new Error("Informe o horário ou período de retirada.");
  }

  const currentConversation = await getConversationById(conversationId, input.userId);

  if (!currentConversation) {
    throw new Error("Conversa não encontrada.");
  }
  const timestamp = new Date().toISOString();
  const systemMessage: StoredMessage = {
    id: randomUUID(),
    author: "sistema",
    content: `Reserva criada para ${normalizedProductName} em nome de ${normalizedPickupName}.`,
    inputType: "texto",
    timestamp,
  };
  const aiMessage: StoredMessage = {
    id: randomUUID(),
    author: "ia",
    content:
      `Perfeito 😊 Já deixei separado por aqui no nome de ${normalizedPickupName} para ${normalizedPickupWindow}.`,
    inputType: "texto",
    timestamp,
  };

  const updatedConversation: StoredConversation = {
    ...currentConversation,
    dealStage: "reserva_em_andamento",
    reservedProduct: normalizedProductName,
    reservedPickupName: normalizedPickupName,
    reservedPickupWindow: normalizedPickupWindow,
    status: "reservada",
    priorityLabel: "Quente",
    updatedAt: timestamp,
    messages: [
      ...currentConversation.messages,
      systemMessage,
      aiMessage,
    ],
  };

  const normalizedConversation = refreshConversationLifecycle(updatedConversation);

  if (isSupabaseServerConfigured()) {
    await updateSupabaseConversation(normalizedConversation);
    await insertSupabaseConversationMessage(conversationId, systemMessage);
    await insertSupabaseConversationMessage(conversationId, aiMessage);
  } else {
    const conversations = await readConversations();
    const conversationIndex = conversations.findIndex(
      (item) => item.id === conversationId && item.userId === input.userId,
    );

    if (conversationIndex === -1) {
      throw new Error("Conversa não encontrada.");
    }

    conversations[conversationIndex] = normalizedConversation;
    await writeConversations(conversations);
  }

  return normalizedConversation;
}

export async function findConversationByClientPhone(clientPhone: string, userId: string) {
  const seeded = await refreshLifecycleStateForUser(userId);
  const normalizedPhone = clientPhone.trim();

  return (
    seeded.find(
      (conversation) =>
        conversation.userId === userId &&
        conversation.clientPhone.trim() === normalizedPhone,
    ) ?? null
  );
}

export async function createIncomingConversation(params: {
  clientName?: string;
  clientPhone: string;
  content: string;
  inputType?: MessageInputType;
  userId: string;
}) {
  const normalizedPhone = params.clientPhone.trim();
  const normalizedContent = params.content.trim();

  if (!normalizedPhone || !normalizedContent) {
    throw new Error("Dados inválidos para criar a conversa.");
  }

  const timestamp = new Date().toISOString();

  const newConversation: StoredConversation = {
    id: randomUUID(),
    userId: params.userId,
    clientName: params.clientName?.trim() || normalizedPhone,
    clientPhone: normalizedPhone,
    dealStage: "novo_contato",
    status: "nova",
    priorityLabel: "Médio",
    updatedAt: timestamp,
    messages: [
      {
        id: randomUUID(),
        author: "cliente",
        content: normalizedContent,
        inputType: params.inputType ?? "texto",
        timestamp,
      },
    ],
  };

  const normalizedConversation = refreshConversationLifecycle(newConversation);

  if (isSupabaseServerConfigured()) {
    await ensureSeedConversations(params.userId);
    await insertSupabaseConversation(normalizedConversation);
  } else {
    const conversations = await ensureSeedConversations(params.userId);
    const updatedConversations = [...conversations, normalizedConversation];
    await writeConversations(updatedConversations);
  }

  return normalizedConversation;
}

export async function updateConversationHandoff(
  conversationId: string,
  userId: string,
  humanActive: boolean,
) {
  const currentConversation = await getConversationById(conversationId, userId);

  if (!currentConversation) {
    throw new Error("Conversa não encontrada.");
  }
  const newStatus: ConversationStatus = humanActive
    ? "em_atendimento_humano"
    : currentConversation.reservedProduct
      ? "reservada"
      : "respondida_pela_ia";
  const handoffMessage: StoredMessage = {
    id: randomUUID(),
    author: "sistema",
    content: humanActive
      ? "Atendimento assumido manualmente pela loja."
      : "Atendimento devolvido para o fluxo assistido.",
    inputType: "texto",
    timestamp: new Date().toISOString(),
  };

  const updatedConversation: StoredConversation = {
    ...currentConversation,
    priorityLabel: humanActive
      ? "Humano"
      : inferPriorityFromStatus(newStatus),
    status: newStatus,
    updatedAt: handoffMessage.timestamp,
    messages: [
      ...currentConversation.messages,
      handoffMessage,
    ],
  };

  const normalizedConversation = refreshConversationLifecycle(updatedConversation);

  if (isSupabaseServerConfigured()) {
    await updateSupabaseConversation(normalizedConversation);
    await insertSupabaseConversationMessage(conversationId, handoffMessage);
  } else {
    const conversations = await readConversations();
    const conversationIndex = conversations.findIndex(
      (item) => item.id === conversationId && item.userId === userId,
    );

    if (conversationIndex === -1) {
      throw new Error("Conversa não encontrada.");
    }

    conversations[conversationIndex] = normalizedConversation;
    await writeConversations(conversations);
  }

  return normalizedConversation;
}

export async function markConversationAsHumanByClientPhone(
  clientPhone: string,
  userId: string,
  humanMessageContent?: string,
) {
  const normalizedPhone = clientPhone.trim();
  const normalizedHumanMessage = humanMessageContent?.trim() ?? "";

  if (!normalizedPhone) {
    throw new Error("Telefone do cliente inválido.");
  }

  const currentConversation = await findConversationByClientPhone(normalizedPhone, userId);

  if (!currentConversation) {
    return null;
  }
  const timestamp = new Date().toISOString();
  const alreadyInHumanHandoff =
    currentConversation.status === "em_atendimento_humano";

  const updatedConversation: StoredConversation = {
    ...currentConversation,
    priorityLabel: "Humano",
    status: "em_atendimento_humano",
    updatedAt: timestamp,
    messages: [
      ...currentConversation.messages,
      ...(alreadyInHumanHandoff
        ? []
        : [
            {
              id: randomUUID(),
              author: "sistema" as const,
              content:
                "Atendimento humano ativado automaticamente por mensagem enviada pelo número oficial da loja.",
              inputType: "texto" as const,
              timestamp,
            },
          ]),
      ...(normalizedHumanMessage
        ? [
            {
              id: randomUUID(),
              author: "humano" as const,
              content: normalizedHumanMessage,
              inputType: "texto" as const,
              timestamp,
            },
          ]
        : []),
    ],
  };

  const normalizedConversation = refreshConversationLifecycle(updatedConversation);

  if (isSupabaseServerConfigured()) {
    await updateSupabaseConversation(normalizedConversation);

    const appendedMessages = normalizedConversation.messages.slice(
      currentConversation.messages.length,
    );

    for (const message of appendedMessages) {
      await insertSupabaseConversationMessage(normalizedConversation.id, message);
    }
  } else {
    const conversations = await readConversations();
    const conversationIndex = conversations.findIndex(
      (item) => item.clientPhone.trim() === normalizedPhone && item.userId === userId,
    );

    if (conversationIndex === -1) {
      return null;
    }

    conversations[conversationIndex] = normalizedConversation;
    await writeConversations(conversations);
  }

  return normalizedConversation;
}
