import type { ConversationStatus, StoredConversation } from "@/lib/conversations";
import type { StoredProduct } from "@/lib/products";
import {
  getAssistantMatrixScenario,
  renderAssistantMatrixText,
} from "@/lib/assistant-response-matrix";

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
  suggestedConversationDealStage?: NonNullable<StoredConversation["dealStage"]>;
  suggestedConversationStatus?: ConversationStatus;
  suggestedOperationalStatus?: string;
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

function asksForPrice(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("preco") || normalized.includes("valor");
}

function asksForStock(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("tem em estoque") ||
    normalized.includes("tem pronta entrega") ||
    normalized.includes("disponivel") ||
    normalized.includes("disponibilidade") ||
    normalized.includes("tem ai") ||
    normalized.includes("tem dessa")
  );
}

function asksForStoreHours(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("que horas") ||
    normalized.includes("qual horario") ||
    normalized.includes("horario") ||
    normalized.includes("abre amanha") ||
    normalized.includes("funciona ate")
  );
}

function asksForCompatibility(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("serve") || normalized.includes("compat");
}

function asksForPaymentMethods(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("forma de pagamento") ||
    normalized.includes("formas de pagamento") ||
    normalized.includes("aceita cartao") ||
    normalized.includes("aceita pix") ||
    normalized.includes("parcel") ||
    normalized.includes("pagamento")
  );
}

function asksForDelivery(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("entrega") ||
    normalized.includes("motoboy") ||
    normalized.includes("entregam") ||
    normalized.includes("levar hoje") ||
    normalized.includes("envia")
  );
}

function asksForWarranty(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("garantia");
}

function asksForPhoto(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("manda foto") || normalized.includes("envia foto");
}

function asksForAlternativeBrand(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("outra marca") || normalized.includes("outra opcao");
}

function signalsWillThink(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("vou pensar") || normalized.includes("depois eu vejo");
}

function comparesWithCompetitor(message: string) {
  const normalized = normalizeText(message);
  return normalized.includes("concorrente") || normalized.includes("mais barato");
}

function signalsThanks(message: string) {
  const normalized = normalizeText(message);
  return normalized === "obrigado" || normalized === "obrigada" || normalized.includes("valeu");
}

function signalsPurchaseClosed(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("fechado") ||
    normalized.includes("fechou") ||
    normalized.includes("vou ficar com essa") ||
    normalized.includes("pode separar")
  );
}

function signalsAfterSalesProblem(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("defeito") ||
    normalized.includes("veio errado") ||
    normalized.includes("problema com a peca") ||
    normalized.includes("troca") ||
    normalized.includes("devolucao")
  );
}

function looksLikeMultiItemRequest(message: string) {
  const normalized = normalizeText(message);

  const separators =
    normalized.includes(",") ||
    normalized.includes("/") ||
    normalized.includes(" e ") ||
    normalized.includes("junto");

  const itemHints = [
    "pastilha",
    "oleo",
    "filtro",
    "relacao",
    "capacete",
    "corrente",
    "vela",
    "retrovisor",
    "pneu",
    "kit",
  ];

  const matchedHints = itemHints.filter((hint) => normalized.includes(hint)).length;

  return separators && matchedHints >= 2;
}

function looksLikeDirectQuestion(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("?") ||
    asksForPrice(message) ||
    asksForStock(message) ||
    asksForStoreHours(message) ||
    asksForPaymentMethods(message) ||
    asksForDelivery(message) ||
    asksForWarranty(message) ||
    asksForPhoto(message) ||
    normalized.includes("tem ") ||
    normalized.includes("serve") ||
    normalized.includes("compat")
  );
}

function hasStrongStoredContext(conversation: StoredConversation) {
  return conversation.messages.some((message) => {
    if (message.author !== "cliente") {
      return false;
    }

    const content = normalizeText(message.content);
    return (
      /\b(19|20)\d{2}\b/.test(content) ||
      content.includes("xre") ||
      content.includes("titan") ||
      content.includes("fan") ||
      content.includes("fazer") ||
      content.includes("capacete") ||
      content.includes("pastilha") ||
      content.includes("oleo") ||
      content.includes("relacao")
    );
  });
}

