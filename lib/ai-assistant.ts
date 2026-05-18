import type { StoredConversation } from "@/lib/conversations";
import type { StoredProduct } from "@/lib/products";

export type AssistantIntent =
  | "busca_produto"
  | "negociacao"
  | "reserva"
  | "atendimento_humano"
  | "duvida_geral";

export type AssistantSuggestion = {
  confidenceLabel: "Alta" | "Media" | "Baixa";
  conversationId: string;
  dealStage: "descoberta" | "oferta" | "negociacao" | "reserva" | "suporte";
  intent: AssistantIntent;
  matchedProducts: Array<{
    id: string;
    name: string;
    price: number;
    stockQuantity: number;
  }>;
  missingData: string[];
  nextStepLabel: string;
  operationalFocusLabel: string;
  shouldEscalateToHuman: boolean;
  shouldOfferReservation: boolean;
  stockStatus: "em_estoque" | "baixo_estoque" | "sem_correspondencia" | "sem_estoque";
  suggestedReply: string;
  summary: string;
  urgencyLabel: "Agora" | "Hoje" | "Baixa";
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function getLatestClientMessage(conversation: StoredConversation) {
  const clientMessages = conversation.messages.filter(
    (message) => message.author === "cliente",
  );

  return clientMessages[clientMessages.length - 1];
}

function getClientConversationContext(conversation: StoredConversation) {
  return conversation.messages
    .filter((message) => message.author === "cliente")
    .map((message) => message.content)
    .join(" ");
}

function inferIntent(message: string): AssistantIntent {
  const normalized = normalizeText(message);

  if (
    normalized.includes("separ") ||
    normalized.includes("reserv") ||
    normalized.includes("guardar")
  ) {
    return "reserva";
  }

  if (
    normalized.includes("desconto") ||
    normalized.includes("melhorar no preco") ||
    normalized.includes("faz por") ||
    normalized.includes("consegue melhorar")
  ) {
    return "negociacao";
  }

  if (
    normalized.includes("humano") ||
    normalized.includes("atendente") ||
    normalized.includes("vendedor")
  ) {
    return "atendimento_humano";
  }

  if (
    normalized.includes("tem ") ||
    normalized.includes("voc") ||
    normalized.includes("compat") ||
    normalized.includes("preco") ||
    normalized.includes("valor")
  ) {
    return "busca_produto";
  }

  return "duvida_geral";
}

function inferGreetingOnly(message: string) {
  const normalized = normalizeText(message)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return false;
  }

  const greetingTerms = [
    "oi",
    "ola",
    "opa",
    "bom dia",
    "boa tarde",
    "boa noite",
    "tudo bem",
  ];

  return greetingTerms.some(
    (term) => normalized === term || normalized.startsWith(`${term} `),
  );
}

function inferNeedsVehicleYear(message: string) {
  const normalized = normalizeText(message);

  return (
    normalized.includes("xre") ||
    normalized.includes("titan") ||
    normalized.includes("fan") ||
    normalized.includes("cg") ||
    normalized.includes("fazer") ||
    normalized.includes("bros")
  );
}

function inferNeedsHumanSupport(message: string) {
  const normalized = normalizeText(message);

  return (
    normalized.includes("boleto") ||
    normalized.includes("nota fiscal") ||
    normalized.includes("entrega") ||
    normalized.includes("motoboy") ||
    normalized.includes("garantia") ||
    normalized.includes("desconto")
  );
}

function extractYear(message: string) {
  const yearMatch = message.match(/\b(19|20)\d{2}\b/);
  return yearMatch?.[0] ?? null;
}

function scoreProductMatch(product: StoredProduct, normalizedMessage: string) {
  const haystack = normalizeText(
    [
      product.name,
      product.category,
      product.description,
      product.compatibility ?? "",
      product.sku ?? "",
    ].join(" "),
  );

  const tokens = normalizedMessage
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  let score = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += token.length >= 5 ? 3 : 1;
    }
  }

  if (normalizedMessage.includes(normalizeText(product.name))) {
    score += 6;
  }

  return score;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });
}

