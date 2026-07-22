import type { LiveSession } from "../../types";
import type { BotDispatchResult, MeetingBotAdapter } from "./bot-adapter";

function recallApiBase(): string {
  const explicit = process.env.RECALL_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const region = process.env.RECALL_AI_REGION?.trim() || "us-west-2";
  return `https://${region}.recall.ai/api/v1`;
}

export function getRecallApiBase(): string {
  return recallApiBase();
}

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

    const res = await fetch(`${recallApiBase()}/bot/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meeting_url: session.meetingUrl,
        bot_name: `Staz AI — ${session.title.slice(0, 40)}`,
        // Correlate webhooks back to our meeting (dashboard/Svix webhooks).
        metadata: {
          meetingId: session.id,
          ownerEmail: session.ownerEmail,
        },
        recording_config: {
          // Required for mixed MP4 download after bot.done
          video_mixed_mp4: {},
        },
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

type RecallBotResponse = {
  id?: string;
  metadata?: { meetingId?: string };
  recordings?: Array<{
    media_shortcuts?: {
      video_mixed?: { data?: { download_url?: string } };
      audio_mixed?: { data?: { download_url?: string } };
    };
  }>;
};

/** Retrieve bot + extract mixed video (or audio) download URL after bot.done. */
export async function fetchRecallRecordingDownloadUrl(
  botId: string,
): Promise<{ downloadUrl: string; meetingIdFromMeta?: string }> {
  const apiKey = process.env.RECALL_AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RECALL_AI_API_KEY is not configured.");
  }

  const res = await fetch(`${recallApiBase()}/bot/${encodeURIComponent(botId)}/`, {
    headers: {
      Authorization: `Token ${apiKey}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Recall retrieve bot failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }

  const bot = (await res.json()) as RecallBotResponse;
  const recording = bot.recordings?.[0];
  const downloadUrl =
    recording?.media_shortcuts?.video_mixed?.data?.download_url ||
    recording?.media_shortcuts?.audio_mixed?.data?.download_url;

  if (!downloadUrl) {
    throw new Error("Recall bot has no downloadable recording yet.");
  }

  return {
    downloadUrl,
    meetingIdFromMeta:
      typeof bot.metadata?.meetingId === "string"
        ? bot.metadata.meetingId
        : undefined,
  };
}
