import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";
import {
  buildAssistantSuggestion,
  resolveAssistantConversationState,
} from "@/lib/ai-assistant";
import {
  appendConversationMessage,
  getConversationById,
  syncConversationAssistantState,
} from "@/lib/conversations";
import { listProductsByUserId } from "@/lib/products";
import type { MessageAuthor } from "@/lib/conversations";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    return NextResponse.json({ message: "Sessão inválida." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      author?: MessageAuthor;
      autoReply?: boolean;
      content?: string;
      inputType?: "texto" | "audio";
    };
    const author = body.author ?? "cliente";

    const conversation = await appendConversationMessage(id, {
      author,
      content: body.content ?? "",
      inputType: body.inputType ?? "texto",
      userId: session.userId,
    });
    const humanHandoffActive =
      conversation.status === "em_atendimento_humano" ||
      conversation.status === "aguardando_humano" ||
      conversation.dealStage === "negociacao";

    let suggestion = null;
    let autoReplyApplied = false;

    if (body.autoReply && author === "cliente" && !humanHandoffActive) {
      const products = await listProductsByUserId(session.userId);
      suggestion = buildAssistantSuggestion(conversation, products);

      await appendConversationMessage(id, {
        author: "ia",
        content: suggestion.suggestedReply,
        userId: session.userId,
      });

      const suggestedState = resolveAssistantConversationState(
        conversation,
        suggestion,
      );

      await syncConversationAssistantState({
        conversationId: id,
        dealStage: suggestedState.dealStage,
        status: suggestedState.status,
        userId: session.userId,
      });

      autoReplyApplied = true;
    }

    const updatedConversation = await getConversationById(id, session.userId);

    return NextResponse.json(
      {
        autoReplyApplied,
        conversation: updatedConversation,
        message: autoReplyApplied
          ? "Mensagem simulada e resposta da IA aplicada."
          : humanHandoffActive && author === "cliente"
            ? "Mensagem simulada com IA pausada para atendimento humano."
          : author === "humano"
            ? "Resposta manual enviada com sucesso."
            : "Mensagem simulada com sucesso.",
        suggestion,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível registrar a mensagem.",
      },
      { status: 400 },
    );
  }
}
