export type AssistantMatrixScenarioId =
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
  | "pos_venda_problema";

type AssistantMatrixIntent =
  | "greeting"
  | "qualification"
  | "vague_product_inquiry"
  | "missing_vehicle_context"
  | "compatibility_check"
  | "price_inquiry"
  | "confirmed_price_inquiry"
  | "stock_inquiry"
  | "confirmed_stock_inquiry"
  | "out_of_stock"
  | "discount_request"
  | "reservation_request"
  | "store_hours"
  | "human_request"
  | "context_resume"
  | "context_resume_saved"
  | "context_resume_missing"
  | "short_context_reference"
  | "audio_short"
  | "audio_unclear"
  | "multi_item_request"
  | "multi_item_pricing"
  | "multi_item_reservation"
  | "payment_methods"
  | "delivery_inquiry"
  | "warranty_inquiry"
  | "alternative_brand"
  | "photo_request"
  | "objection_delay"
  | "competitor_comparison"
  | "gratitude"
  | "purchase_closure"
  | "after_sales_issue";

type AssistantMatrixDealStage =
  | "new_lead"
  | "qualification"
  | "product_identified"
  | "pricing"
  | "negotiation"
  | "reservation"
  | "support"
  | "human_handoff"
  | "reengagement"
  | "closing";

type AssistantMatrixStatus =
  | "awaiting_customer_need"
  | "collecting_vehicle_info"
  | "collecting_product_info"
  | "waiting_vehicle_context"
  | "compatibility_check"
  | "collecting_pricing_context"
  | "price_sent"
  | "collecting_stock_context"
  | "stock_confirmed"
  | "out_of_stock"
  | "negotiation_pending"
  | "reservation_pending"
  | "info_provided"
  | "waiting_human"
  | "context_recovery"
  | "context_resume_saved"
  | "context_resume_missing"
  | "context_reference_pending"
  | "audio_context_collection"
  | "audio_clarification"
  | "multi_item_collection"
  | "multi_item_pricing_pending"
  | "multi_item_reservation_pending"
  | "payment_info_provided"
  | "delivery_info_pending"
  | "warranty_info_provided"
  | "alternative_offered"
  | "media_pending"
  | "followup_pending"
  | "competitor_objection"
  | "graceful_close"
  | "closing_confirmed"
  | "after_sales_handoff";

type AssistantMatrixUrgency = "low" | "medium" | "high";
type AssistantMatrixFocus =
  | "abertura"
  | "coleta_contexto"
  | "identificar_produto"
  | "compatibilidade"
  | "preco"
  | "fechamento"
  | "estoque"
  | "disponibilidade"
  | "contorno_venda"
  | "negociacao"
  | "informacao"
  | "transferencia"
  | "recuperacao_contexto"
  | "audio"
  | "aplicacao_produto"
  | "pagamento"
  | "entrega"
  | "garantia"
  | "alternativa"
  | "midia"
  | "objecao"
  | "encerramento"
  | "pos_venda";
type AssistantMatrixConfidence = "high" | "medium" | "very_high";

export type AssistantMatrixScenario = {
  canAutoReply: boolean;
  confidenceLevel: AssistantMatrixConfidence;
  dealStage: AssistantMatrixDealStage;
  focus: AssistantMatrixFocus;
  id: AssistantMatrixScenarioId;
  intent: AssistantMatrixIntent;
  name: string;
  nextRequiredField:
    | "none"
    | "customer_need"
    | "vehicle_model"
    | "vehicle_year"
    | "product_name"
    | "payment_method"
    | "purchase_interest"
    | "alternative_interest"
    | "customer_name"
    | "last_context_confirmation"
    | "clarified_audio_intent"
    | "item_list_confirmation"
    | "payment_preference"
    | "delivery_region"
    | "warranty_policy"
    | "media_type"
    | "decision_timing";
  options: string[];
  replies: {
    commercial: string;
    default: string;
    direct: string;
    short: string;
    warm: string;
  };
  requiresHuman: boolean;
  requiresProductContext: boolean;
  requiresVehicleContext: boolean;
  suggestedStatus: AssistantMatrixStatus;
};

export const ASSISTANT_RESPONSE_MATRIX: Record<
  AssistantMatrixScenarioId,
  AssistantMatrixScenario