function buildProductReply(product: StoredProduct, year: string | null) {
  const stockLead =
    product.stockQuantity <= 0
      ? "No momento esse item está sem estoque."
      : product.stockQuantity <= 2
        ? `Temos ${product.name} com poucas unidades no estoque.`
        : `Temos ${product.name} disponível no estoque.`;

  const compatibilityLead =
    product.compatibility && year && !normalizeText(product.compatibility).includes(year)
      ? `Antes de confirmar, preciso validar a compatibilidade com o ano ${year}.`
      : "";

  const reservationLead =
    product.stockQuantity > 0
      ? "Se quiser, posso deixar separado para retirada."
      : "Se preferir, posso te avisar assim que voltar.";

  return [stockLead, compatibilityLead, `Hoje ele está por ${formatCurrency(product.price)}.`, reservationLead]
    .filter(Boolean)
    .join(" ");
}

function buildOutOfStockReply(product: StoredProduct) {
  return [
    `No momento ${product.name} está sem estoque por aqui.`,
    `O último valor trabalhado foi ${formatCurrency(product.price)}.`,
    "Se quiser, posso te orientar em uma alternativa parecida ou registrar para retorno assim que chegar.",
  ].join(" ");
}

function inferDealStage(
  conversation: StoredConversation,
  intent: AssistantIntent,
  missingData: string[],
) {
  if (conversation.status === "reservada" || intent === "reserva") {
    return "reserva" as const;
  }

  if (intent === "negociacao") {
    return "negociacao" as const;
  }

  if (intent === "atendimento_humano") {
    return "suporte" as const;
  }

  if (missingData.length > 0 || conversation.status === "aguardando_dados") {
    return "descoberta" as const;
  }

  return "oferta" as const;
}

function inferUrgencyLabel(
  conversation: StoredConversation,
  intent: AssistantIntent,
  stockStatus: AssistantSuggestion["stockStatus"],
) {
  if (
    conversation.priorityLabel === "Quente" ||
    intent === "reserva" ||
    stockStatus === "baixo_estoque"
  ) {
    return "Agora" as const;
  }

  if (
    intent === "negociacao" ||
    conversation.status === "nova" ||
    conversation.status === "aguardando_dados"
  ) {
    return "Hoje" as const;
  }

  return "Baixa" as const;
}

function inferOperationalFocusLabel(
  dealStage: AssistantSuggestion["dealStage"],
  shouldEscalateToHuman: boolean,
  shouldOfferReservation: boolean,
) {
  if (shouldEscalateToHuman) {
    return "Assumir o atendimento";
  }

  if (shouldOfferReservation) {
    return "Fechar a reserva";
  }

  if (dealStage === "descoberta") {
    return "Coletar contexto";
  }

  if (dealStage === "oferta") {
    return "Apresentar a melhor opção";
  }

  return "Conduzir a conversa";
}

