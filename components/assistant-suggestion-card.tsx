import { ReserveProductForm } from "@/components/reserve-product-form";
import type { AssistantSuggestion } from "@/lib/ai-assistant";
import {
  conversationDealStageLabelMap,
  conversationStatusLabelMap,
} from "@/lib/dashboard-constants";

type AssistantSuggestionCardProps = {
  conversationId: string;
  suggestion: AssistantSuggestion;
};

const stockStatusMap: Record<AssistantSuggestion["stockStatus"], string> = {
  baixo_estoque: "Baixo estoque",
  em_estoque: "Em estoque",
  sem_correspondencia: "Sem correspondência",
  sem_estoque: "Sem estoque",
};

const intentMap: Record<AssistantSuggestion["intent"], string> = {
  atendimento_humano: "Atendimento humano",
  busca_produto: "Busca de produto",
  duvida_geral: "Dúvida geral",
  negociacao: "Negociação",
  reserva: "Reserva",
};

const dealStageMap: Record<AssistantSuggestion["dealStage"], string> = {
  descoberta: "Descoberta",
  negociacao: "Negociação",
  oferta: "Oferta",
  reserva: "Reserva",
  suporte: "Suporte",
};

export function AssistantSuggestionCard({
  conversationId,
  suggestion,
}: AssistantSuggestionCardProps) {
  const topProduct = suggestion.matchedProducts[0];
  const operationalLabel = suggestion.shouldEscalateToHuman
    ? "Levar para atendimento humano"
    : suggestion.shouldOfferReservation
      ? "Oferecer reserva da peça"
      : "Seguir no fluxo assistido";

  return (
    <div className="dashboard-card dashboard-soft-enter-delay mt-5 overflow-hidden rounded-[1.6rem] p-4 sm:p-5">
      <div className="mb-4 rounded-[1.35rem] border border-[#d9eadc] bg-[linear-gradient(135deg,rgba(242,255,246,0.95)_0%,rgba(231,251,239,0.92)_100%)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#dff4e3] px-3 py-1 text-xs font-semibold text-[#2d8a4b]">
            Sugestão da IA
          </span>
          <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold text-[#617664]">
            {dealStageMap[suggestion.dealStage]}
          </span>
          <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold text-[#617664]">
            {intentMap[suggestion.intent]}
          </span>
          <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold text-[#617664]">
            Confiança {suggestion.confidenceLabel}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#355342]">{suggestion.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f6faf6] px-3 py-1 text-xs font-semibold text-[#6b7f6f]">
          {stockStatusMap[suggestion.stockStatus]}
        </span>
        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#99751b]">
          Próxima ação: {suggestion.nextStepLabel}
        </span>
        <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-semibold text-[#1e355d]">
          Urgência: {suggestion.urgencyLabel}
        </span>
        {suggestion.suggestedConversationStatus ? (
          <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2d5b91]">
            Status sugerido:{" "}
            {conversationStatusLabelMap[suggestion.suggestedConversationStatus]}
          </span>
        ) : null}
        {suggestion.suggestedConversationDealStage ? (
          <span className="rounded-full bg-[#edf8f2] px-3 py-1 text-xs font-semibold text-[#2d8a4b]">
            Funil sugerido:{" "}
            {conversationDealStageLabelMap[suggestion.suggestedConversationDealStage]}
          </span>
        ) : null}
      </div>

      <div className="dashboard-tint-emerald mt-4 rounded-[1.3rem] border border-[#deeadf] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d8a4b]">
          Resposta sugerida
        </p>
        <p className="mt-3 text-sm leading-7 text-[#173424]">
          {suggestion.suggestedReply}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="dashboard-card rounded-[1.2rem] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f6d]">
            Próximo passo
          </p>
          <p className="mt-2 text-sm font-medium text-[#173424]">
            {suggestion.nextStepLabel}
          </p>
        </div>

        <div className="dashboard-card rounded-[1.2rem] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f6d]">
            Ação operacional
          </p>
          <p className="mt-2 text-sm font-medium text-[#173424]">{operationalLabel}</p>
        </div>

        <div className="dashboard-card rounded-[1.2rem] p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f6d]">
            Foco da conversa
          </p>
          <p className="mt-2 text-sm font-medium text-[#173424]">
            {suggestion.operationalFocusLabel}
          </p>
        </div>
      </div>

      {suggestion.missingData.length > 0 ? (
        <div className="mt-4 rounded-[1.2rem] border border-[#efe4c5] bg-[#fffaf0] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7a17]">
            Dados faltantes
          </p>
          <p className="mt-2 text-sm text-[#6f5b26]">
            {suggestion.missingData.join(", ")}
          </p>
        </div>
      ) : null}

      {suggestion.matchedProducts.length > 0 ? (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a7f6d]">
            Produtos encontrados
          </p>
          {suggestion.matchedProducts.map((product) => (
            <div
              key={product.id}
              className="dashboard-card rounded-[1.2rem] p-4"
            >
              <p className="text-sm font-semibold text-[#173424]">{product.name}</p>
              <p className="mt-2 text-sm text-[#5f7766]">
                R$ {product.price.toFixed(2).replace(".", ",")} • Estoque:{" "}
                {product.stockQuantity}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {suggestion.shouldOfferReservation && topProduct ? (
        <ReserveProductForm
          conversationId={conversationId}
          productId={topProduct.id}
          productName={topProduct.name}
        />
      ) : null}
    </div>
  );
}
