import type { RequestRecord } from "@/lib/types";
import { getRequiredEnv, getSetupState } from "@/lib/env";

export async function sendTelegramNotification(request: RequestRecord) {
  if (!getSetupState().telegram) {
    return;
  }

  const { telegramBotToken, telegramChatId } = getRequiredEnv();

  const parts = [`New Plexadd request`, `${request.mediaType.toUpperCase()}: ${request.title}`];

  if (request.subtitle) {
    parts.push(request.subtitle);
  }

  if (request.releaseYear) {
    parts.push(String(request.releaseYear));
  }

  try {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: parts.join("\n"),
      }),
    });
  } catch (error) {
    console.error("Telegram notification failed", error);
  }
}
