import type { RequestRecord } from "@/lib/types";
import { getRequiredEnv, getSetupState } from "@/lib/env";

function formatRequestLabel(request: RequestRecord) {
  const parts = [request.title];

  if (request.mediaType === "book" && request.requestedLanguage) {
    parts.push(`[${request.requestedLanguage.toUpperCase()}]`);
  }

  if (request.mediaType === "book" && request.wantsAudiobook) {
    parts.push("Audiobook");
  }

  if (request.mediaType === "book" && request.wantsEbook) {
    parts.push("Ebook");
  }

  return parts.join(" ");
}

export async function sendTelegramNotification(request: RequestRecord) {
  if (!getSetupState().telegram) {
    return;
  }

  const { telegramBotToken, telegramChatId } = getRequiredEnv();
  const mediaLabel = request.mediaType ? request.mediaType.toUpperCase() : "REQUEST";

  const parts = [`New Plexadd request`, `${mediaLabel}: ${formatRequestLabel(request)}`];

  if (request.subtitle) {
    parts.push(request.subtitle);
  }

  if (request.releaseYear) {
    parts.push(String(request.releaseYear));
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: parts.join("\n"),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Telegram notification failed", response.status, body);
    }
  } catch (error) {
    console.error("Telegram notification failed", error);
  }
}