> = {
  saudacao_simples: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "new_lead",
    focus: "abertura",
    id: "saudacao_simples",
    intent: "greeting",
    name: "Saudacao simples",
    nextRequiredField: "customer_need",
    options: [
      "Oi 😊 Como posso te ajudar?",
      "Boa tarde! Me fala o que voce precisa 👍",
      "Ola! Tudo certo?",
      "Opa 👊 Como posso ajudar hoje?",
      "Seja bem-vindo 😊",
      "Fala! Qual peca voce procura?",
      "Boa noite 😊 Me chama ai.",
      "Ola 👍 Pode mandar sua duvida.",
    ],
    replies: {
      commercial: "Ola 😊 Me fala qual peca voce procura.",
      default: "Oi 😊 Como posso te ajudar?",
      direct: "Como posso ajudar?",
      short: "Oi 😊",
      warm: "Oi 😊 Seja bem-vindo! Pode me chamar.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "awaiting_customer_need",
  },
  saudacao_pergunta_direta: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "qualification",
    focus: "coleta_contexto",
    id: "saudacao_pergunta_direta",
    intent: "qualification",
    name: "Saudacao + pergunta direta",
    nextRequiredField: "vehicle_model",
    options: [
      "Claro 😊 Me fala a moto e o ano.",
      "Consigo verificar 👍 Qual modelo da moto?",
      "Opa 👊 Me passa os detalhes certinhos.",
      "Sim 😊 So preciso da moto e do ano.",
      "Me fala qual peca voce procura 👍",
      "Posso verificar 😊",
      "Qual modelo da moto?",
      "Me manda os detalhes da peca 👊",
    ],
    replies: {
      commercial: "Claro 😊 Me passa os detalhes que eu verifico pra voce.",
      default: "Consigo verificar 👍 Qual modelo da moto?",
      direct: "Preciso do modelo da moto.",
      short: "Qual modelo da moto?",
      warm: "Oi 😊 Pode me falar os detalhes da moto.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "collecting_vehicle_info",
  },
  cliente_vago_peca: {
    canAutoReply: true,
    confidenceLevel: "medium",
    dealStage: "qualification",
    focus: "identificar_produto",
    id: "cliente_vago_peca",
    intent: "vague_product_inquiry",
    name: "Cliente vago sobre peca",
    nextRequiredField: "product_name",
    options: [
      "Qual peca seria? 😊",
      "Me manda o nome da peca 👍",
      "Qual moto e? 👊",
      "Me fala a peca e a moto 😊",
      "Consegue me mandar mais detalhes?",
      "Qual modelo da moto? 👍",
      "Pode me dizer qual peca voce procura?",
      "Me manda foto ou nome da peca 😊",
    ],
    replies: {
      commercial: "Me passa os detalhes que eu verifico pra voce 👍",
      default: "Me fala a peca e a moto 😊",
      direct: "Preciso da peca e da moto.",
      short: "Qual peca?",
      warm: "Claro 😊 Me fala certinho a peca que voce precisa.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "collecting_product_info",
  },
  cliente_sem_ano_modelo: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "qualification",
    focus: "compatibilidade",
    id: "cliente_sem_ano_modelo",
    intent: "missing_vehicle_context",
    name: "Cliente sem ano/modelo",
    nextRequiredField: "vehicle_year",
    options: [
      "Qual o ano da moto? 😊",
      "Me fala modelo e ano 👍",
      "Pra confirmar certinho, preciso do ano 👊",
      "Qual moto voce tem?",
      "Me passa os detalhes da moto 😊",
      "Preciso do modelo e ano 👍",
      "Qual a cilindrada da moto?",
      "Me confirma o ano dela 👊",
    ],
    replies: {
      commercial: "Pra te passar certinho 😊 Me fala modelo e ano.",
      default: "Qual o ano da moto? 😊",
      direct: "Preciso do ano da moto.",
      short: "Qual o ano?",
      warm: "Me ajuda com o ano da moto 😊",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: true,
    suggestedStatus: "waiting_vehicle_context",
  },
  consulta_compatibilidade: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "product_identified",
    focus: "aplicacao_produto",
    id: "consulta_compatibilidade",
    intent: "compatibility_check",
    name: "Consulta de compatibilidade",
    nextRequiredField: "vehicle_model",
    options: [
      "Me fala a moto e o ano 😊",
      "Qual modelo da moto? 👍",
      "Consigo verificar 👊 Me passa os detalhes.",
      "Qual peca seria exatamente?",
      "Me confirma o ano da moto 😊",
      "Vou verificar certinho 👍",
      "Me passa modelo e cilindrada 👊",
      "Qual moto voce usa?",
    ],
    replies: {
      commercial: "Me passa os detalhes que eu confirmo pra voce 👍",
      default: "Me fala a moto e o ano 😊",
      direct: "Preciso do modelo e ano.",
      short: "Qual moto e ano?",
      warm: "Claro 😊 Vou verificar certinho pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "compatibility_check",
  },
  preco_sem_contexto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "qualification",
    focus: "preco",
    id: "preco_sem_contexto",
    intent: "price_inquiry",
    name: "Preco sem contexto",
    nextRequiredField: "product_name",
    options: [
      "Qual peca seria? 😊",
      "Me fala a moto e a peca 👍",
      "Qual modelo da moto? 👊",
      "Me manda os detalhes certinhos 😊",
      "Qual peca voce procura?",
      "Consigo verificar 👍",
      "Me passa modelo e ano 👊",
      "Qual produto seria exatamente?",
    ],
    replies: {
      commercial: "Me passa os detalhes que eu verifico o valor 😊",
      default: "Me fala a moto e a peca 👍",
      direct: "Preciso da peca e da moto.",
      short: "Qual peca e moto?",
      warm: "Claro 😊 So preciso dos detalhes da moto.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "collecting_pricing_context",
  },
  preco_identificado: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "fechamento",
    id: "preco_identificado",
    intent: "confirmed_price_inquiry",
    name: "Preco com produto identificado",
    nextRequiredField: "purchase_interest",
    options: [
      "Essa peca esta saindo por [VALOR] 👍",
      "O valor dela hoje e [VALOR] 😊",
      "Fica em [VALOR] 👊",
      "Hoje ela esta por [VALOR].",
      "Tenho ela por [VALOR] 👍",
      "Essa esta no valor de [VALOR].",
      "Sai por [VALOR] 😊",
      "O preco atual e [VALOR] 👍",
    ],
    replies: {
      commercial: "Essa esta saindo por [VALOR] 👍 Quer que eu separe pra voce?",
      default: "O valor dela hoje e [VALOR] 😊",
      direct: "Valor: [VALOR].",
      short: "[VALOR] 👍",
      warm: "Consigo ela pra voce por [VALOR] 😊",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "price_sent",
  },
  estoque_sem_contexto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "qualification",
    focus: "estoque",
    id: "estoque_sem_contexto",
    intent: "stock_inquiry",
    name: "Estoque sem contexto",
    nextRequiredField: "product_name",
    options: [
      "Qual peca voce procura? 😊",
      "Me fala a moto e a peca 👍",
      "Qual modelo da moto? 👊",
      "Consigo verificar 😊",
      "Me manda os detalhes certinhos 👍",
      "Qual seria a peca?",
      "Me passa o ano da moto 👊",
      "Qual produto seria exatamente?",
    ],
    replies: {
      commercial: "Me passa os detalhes que eu verifico pra voce 😊",
      default: "Me fala a moto e a peca 👍",
      direct: "Preciso da peca e da moto.",
      short: "Qual peca?",
      warm: "Claro 😊 Vou conferir certinho.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "collecting_stock_context",
  },
  estoque_identificado: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "disponibilidade",
    id: "estoque_identificado",
    intent: "confirmed_stock_inquiry",
    name: "Estoque identificado",
    nextRequiredField: "purchase_interest",
    options: [
      "Tenho disponivel 👍",
      "Temos ela em estoque 😊",
      "Consigo ela pronta entrega 👊",
      "Esta disponivel no momento 👍",
      "Temos sim 😊",
      "Essa peca esta disponivel.",
      "Tenho ela aqui 👍",
      "Esta disponivel pra retirada 😊",
    ],
    replies: {
      commercial: "Temos disponivel 😊 Quer que eu separe pra voce?",
      default: "Temos ela em estoque 😊",
      direct: "Disponivel.",
      short: "Temos 👍",
      warm: "Temos sim 😊",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "stock_confirmed",
  },
  produto_sem_estoque: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "contorno_venda",
    id: "produto_sem_estoque",
    intent: "out_of_stock",
    name: "Produto sem estoque",
    nextRequiredField: "alternative_interest",
    options: [
      "No momento estamos sem essa peca 😕",
      "Essa esta indisponivel agora 👍",
      "Estou sem ela no momento 👊",
      "Essa peca acabou por enquanto 😊",
      "No momento nao tenho disponivel.",
      "Essa esta em falta agora 👍",
      "Estou sem estoque dela 😊",
      "Posso verificar alternativa 👊",
    ],
    replies: {
      commercial:
        "Essa esta em falta agora 👍 Posso verificar outra marca pra voce.",
      default: "No momento estamos sem essa peca 😕",
      direct: "Sem estoque.",
      short: "Sem estoque no momento 😕",
      warm: "Infelizmente acabou no momento 😕",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "out_of_stock",
  },
  pedido_desconto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "negotiation",
    focus: "negociacao",
    id: "pedido_desconto",
    intent: "discount_request",
    name: "Pedido de desconto",
    nextRequiredField: "payment_method",
    options: [
      "Vou verificar o que consigo 😊",
      "Dependendo da forma de pagamento 👍",
      "Posso consultar aqui 👊",
      "Vou tentar uma condicao melhor 😊",
      "Me fala como seria o pagamento 👍",
      "Vou verificar certinho 👊",
      "Posso conferir as condicoes 😊",
      "Deixa eu verificar 👍",
    ],
    replies: {
      commercial:
        "Dependendo da forma de pagamento talvez eu consiga melhorar 😊",
      default: "Vou verificar o que consigo 😊",
      direct: "Vou consultar as condicoes.",
      short: "Vou verificar 👍",
      warm: "Vou fazer o possivel pra te ajudar 😊",
    },
    requiresHuman: true,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "negotiation_pending",
  },
  reserva_peca: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reservation",
    focus: "fechamento",
    id: "reserva_peca",
    intent: "reservation_request",
    name: "Reserva de peca",
    nextRequiredField: "customer_name",
    options: [
      "Posso separar pra voce 😊",
      "Me passa seu nome 👍",
      "Vai retirar hoje? 👊",
      "Consigo reservar 😊",
      "Qual horario pretende retirar?",
      "Vou separar pra voce 👍",
      "Me confirma seu nome 👊",
      "Posso deixar reservado 😊",
    ],
    replies: {
      commercial: "Consigo reservar 😊 Vai retirar hoje?",
      default: "Posso separar pra voce 😊 Me passa seu nome.",
      direct: "Nome e horario da retirada.",
      short: "Nome pra reserva 👍",
      warm: "Claro 😊 Vou separar pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "reservation_pending",
  },
  consulta_horario: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "support",
    focus: "informacao",
    id: "consulta_horario",
    intent: "store_hours",
    name: "Consulta de horario",
    nextRequiredField: "none",
    options: [
      "Funcionamos de [HORARIO] 😊",
      "Nosso horario e [HORARIO] 👍",
      "Abrimos as [HORARIO_INICIO] 👊",
      "Fechamos as [HORARIO_FIM].",
      "Estamos abertos de [HORARIO] 😊",
      "Nosso atendimento funciona de [HORARIO].",
      "Abrimos amanha as [HORARIO]. 👍",
      "Esse e nosso horario 😊 [HORARIO]",
    ],
    replies: {
      commercial: "Funcionamos de [HORARIO] 😊 Se quiser posso separar sua peca.",
      default: "Funcionamos de [HORARIO] 😊",
      direct: "Horario: [HORARIO].",
      short: "[HORARIO] 👍",
      warm: "Estamos por aqui de [HORARIO] 😊",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "info_provided",
  },
  pedido_humano: {
    canAutoReply: true,
    confidenceLevel: "very_high",
    dealStage: "human_handoff",
    focus: "transferencia",
    id: "pedido_humano",
    intent: "human_request",
    name: "Pedido de humano",
    nextRequiredField: "none",
    options: [
      "Vou te encaminhar 😊",
      "Ja vou chamar um vendedor 👍",
      "Um atendente vai continuar 👊",
      "Vou transferir seu atendimento 😊",
      "Ja te passo para o responsavel 👍",
      "Pode deixar 😊",
      "Vou chamar alguem da equipe 👊",
      "Transferindo seu atendimento 👍",
    ],
    replies: {
      commercial: "Ja vou te encaminhar para um vendedor 😊",
      default: "Ja vou chamar um vendedor 👍",
      direct: "Transferindo atendimento.",
      short: "Vou transferir 👍",
      warm: "Claro 😊 Ja vou chamar alguem da equipe.",
    },
    requiresHuman: true,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "waiting_human",
  },
  retomada_contexto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reengagement",
    focus: "recuperacao_contexto",
    id: "retomada_contexto",
    intent: "context_resume",
    name: "Retomada de conversa",
    nextRequiredField: "last_context_confirmation",
    options: [
      "Opa 😊 Vamos continuar.",
      "Claro 👍 Me relembra so a peca.",
      "Ainda precisa daquela peca? 👊",
      "Vamos continuar 😊",
      "Me confirma a moto rapidinho 👍",
      "Pode me lembrar os detalhes?",
      "Tudo certo 😊 Bora continuar.",
      "Continuando seu atendimento 👍",
    ],
    replies: {
      commercial: "Vamos continuar 😊 Ainda precisa daquela peca?",
      default: "Vamos continuar 😊 Me relembra so a peca.",
      direct: "Me relembra a peca.",
      short: "Qual peca mesmo? 👍",
      warm: "Opa 😊 Bora continuar seu atendimento.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "context_recovery",
  },
  retomada_com_contexto_salvo: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reengagement",
    focus: "recuperacao_contexto",
    id: "retomada_com_contexto_salvo",
    intent: "context_resume_saved",
    name: "Retomada com contexto salvo",
    nextRequiredField: "last_context_confirmation",
    options: [
      "Oi 😊 Sobre a [PECA], voce quer que eu confirme disponibilidade ou valor?",
      "Podemos continuar da [PECA] 👍 O que voce quer verificar agora?",
      "Perfeito 👊 Sobre a [PECA], quer que eu siga por disponibilidade ou preco?",
      "Vamos continuar 😊 Da ultima vez ficamos na [PECA].",
      "Opa 👍 Ainda esta vendo a [PECA]?",
      "Se quiser, continuo daqui sobre a [PECA] 😊",
      "Bora seguir 👊 Ainda precisa da [PECA]?",
      "Continuando por aqui 👍 Quer que eu confirme a [PECA]?",
    ],
    replies: {
      commercial:
        "Oi 😊 Sobre a [PECA], voce quer que eu confirme disponibilidade ou valor?",
      default:
        "Oi 😊 Sobre a [PECA], voce quer que eu confirme disponibilidade ou valor?",
      direct: "Sobre a [PECA], quer disponibilidade ou valor?",
      short: "Sobre a [PECA], sigo daqui? 👍",
      warm: "Opa 😊 Podemos continuar da [PECA] por aqui.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "context_resume_saved",
  },
  retomada_sem_contexto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reengagement",
    focus: "recuperacao_contexto",
    id: "retomada_sem_contexto",
    intent: "context_resume_missing",
    name: "Retomada sem contexto suficiente",
    nextRequiredField: "last_context_confirmation",
    options: [
      "Opa 😊 Vamos continuar. Me relembra so a peca.",
      "Claro 👍 Me lembra rapidinho qual peca voce precisa.",
      "Bora continuar 👊 Me confirma a peca e a moto.",
      "Vamos seguir 😊 Me relembra os detalhes rapidinho.",
      "Tudo certo 👍 Qual peca voce estava vendo mesmo?",
      "Posso continuar daqui 😊 So me relembra a peca.",
      "Me confirma a moto e a peca 👊",
      "Vamos continuar 👍 Me relembra o item certinho.",
    ],
    replies: {
      commercial:
        "Opa 😊 Vamos continuar. Me relembra so a peca que eu sigo com voce por aqui.",
      default: "Opa 😊 Vamos continuar. Me relembra so a peca.",
      direct: "Me relembra a peca.",
      short: "Qual peca mesmo? 👍",
      warm: "Opa 😊 Bora continuar. Me relembra rapidinho a peca.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "context_resume_missing",
  },
  referencia_contextual_curta: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reengagement",
    focus: "recuperacao_contexto",
    id: "referencia_contextual_curta",
    intent: "short_context_reference",
    name: "Referencia contextual curta",
    nextRequiredField: "last_context_confirmation",
    options: [
      "Perfeito 😊 Entao seguimos na [PECA].",
      "Beleza 👍 Sobre a [PECA], quer que eu confirme valor ou estoque?",
      "Essa mesma 👍 Vou seguir por aqui.",
      "Combinado 👊 Sobre a [PECA], quer disponibilidade ou preco?",
      "Perfeito 😊 Vou considerar a [PECA].",
      "Certo 👍 Seguimos com a [PECA].",
      "Fechado 👊 Entao e a [PECA].",
      "Tudo certo 😊 Vou seguir com a [PECA].",
    ],
    replies: {
      commercial:
        "Beleza 👍 Sobre a [PECA], quer que eu confirme valor ou estoque?",
      default: "Beleza 👍 Sobre a [PECA], quer que eu confirme valor ou estoque?",
      direct: "Sobre a [PECA], quer valor ou estoque?",
      short: "Seguimos na [PECA] 👍",
      warm: "Perfeito 😊 Vou seguir com a [PECA] por aqui.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "context_reference_pending",
  },
  audio_curto_transcrito: {
    canAutoReply: true,
    confidenceLevel: "medium",
    dealStage: "qualification",
    focus: "audio",
    id: "audio_curto_transcrito",
    intent: "audio_short",
    name: "Audio transcrito curto",
    nextRequiredField: "clarified_audio_intent",
    options: [
      "Recebi seu audio 😊 Me fala so a peca ou a moto pra eu te ajudar certinho.",
      "Ouvi por aqui 👍 Me confirma rapidinho a peca que voce precisa.",
      "Chegou seu audio 👊 Me passa a moto e a peca.",
      "Recebi seu audio 😊 Se quiser, me escreve o nome da peca rapidinho.",
      "Pode deixar 👍 Me confirma so os detalhes da moto.",
      "Peguei seu audio 👊 Me fala a peca certinha.",
      "Recebi aqui 😊 Me manda so a peca e o ano da moto.",
      "Ouvi seu audio 👍 Me confirma a peca para eu seguir.",
    ],
    replies: {
      commercial:
        "Recebi seu audio 😊 Me fala so a peca ou a moto pra eu te ajudar certinho.",
      default:
        "Recebi seu audio 😊 Me fala so a peca ou a moto pra eu te ajudar certinho.",
      direct: "Recebi o audio. Me confirma a peca e a moto.",
      short: "Recebi o audio 👍 Me confirma a peca.",
      warm: "Recebi seu audio 😊 Pode me mandar os detalhes rapidinho.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "audio_context_collection",
  },
  audio_confuso_transcrito: {
    canAutoReply: true,
    confidenceLevel: "medium",
    dealStage: "qualification",
    focus: "audio",
    id: "audio_confuso_transcrito",
    intent: "audio_unclear",
    name: "Audio transcrito confuso",
    nextRequiredField: "clarified_audio_intent",
    options: [
      "Quero te ajudar certo 😊 Seu audio ficou um pouco incompleto por aqui. Me confirma a peca e a moto?",
      "Recebi seu audio 👍 Para nao te passar errado, me escreve rapidinho a peca e o ano da moto.",
      "Peguei seu audio 👊 Mas quero validar certinho. Me confirma os detalhes da peca.",
      "Seu audio chegou 😊 So preciso confirmar a peca e a moto pra seguir.",
      "Para eu te responder certo 👍 Me manda a peca e o modelo da moto.",
      "Recebi aqui 👊 So preciso de uma confirmacao rapida por texto.",
      "Quero te ajudar certo 😊 Me escreve rapidinho a peca que voce precisa.",
      "Seu audio chegou 👍 Me confirma a moto e a peca por texto rapidinho.",
    ],
    replies: {
      commercial:
        "Quero te ajudar certo 😊 Seu audio ficou um pouco incompleto por aqui. Me confirma a peca e a moto?",
      default:
        "Quero te ajudar certo 😊 Seu audio ficou um pouco incompleto por aqui. Me confirma a peca e a moto?",
      direct: "Seu audio ficou incompleto. Me confirma a peca e a moto.",
      short: "Me confirma por texto a peca e a moto 👍",
      warm: "Recebi seu audio 😊 So preciso confirmar alguns detalhes pra te responder certo.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "audio_clarification",
  },
  pedido_multiplos_itens: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "qualification",
    focus: "coleta_contexto",
    id: "pedido_multiplos_itens",
    intent: "multi_item_request",
    name: "Pedido com multiplos itens",
    nextRequiredField: "item_list_confirmation",
    options: [
      "Consigo te ajudar com todos 😊 Me manda a lista item por item pra eu verificar certinho.",
      "Perfeito 👍 Me passa os itens separados que eu consulto um por um.",
      "Bora ver isso 👊 Me manda a lista das pecas separadas.",
      "Posso verificar tudo sim 😊 So me manda os itens certinhos.",
      "Me passa os itens um por linha ou separados por virgula 👍",
      "Consigo olhar tudo 👊 Me confirma a lista das pecas.",
      "Pode mandar os itens separados 😊",
      "Me manda a lista certinha que eu verifico 👍",
    ],
    replies: {
      commercial:
        "Consigo te ajudar com todos 😊 Me manda a lista item por item pra eu verificar certinho.",
      default:
        "Consigo te ajudar com todos 😊 Me manda a lista item por item pra eu verificar certinho.",
      direct: "Me passa os itens separados para eu verificar.",
      short: "Me manda a lista dos itens 👍",
      warm: "Claro 😊 Pode me mandar a lista que eu vejo tudo pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "multi_item_collection",
  },
  pedido_multiplos_itens_preco: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "preco",
    id: "pedido_multiplos_itens_preco",
    intent: "multi_item_pricing",
    name: "Pedido de preco com multiplos itens",
    nextRequiredField: "item_list_confirmation",
    options: [
      "Consigo cotar tudo 😊 Me manda os itens separados que eu verifico certinho.",
      "Perfeito 👍 Me passa a lista das pecas pra eu te retornar os valores.",
      "Posso cotar um por um 👊 Me manda os itens separados.",
      "Me passa a lista certinha que eu verifico os precos 😊",
      "Consigo ver isso 👍 Me manda os itens separados por virgula ou linha.",
      "Bora cotar 👊 Me confirma a lista das pecas.",
      "Me manda os itens que eu te passo os valores 😊",
      "Posso te retornar item por item 👍",
    ],
    replies: {
      commercial:
        "Consigo cotar tudo 😊 Me manda os itens separados que eu verifico certinho e te retorno os valores.",
      default:
        "Consigo cotar tudo 😊 Me manda os itens separados que eu verifico certinho.",
      direct: "Me passa a lista dos itens para eu cotar.",
      short: "Me manda a lista dos itens 👍",
      warm: "Claro 😊 Pode me mandar a lista que eu vejo os valores pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: true,
    suggestedStatus: "multi_item_pricing_pending",
  },
  pedido_multiplos_itens_reserva: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reservation",
    focus: "fechamento",
    id: "pedido_multiplos_itens_reserva",
    intent: "multi_item_reservation",
    name: "Reserva com multiplos itens",
    nextRequiredField: "customer_name",
    options: [
      "Consigo separar tudo 😊 Me confirma a lista dos itens e seu nome.",
      "Posso reservar 👍 Me manda os itens certinhos e o nome da retirada.",
      "Fechado 👊 Me passa seu nome e a lista final dos itens.",
      "Consigo separar pra voce 😊 So me confirma os itens e o nome.",
      "Posso deixar reservado 👍 Me fala a lista final e o horario da retirada.",
      "Vamos organizar isso 👊 Me confirma os itens certinhos.",
      "Me manda a lista final pra reserva 😊",
      "Consigo reservar tudo 👍 So preciso do nome e da lista final.",
    ],
    replies: {
      commercial:
        "Consigo separar tudo 😊 Me confirma a lista dos itens e seu nome que eu organizo a reserva.",
      default:
        "Consigo separar tudo 😊 Me confirma a lista dos itens e seu nome.",
      direct: "Me confirma os itens e o nome para a reserva.",
      short: "Lista final e nome 👍",
      warm: "Claro 😊 Me confirma os itens e seu nome que eu separo pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "multi_item_reservation_pending",
  },
  forma_pagamento: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "support",
    focus: "pagamento",
    id: "forma_pagamento",
    intent: "payment_methods",
    name: "Consulta de forma de pagamento",
    nextRequiredField: "payment_preference",
    options: [
      "Trabalhamos com [FORMAS_PAGAMENTO] 👍",
      "Aceitamos [FORMAS_PAGAMENTO] 😊",
      "Posso te passar as formas de pagamento 👊",
      "Hoje trabalhamos com [FORMAS_PAGAMENTO].",
      "Temos [FORMAS_PAGAMENTO] 👍",
      "Aceitamos pix, cartao e dinheiro 😊",
      "Se quiser te explico certinho as condicoes 👊",
      "As formas disponiveis sao [FORMAS_PAGAMENTO].",
    ],
    replies: {
      commercial:
        "Trabalhamos com [FORMAS_PAGAMENTO] 👍 Se quiser, ja separo a peca pra voce.",
      default: "Aceitamos [FORMAS_PAGAMENTO] 😊",
      direct: "Formas de pagamento: [FORMAS_PAGAMENTO].",
      short: "[FORMAS_PAGAMENTO] 👍",
      warm: "Aceitamos [FORMAS_PAGAMENTO] 😊",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "payment_info_provided",
  },
  consulta_entrega: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reservation",
    focus: "entrega",
    id: "consulta_entrega",
    intent: "delivery_inquiry",
    name: "Consulta de entrega",
    nextRequiredField: "delivery_region",
    options: [
      "Consigo verificar a entrega 😊 Me fala seu bairro.",
      "Qual bairro ou regiao seria? 👍",
      "Se for entrega, me passa seu bairro 👊",
      "Posso confirmar isso pra voce 😊",
      "Me fala onde seria a entrega 👍",
      "Qual cidade ou bairro? 👊",
      "Me passa a regiao pra eu validar 😊",
      "Consigo checar a entrega, me fala o local 👍",
    ],
    replies: {
      commercial:
        "Consigo verificar a entrega 😊 Me fala seu bairro que eu confirmo certinho pra voce.",
      default: "Consigo verificar a entrega 😊 Me fala seu bairro.",
      direct: "Preciso do bairro da entrega.",
      short: "Qual bairro? 👍",
      warm: "Claro 😊 Me fala seu bairro que eu verifico.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "delivery_info_pending",
  },
  consulta_garantia: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "support",
    focus: "garantia",
    id: "consulta_garantia",
    intent: "warranty_inquiry",
    name: "Consulta de garantia",
    nextRequiredField: "warranty_policy",
    options: [
      "Posso te passar a garantia dessa peca 😊",
      "A garantia depende do item e da marca 👍",
      "Me confirma a peca que eu te passo certinho 👊",
      "Consigo verificar a garantia pra voce 😊",
      "Qual item voce quer confirmar? 👍",
      "Te passo certinho como funciona 👊",
      "A garantia varia conforme a marca 😊",
      "Me fala a peca que eu verifico a garantia 👍",
    ],
    replies: {
      commercial:
        "Consigo verificar a garantia pra voce 😊 Me confirma a peca que eu te passo certinho.",
      default: "A garantia depende do item e da marca 👍",
      direct: "Me confirma a peca para eu validar a garantia.",
      short: "Me confirma a peca 👍",
      warm: "Claro 😊 Me fala a peca que eu verifico isso pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "warranty_info_provided",
  },
  outra_marca: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "alternativa",
    id: "outra_marca",
    intent: "alternative_brand",
    name: "Consulta de outra marca",
    nextRequiredField: "alternative_interest",
    options: [
      "Posso verificar outra marca pra voce 👍",
      "Tem preferencia por alguma marca? 😊",
      "Consigo olhar uma alternativa 👊",
      "Posso te passar outra opcao sim 😊",
      "Se quiser vejo outra marca pra essa moto 👍",
      "Tem outra linha que pode te atender 👊",
      "Posso buscar uma alternativa de custo ou marca 😊",
      "Me fala se prefere original ou paralela 👍",
    ],
    replies: {
      commercial:
        "Posso verificar outra marca pra voce 👍 Se quiser, vejo uma opcao mais em conta tambem.",
      default: "Posso verificar outra marca pra voce 👍",
      direct: "Posso te passar outra marca.",
      short: "Posso verificar 👍",
      warm: "Claro 😊 Vou olhar outra opcao pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "alternative_offered",
  },
  pedido_foto: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "pricing",
    focus: "midia",
    id: "pedido_foto",
    intent: "photo_request",
    name: "Pedido de foto",
    nextRequiredField: "media_type",
    options: [
      "Posso te mandar a foto sim 😊",
      "Ja separo a imagem pra voce 👍",
      "Me confirma so a peca certinha 👊",
      "Consigo te mandar a foto sim 😊",
      "Vou te passar a imagem 👍",
      "Me fala so qual item voce quer ver 👊",
      "Posso enviar a foto da peca 😊",
      "Ja te mostro a imagem 👍",
    ],
    replies: {
      commercial:
        "Posso te mandar a foto sim 😊 Me confirma so a peca certinha que eu te passo.",
      default: "Posso te mandar a foto sim 😊",
      direct: "Posso enviar a foto.",
      short: "Posso sim 👍",
      warm: "Claro 😊 Ja te passo a imagem.",
    },
    requiresHuman: false,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "media_pending",
  },
  vou_pensar: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "reengagement",
    focus: "objecao",
    id: "vou_pensar",
    intent: "objection_delay",
    name: "Cliente disse que vai pensar",
    nextRequiredField: "decision_timing",
    options: [
      "Sem problema 😊 Qualquer duvida estou por aqui.",
      "Claro 👍 Se quiser, posso deixar salvo pra voce.",
      "Tranquilo 👊 Se precisar, me chama.",
      "Sem pressa 😊",
      "Posso te chamar mais tarde se preferir 👍",
      "Fica a vontade 😊",
      "Se quiser eu posso separar e voce me confirma depois 👊",
      "Qualquer coisa, sigo por aqui 👍",
    ],
    replies: {
      commercial:
        "Sem problema 😊 Se quiser, eu posso te chamar mais tarde ou deixar isso separado pra voce.",
      default: "Sem problema 😊 Qualquer duvida estou por aqui.",
      direct: "Tudo certo. Se precisar, me chama.",
      short: "Tudo certo 👍",
      warm: "Sem problema 😊 Fico por aqui se precisar.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "followup_pending",
  },
  comparacao_concorrente: {
    canAutoReply: true,
    confidenceLevel: "medium",
    dealStage: "negotiation",
    focus: "objecao",
    id: "comparacao_concorrente",
    intent: "competitor_comparison",
    name: "Comparacao com concorrente",
    nextRequiredField: "payment_method",
    options: [
      "Entendi 👍 Vou verificar o que consigo por aqui.",
      "Me fala como ficou la pra eu entender melhor 😊",
      "Posso ver se temos uma condicao melhor 👊",
      "Deixa eu conferir certinho pra te ajudar 👍",
      "Dependendo da forma de pagamento, consigo verificar 😊",
      "Vou consultar aqui 👊",
      "Posso validar uma alternativa de marca tambem 👍",
      "Me passa como ficou no concorrente 😊",
    ],
    replies: {
      commercial:
        "Entendi 👍 Vou verificar o que consigo por aqui e ver se temos uma condicao melhor pra voce.",
      default: "Entendi 👍 Vou verificar o que consigo por aqui.",
      direct: "Vou consultar as condicoes.",
      short: "Vou verificar 👍",
      warm: "Entendi 😊 Vou fazer o possivel pra te ajudar nessa.",
    },
    requiresHuman: true,
    requiresProductContext: true,
    requiresVehicleContext: false,
    suggestedStatus: "competitor_objection",
  },
  agradecimento: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "support",
    focus: "encerramento",
    id: "agradecimento",
    intent: "gratitude",
    name: "Agradecimento",
    nextRequiredField: "none",
    options: [
      "Eu que agradeco 😊",
      "Tamo junto 👍",
      "Qualquer coisa, me chama 👊",
      "Por nada 😊",
      "Fico a disposicao 👍",
      "Se precisar de algo, so chamar 👊",
      "Conte comigo 😊",
      "Disponha 👍",
    ],
    replies: {
      commercial: "Eu que agradeco 😊 Qualquer coisa, sigo por aqui.",
      default: "Eu que agradeco 😊",
      direct: "Disponha.",
      short: "Por nada 😊",
      warm: "Eu que agradeco 😊 Se precisar, e so me chamar.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "graceful_close",
  },
  fechamento_compra: {
    canAutoReply: true,
    confidenceLevel: "high",
    dealStage: "closing",
    focus: "fechamento",
    id: "fechamento_compra",
    intent: "purchase_closure",
    name: "Fechamento de compra",
    nextRequiredField: "none",
    options: [
      "Perfeito 😊 Vou deixar isso encaminhado pra voce.",
      "Fechado 👍 Ja sigo com os proximos passos.",
      "Beleza 👊 Vou organizar certinho aqui.",
      "Combinado 😊",
      "Perfeito, ja deixo separado 👍",
      "Fechou 👊",
      "Tudo certo 😊",
      "Ja sigo com isso pra voce 👍",
    ],
    replies: {
      commercial:
        "Perfeito 😊 Vou deixar isso encaminhado pra voce e organizar os proximos passos.",
      default: "Perfeito 😊 Vou deixar isso encaminhado pra voce.",
      direct: "Fechado. Vou seguir com os proximos passos.",
      short: "Fechado 👍",
      warm: "Perfeito 😊 Ja organizo isso pra voce.",
    },
    requiresHuman: false,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "closing_confirmed",
  },
  pos_venda_problema: {
    canAutoReply: true,
    confidenceLevel: "very_high",
    dealStage: "human_handoff",
    focus: "pos_venda",
    id: "pos_venda_problema",
    intent: "after_sales_issue",
    name: "Problema de pos-venda",
    nextRequiredField: "none",
    options: [
      "Vou te encaminhar para resolver isso certinho 😊",
      "Ja vou chamar um responsavel 👍",
      "Pode deixar que vou direcionar isso 👊",
      "Ja te passo para o atendimento responsavel 😊",
      "Vamos resolver isso da melhor forma 👍",
      "Ja vou acionar quem cuida disso 👊",
      "Vou encaminhar seu caso agora 😊",
      "Ja estou direcionando isso 👍",
    ],
    replies: {
      commercial:
        "Vou te encaminhar para resolver isso certinho 😊 Ja vou chamar um responsavel.",
      default: "Ja vou chamar um responsavel 👍",
      direct: "Vou transferir para o responsavel.",
      short: "Ja vou encaminhar 👍",
      warm: "Pode deixar 😊 Ja vou te passar para quem cuida disso.",
    },
    requiresHuman: true,
    requiresProductContext: false,
    requiresVehicleContext: false,
    suggestedStatus: "after_sales_handoff",
  },
};

export function getAssistantMatrixScenario(id: AssistantMatrixScenarioId) {
  return ASSISTANT_RESPONSE_MATRIX[id];
}

export function renderAssistantMatrixText(
  template: string,
  replacements: Record<string, string | number | null | undefined>,
) {
  return template.replace(/\[([A-Z_]+)\]/g, (_, rawKey: string) => {
    const value = replacements[rawKey];
    return value == null || value === "" ? `[${rawKey}]` : String(value);
  });
}