export function buildAssistantSuggestion(
  conversation: StoredConversation,
  products: StoredProduct[],
): AssistantSuggestion {
  const latestClientMessage = getLatestClientMessage(conversation);
  const messageContent = latestClientMessage?.content ?? "";
  const conversationContext = getClientConversationContext(conversation);
  const normalizedMessage = normalizeText(conversationContext || messageContent);
  const intent = inferIntent(messageContent || conversationContext);
  const year = extractYear(conversationContext || messageContent);
  const activeProducts = products.filter((product) => product.active);
  const matchedProducts = activeProducts
    .map((product) => ({
      product,
      score: scoreProductMatch(product, normalizedMessage),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ product }) => product);

  const missingData: string[] = [];

  if (inferGreetingOnly(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "descoberta",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Abrir a conversa",
      operationalFocusLabel: "Entender a necessidade",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Olá! Tudo bem? 😊 Me diga qual peça, produto ou dúvida você quer verificar que eu continuo com você por aqui.",
      summary:
        "O cliente retomou a conversa com uma saudação curta e ainda não trouxe uma nova necessidade objetiva.",
      urgencyLabel: inferUrgencyLabel(conversation, "duvida_geral", stockStatus),
    };
  }

  if (
    intent === "busca_produto" &&
    !year &&
    inferNeedsVehicleYear(conversationContext || messageContent)
  ) {
    missingData.push("ano do veículo");
  }

  if (intent === "negociacao") {
    missingData.push("limite comercial da loja");
  }

  if (intent === "busca_produto" && matchedProducts.length === 0) {
    const shouldEscalateToHuman = inferNeedsHumanSupport(messageContent);
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Baixa",
      dealStage,
      intent,
      matchedProducts: [],
      missingData,
      nextStepLabel: "Pedir mais contexto ou revisar catálogo",
      operationalFocusLabel: inferOperationalFocusLabel(
        dealStage,
        shouldEscalateToHuman,
        false,
      ),
      shouldEscalateToHuman,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Quero te ajudar certo por aqui. Me confirma o modelo completo, o ano e, se tiver, a marca da peça que você procura para eu validar no estoque.",
      summary:
        "Nenhum produto correspondente foi encontrado no catálogo local para esta conversa.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  if (intent === "atendimento_humano") {
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage,
      intent,
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Transferir para humano",
      operationalFocusLabel: inferOperationalFocusLabel(dealStage, true, false),
      shouldEscalateToHuman: true,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Perfeito. Vou te encaminhar para um vendedor continuar daqui e te atender da melhor forma.",
      summary: "O cliente demonstrou preferência por atendimento humano.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  if (intent === "negociacao") {
    const shouldOfferReservation = matchedProducts.some(
      (product) => product.stockQuantity > 0,
    );
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = shouldOfferReservation
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: matchedProducts.length > 0 ? "Media" : "Baixa",
      dealStage,
      intent,
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Levar para aprovacao comercial",
      operationalFocusLabel: inferOperationalFocusLabel(
        dealStage,
        true,
        shouldOfferReservation,
      ),
      shouldEscalateToHuman: true,
      shouldOfferReservation,
      stockStatus,
      suggestedReply:
        "Consigo verificar isso para você. Vou encaminhar aqui para validar a melhor condição e já te responder.",
      summary:
        "Pedido com viés de negociação. Melhor levar para atendimento humano ou regra comercial.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  if (intent === "reserva" || conversation.status === "reservada") {
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = matchedProducts.some((product) => product.stockQuantity > 0)
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage,
      intent,
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Confirmar dados da retirada",
      operationalFocusLabel: inferOperationalFocusLabel(dealStage, false, false),
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Perfeito 😊 Posso deixar separado. Me confirma no nome de quem fica a retirada e o melhor horario para passar aqui.",
      summary:
        "A conversa entrou em momento de reserva e precisa coletar dados operacionais finais.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  if (missingData.length > 0) {
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = matchedProducts.some((product) => product.stockQuantity > 0)
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage,
      intent,
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Coletar dado faltante",
      operationalFocusLabel: inferOperationalFocusLabel(dealStage, false, false),
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Tenho algumas opções compatíveis por aqui 😊 Para te passar certo, você consegue me confirmar o ano do veículo?",
      summary:
        "A intenção foi entendida, mas ainda falta contexto mínimo para responder com segurança.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  const topProduct = matchedProducts[0];

  if (!topProduct) {
    const dealStage = inferDealStage(conversation, intent, missingData);
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Baixa",
      dealStage,
      intent,
      matchedProducts: [],
      missingData,
      nextStepLabel: "Pedir mais detalhes",
      operationalFocusLabel: inferOperationalFocusLabel(dealStage, false, false),
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply:
        "Consigo verificar para você. Me manda o modelo completo ou uma referência da peça para eu localizar certinho no estoque.",
      summary:
        "Não houve correspondência suficiente para montar uma oferta comercial segura.",
      urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
    };
  }

  const stockStatus: AssistantSuggestion["stockStatus"] =
    topProduct.stockQuantity <= 0
      ? "sem_estoque"
      : topProduct.stockQuantity <= 2
        ? "baixo_estoque"
        : "em_estoque";
  const shouldEscalateToHuman = inferNeedsHumanSupport(messageContent);
  const shouldOfferReservation = topProduct.stockQuantity > 0;
  const dealStage = inferDealStage(conversation, intent, missingData);

  return {
    conversationId: conversation.id,
    confidenceLabel: topProduct.stockQuantity > 0 ? "Alta" : "Media",
    dealStage,
    intent,
    matchedProducts: matchedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
    })),
    missingData,
    nextStepLabel:
      topProduct.stockQuantity > 0 ? "Responder e oferecer reserva" : "Informar indisponibilidade",
    operationalFocusLabel: inferOperationalFocusLabel(
      dealStage,
      shouldEscalateToHuman,
      shouldOfferReservation,
    ),
    shouldEscalateToHuman,
    shouldOfferReservation,
    stockStatus,
    suggestedReply:
      topProduct.stockQuantity > 0
        ? buildProductReply(topProduct, year)
        : buildOutOfStockReply(topProduct),
    summary:
      topProduct.stockQuantity > 0
        ? "A conversa já tem contexto suficiente para uma resposta comercial objetiva."
        : "Produto identificado, mas sem saldo no estoque local.",
    urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
  };
}
