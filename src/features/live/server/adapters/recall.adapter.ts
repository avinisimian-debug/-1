import type { LiveSession } from "../../types";
import type { BotDispatchResult, MeetingBotAdapter } from "./bot-adapter";

const RECALL_API = "https://us-west-2.recall.ai/api/v1";

/**
 * Recall.ai meeting bot adapter.
 * @see https://docs.recall.ai/
 */
export const recallBotAdapter: MeetingBotAdapter = {
  id: "recall",
  isAvailable() {
    return Boolean(process.env.RECALL_AI_API_KEY?.trim());
  },
  async dispatch(session: LiveSession): Promise<BotDispatchResult> {
    const apiKey = process.env.RECALL_AI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("RECALL_AI_API_KEY is not configured.");
    }

    const baseUrl =
      process.env.AUTH_URL?.replace(/\/$/, "") ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

    const webhookUrl = baseUrl
      ? `${baseUrl}/api/webhooks/recall?meetingId=${encodeURIComponent(session.id)}`
      : undefined;

    const res = await fetch(`${RECALL_API}/bot/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meeting_url: session.meetingUrl,
        bot_name: `Staz AI — ${session.title.slice(0, 40)}`,
        recording_config: {
          transcript: { provider: { meeting_captions: {} } },
        },
        ...(webhookUrl
          ? {
              status_change_webhook_url: webhookUrl,
            }
          : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Recall.ai dispatch failed (${res.status}): ${text.slice(0, 200)}`,
      );
    }

    const data = (await res.json()) as { id?: string };
    if (!data.id) {
      throw new Error("Recall.ai did not return a bot id.");
    }

    return {
      provider: "recall",
      externalBotId: data.id,
      status: "joining",
      message: "Bot dispatched via Recall.ai",
    };
  },
};