function latestKnownProductReference(
  conversation: StoredConversation,
  matchedProducts: StoredProduct[],
) {
  return matchedProducts[0]?.name ?? conversation.reservedProduct ?? "essa peca";
}

function signalsShortContextReference(message: string) {
  const normalized = normalizeText(message)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const references = [
    "essa mesmo",
    "esse mesmo",
    "essa",
    "esse",
    "aquela",
    "o mesmo",
    "isso",
    "isso mesmo",
  ];

  return references.includes(normalized);
}

function isShortAudioTranscription(message: string) {
  const normalized = normalizeText(message)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return true;
  }

  const tokenCount = normalized.split(" ").filter(Boolean).length;
  return tokenCount <= 5;
}

function isConfusingAudioTranscription(message: string) {
  const normalized = normalizeText(message)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return true;
  }

  return (
    normalized.includes("nao sei o nome") ||
    normalized.includes("acho que e") ||
    normalized.includes("nao lembro") ||
    normalized.includes("tipo assim") ||
    normalized.includes("negocio da moto") ||
    normalized.length > 60
  );
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

function buildMatrixReply(
  scenarioId:
    | "saudacao_simples"
    | "saudacao_pergunta_direta"
    | "cliente_vago_peca"
    | "cliente_sem_ano_modelo"
    | "consulta_compatibilidade"
    | "preco_sem_contexto"
    | "preco_identificado"
    | "estoque_sem_contexto"
    | "estoque_identificado"
    | "produto_sem_estoque"
    | "pedido_desconto"
    | "reserva_peca"
    | "consulta_horario"
    | "pedido_humano"
    | "retomada_contexto"
    | "retomada_com_contexto_salvo"
    | "retomada_sem_contexto"
    | "referencia_contextual_curta"
    | "audio_curto_transcrito"
    | "audio_confuso_transcrito"
    | "pedido_multiplos_itens"
    | "pedido_multiplos_itens_preco"
    | "pedido_multiplos_itens_reserva"
    | "forma_pagamento"
    | "consulta_entrega"
    | "consulta_garantia"
    | "outra_marca"
    | "pedido_foto"
    | "vou_pensar"
    | "comparacao_concorrente"
    | "agradecimento"
    | "fechamento_compra"
    | "pos_venda_problema",
  replacements: Record<string, string | number | null | undefined> = {},
) {
  const scenario = getAssistantMatrixScenario(scenarioId);
  return renderAssistantMatrixText(scenario.replies.default, replacements);
}

