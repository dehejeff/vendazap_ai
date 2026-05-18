import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";
import { buildAssistantSuggestion } from "@/lib/ai-assistant";
import {
  appendConversationMessage,
  getConversationById,
  updateConversationHandoff,
} from "@/lib/conversations";
import { listProductsByUserId } from "@/lib/products";

function hasPendingClientMessage(
  conversation: NonNullable<Awaited<ReturnType<typeof getConversationById>>>,
) {
  const lastClientIndex = [...conversation.messages]
    .map((message, index) => ({ index, message }))
    .reverse()
    .find((entry) => entry.message.author === "cliente")?.index;

  if (lastClientIndex === undefined) {
    return false;
  }

  return conversation.messages
    .slice(lastClientIndex + 1)
    .every((message) => message.author === "sistema");
}

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
    const body = (await request.json()) as { humanActive?: boolean };
    const shouldActivateHuman = Boolean(body.humanActive);

    let conversation = await updateConversationHandoff(
      id,
      session.userId,
      shouldActivateHuman,
    );

    if (!shouldActivateHuman) {
      const refreshedConversation = await getConversationById(id, session.userId);

      if (refreshedConversation && hasPendingClientMessage(refreshedConversation)) {
        const products = await listProductsByUserId(session.userId);
        const suggestion = buildAssistantSuggestion(refreshedConversation, products);

        conversation = await appendConversationMessage(id, {
          author: "ia",
          content: suggestion.suggestedReply,
          userId: session.userId,
        });
      }
    }

    return NextResponse.json(
      { message: "Conversa atualizada com sucesso.", conversation },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a conversa.",
      },
      { status: 400 },
    );
  }
}