function chooseContextCollectionScenario(message: string) {
  if (asksForPrice(message)) {
    return "preco_sem_contexto" as const;
  }

  if (asksForStock(message)) {
    return "estoque_sem_contexto" as const;
  }

  if (asksForCompatibility(message)) {
    return "consulta_compatibilidade" as const;
  }

  return "cliente_vago_peca" as const;
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

function inferSuggestedConversationDealStage(
  conversation: StoredConversation,
  suggestion: AssistantSuggestion,
): NonNullable<StoredConversation["dealStage"]> {
  if (suggestion.dealStage === "negociacao" || suggestion.shouldEscalateToHuman) {
    return "negociacao";
  }

  if (suggestion.dealStage === "reserva") {
    return "reserva_em_andamento";
  }

  if (suggestion.dealStage === "oferta") {
    return "oferta_enviada";
  }

  if (suggestion.dealStage === "descoberta") {
    return suggestion.intent === "duvida_geral" &&
      suggestion.matchedProducts.length === 0 &&
      suggestion.missingData.length === 0
      ? "novo_contato"
      : "qualificacao";
  }

  return conversation.dealStage ?? "novo_contato";
}

function inferSuggestedConversationStatus(
  conversation: StoredConversation,
  suggestion: AssistantSuggestion,
): ConversationStatus {
  if (conversation.status === "reservada") {
    return "reservada";
  }

  if (suggestion.shouldEscalateToHuman || suggestion.dealStage === "negociacao") {
    return "aguardando_humano";
  }

  if (suggestion.dealStage === "descoberta" || suggestion.dealStage === "reserva") {
    return "aguardando_dados";
  }

  return "respondida_pela_ia";
}

export function resolveAssistantConversationState(
  conversation: StoredConversation,
  suggestion: AssistantSuggestion,
) {
  return {
    dealStage: inferSuggestedConversationDealStage(conversation, suggestion),
    status: inferSuggestedConversationStatus(conversation, suggestion),
  };
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

  if (latestClientMessage?.inputType === "audio") {
    const stockStatus = "sem_correspondencia" as const;
    const audioScenario = isConfusingAudioTranscription(messageContent)
      ? "audio_confuso_transcrito"
      : isShortAudioTranscription(messageContent)
        ? "audio_curto_transcrito"
        : null;

    if (audioScenario) {
      return {
        conversationId: conversation.id,
        confidenceLabel: "Media",
        dealStage: "descoberta",
        intent: "duvida_geral",
        matchedProducts: matchedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stockQuantity: product.stockQuantity,
        })),
        missingData,
        nextStepLabel: "Confirmar o que veio no audio",
        operationalFocusLabel: "Coletar contexto",
        shouldEscalateToHuman: false,
        shouldOfferReservation: false,
        stockStatus,
        suggestedReply: buildMatrixReply(audioScenario),
        summary:
          "A ultima mensagem veio por audio e precisa de uma confirmacao leve para evitar resposta errada.",
        urgencyLabel: "Hoje",
      };
    }
  }

  if (looksLikeMultiItemRequest(messageContent)) {
    const stockStatus = matchedProducts.length
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    const multiScenario =
      intent === "reserva"
        ? "pedido_multiplos_itens_reserva"
        : asksForPrice(messageContent)
          ? "pedido_multiplos_itens_preco"
          : "pedido_multiplos_itens";

    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: intent === "reserva" ? "reserva" : "descoberta",
      intent,
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel:
        intent === "reserva"
          ? "Confirmar lista final para reserva"
          : "Organizar a lista dos itens",
      operationalFocusLabel:
        intent === "reserva" ? "Fechar a reserva" : "Coletar contexto",
      shouldEscalateToHuman: false,
      shouldOfferReservation: intent === "reserva",
      stockStatus,
      suggestedReply: buildMatrixReply(multiScenario),
      summary:
        "O cliente trouxe um pedido com varios itens. O melhor caminho local e organizar a lista antes de responder item a item.",
      urgencyLabel: intent === "reserva" ? "Agora" : "Hoje",
    };
  }

  if (asksForStoreHours(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "suporte",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Responder horario da loja",
      operationalFocusLabel: "Informar o funcionamento",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("consulta_horario", {
        HORARIO: "em horario comercial configurado pela loja",
      }),
      summary:
        "O cliente perguntou horario de atendimento. O ideal e responder diretamente sem abrir qualificacao comercial.",
      urgencyLabel: "Baixa",
    };
  }

  if (asksForPaymentMethods(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "suporte",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Responder formas de pagamento",
      operationalFocusLabel: "Informar pagamento",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("forma_pagamento", {
        FORMAS_PAGAMENTO: "pix, cartao e dinheiro",
      }),
      summary:
        "O cliente perguntou sobre formas de pagamento. Vale responder direto e manter a conversa leve.",
      urgencyLabel: "Baixa",
    };
  }

  if (asksForDelivery(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "reserva",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Coletar regiao da entrega",
      operationalFocusLabel: "Validar entrega",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("consulta_entrega"),
      summary:
        "O cliente quer entrega. O melhor passo e coletar bairro ou regiao antes de confirmar disponibilidade logistica.",
      urgencyLabel: "Hoje",
    };
  }

  if (asksForWarranty(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "suporte",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Responder garantia",
      operationalFocusLabel: "Informar garantia",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("consulta_garantia"),
      summary:
        "O cliente pediu garantia. A logica local deve responder com cautela e, se preciso, pedir a peca exata.",
      urgencyLabel: "Baixa",
    };
  }

  if (asksForPhoto(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "oferta",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Preparar envio de imagem",
      operationalFocusLabel: "Apoiar decisao com midia",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("pedido_foto"),
      summary:
        "O cliente quer foto da peca. O ideal e confirmar o item e preparar uma resposta de apoio visual.",
      urgencyLabel: "Hoje",
    };
  }

  if (signalsAfterSalesProblem(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "suporte",
      intent: "atendimento_humano",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Levar para responsavel de pos-venda",
      operationalFocusLabel: "Assumir o atendimento",
      shouldEscalateToHuman: true,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("pos_venda_problema"),
      summary:
        "Foi detectado um possivel problema de pos-venda. O mais seguro e direcionar para humano.",
      urgencyLabel: "Agora",
    };
  }

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
      suggestedReply: hasStrongStoredContext(conversation)
        ? renderAssistantMatrixText(
            getAssistantMatrixScenario("retomada_com_contexto_salvo").replies.default,
            {
              PECA: latestKnownProductReference(conversation, matchedProducts),
            },
          )
        : buildMatrixReply("saudacao_simples"),
      summary:
        "O cliente retomou a conversa com uma saudação curta e ainda não trouxe uma nova necessidade objetiva.",
      urgencyLabel: inferUrgencyLabel(conversation, "duvida_geral", stockStatus),
    };
  }

  if (signalsShortContextReference(messageContent) && hasStrongStoredContext(conversation)) {
    const stockStatus = matchedProducts.length
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "oferta",
      intent: "duvida_geral",
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Continuar a partir do contexto salvo",
      operationalFocusLabel: "Apresentar a melhor opcao",
      shouldEscalateToHuman: false,
      shouldOfferReservation: matchedProducts.some((product) => product.stockQuantity > 0),
      stockStatus,
      suggestedReply: renderAssistantMatrixText(
        getAssistantMatrixScenario("referencia_contextual_curta").replies.default,
        {
          PECA: latestKnownProductReference(conversation, matchedProducts),
        },
      ),
      summary:
        "O cliente respondeu com referencia curta e a conversa ja tem contexto salvo para continuar sem repetir tudo.",
      urgencyLabel: "Hoje",
    };
  }

  if (signalsThanks(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "suporte",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Encerrar cordialmente",
      operationalFocusLabel: "Encerrar bem a conversa",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("agradecimento"),
      summary:
        "O cliente agradeceu. Vale encerrar de forma cordial e leve.",
      urgencyLabel: "Baixa",
    };
  }

  if (signalsWillThink(messageContent)) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "oferta",
      intent: "duvida_geral",
      matchedProducts: [],
      missingData,
      nextStepLabel: "Manter abertura para follow-up",
      operationalFocusLabel: "Segurar objecao sem pressao",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("vou_pensar"),
      summary:
        "O cliente sinalizou adiamento da decisao. O ideal e manter a oportunidade viva sem pressionar.",
      urgencyLabel: "Baixa",
    };
  }

  if (comparesWithCompetitor(messageContent)) {
    const stockStatus = matchedProducts.length
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Media",
      dealStage: "negociacao",
      intent: "negociacao",
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Levar comparacao para avaliacao comercial",
      operationalFocusLabel: "Assumir o atendimento",
      shouldEscalateToHuman: true,
      shouldOfferReservation: matchedProducts.some((product) => product.stockQuantity > 0),
      stockStatus,
      suggestedReply: buildMatrixReply("comparacao_concorrente"),
      summary:
        "O cliente comparou com concorrente. E um caso classico de negociacao assistida com apoio humano.",
      urgencyLabel: "Hoje",
    };
  }

  if (asksForAlternativeBrand(messageContent)) {
    const stockStatus = matchedProducts.length
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "oferta",
      intent: "busca_produto",
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Oferecer alternativa de marca",
      operationalFocusLabel: "Apresentar a melhor opcao",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply("outra_marca"),
      summary:
        "O cliente quer outra marca. A melhor resposta local e abrir rapidamente uma trilha de alternativa.",
      urgencyLabel: "Hoje",
    };
  }

  if (signalsPurchaseClosed(messageContent) && conversation.status !== "reservada") {
    const stockStatus = matchedProducts.some((product) => product.stockQuantity > 0)
      ? ("em_estoque" as const)
      : ("sem_correspondencia" as const);
    return {
      conversationId: conversation.id,
      confidenceLabel: "Alta",
      dealStage: "reserva",
      intent: "reserva",
      matchedProducts: matchedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
      missingData,
      nextStepLabel: "Concluir fechamento",
      operationalFocusLabel: "Fechar a reserva",
      shouldEscalateToHuman: false,
      shouldOfferReservation: true,
      stockStatus,
      suggestedReply: buildMatrixReply("fechamento_compra"),
      summary:
        "O cliente demonstrou decisao de compra. A conversa deve avancar para fechamento e operacao.",
      urgencyLabel: "Agora",
    };
  }

  if (
    looksLikeDirectQuestion(messageContent) &&
    !matchedProducts.length &&
    intent !== "atendimento_humano" &&
    intent !== "negociacao" &&
    intent !== "reserva"
  ) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Media",
      dealStage: "descoberta",
      intent,
      matchedProducts: [],
      missingData,
      nextStepLabel: "Entender a pergunta inicial",
      operationalFocusLabel: "Coletar contexto",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: buildMatrixReply(
        inferGreetingOnly(messageContent)
          ? "saudacao_pergunta_direta"
          : chooseContextCollectionScenario(messageContent),
      ),
      summary:
        "O cliente abriu a conversa com uma pergunta direta, mas ainda nao ha contexto suficiente para responder com seguranca.",
      urgencyLabel: "Hoje",
    };
  }

  if (
    !matchedProducts.length &&
    !asksForStoreHours(messageContent) &&
    !asksForPaymentMethods(messageContent) &&
    !asksForDelivery(messageContent) &&
    !asksForWarranty(messageContent) &&
    !signalsThanks(messageContent) &&
    hasStrongStoredContext(conversation)
  ) {
    const stockStatus = "sem_correspondencia" as const;
    return {
      conversationId: conversation.id,
      confidenceLabel: "Media",
      dealStage: "descoberta",
      intent,
      matchedProducts: [],
      missingData,
      nextStepLabel: "Recuperar contexto salvo",
      operationalFocusLabel: "Coletar contexto",
      shouldEscalateToHuman: false,
      shouldOfferReservation: false,
      stockStatus,
      suggestedReply: renderAssistantMatrixText(
        getAssistantMatrixScenario("retomada_com_contexto_salvo").replies.default,
        {
          PECA: latestKnownProductReference(conversation, matchedProducts),
        },
      ),
      summary:
        "A conversa foi retomada sem um pedido completo novo, mas existe contexto salvo suficiente para continuar sem reiniciar do zero.",
      urgencyLabel: "Hoje",
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
      suggestedReply: buildMatrixReply(chooseContextCollectionScenario(messageContent)),
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
      suggestedReply: buildMatrixReply("pedido_humano"),
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
      suggestedReply: buildMatrixReply("pedido_desconto"),
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
      suggestedReply: buildMatrixReply("reserva_peca"),
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
      suggestedReply: buildMatrixReply(
        inferNeedsVehicleYear(messageContent || conversationContext)
          ? "cliente_sem_ano_modelo"
          : "consulta_compatibilidade",
      ),
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
      suggestedReply: hasStrongStoredContext(conversation)
        ? buildMatrixReply("retomada_sem_contexto")
        : buildMatrixReply("cliente_vago_peca"),
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
        ? asksForPrice(messageContent)
          ? renderAssistantMatrixText(
              getAssistantMatrixScenario("preco_identificado").replies.commercial,
              {
                VALOR: formatCurrency(topProduct.price),
              },
            )
          : asksForStock(messageContent)
            ? buildMatrixReply("estoque_identificado")
            : buildProductReply(topProduct, year)
        : asksForPrice(messageContent) || asksForStock(messageContent)
          ? renderAssistantMatrixText(
              getAssistantMatrixScenario("produto_sem_estoque").replies.commercial,
              {},
            )
          : buildOutOfStockReply(topProduct),
    summary:
      topProduct.stockQuantity > 0
        ? "A conversa já tem contexto suficiente para uma resposta comercial objetiva."
        : "Produto identificado, mas sem saldo no estoque local.",
    urgencyLabel: inferUrgencyLabel(conversation, intent, stockStatus),
  };
}
