import { createHmac } from "crypto";
import { buildTranscriptText } from "@/lib/export";
import type { TranscriptionResult } from "@/features/transcription/types";
import { getWebhookSettings } from "./webhooks-store";

const WEBHOOK_FETCH_TIMEOUT_MS = 10_000;

export interface WebhookProductionPayload {
  event: "transcription.completed";
  status: "completed";
  source: "staz-ai";
  metadata: {
    userEmail: string;
    plan: string;
    fileName: string;
    duration: number | string;
    processedAt: string;
  };
  summary: Record<string, unknown>;
  fullText: string;
  transcript: unknown[];
  actionItems: unknown[];
}

/** Normalized email — key in `data/webhooks.json`. */
export function resolveUserId(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Delivers a production `transcription.completed` webhook.
 * Pass the returned promise to `waitUntil()` — always resolves, never rejects.
 */
export async function triggerWebhook(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
): Promise<void> {
  try {
    const settings = await getWebhookSettings(userId);

    if (settings.isActive !== true) {
      return;
    }

    const url = settings.url?.trim();
    if (!url) {
      return;
    }

    const payload = buildProductionPayload(data);
    const body = JSON.stringify(payload);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "StazAI-Webhooks/1.0",
      "X-Staz-Event": "transcription.completed",
    };

    const signingKey = settings.signingKey?.trim();
    if (signingKey) {
      headers["X-Staz-Signature"] = `sha256=${createHmac("sha256", signingKey)
        .update(body)
        .digest("hex")}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(WEBHOOK_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(
        `[webhooks] delivery failed for ${userId} → ${url}: HTTP ${response.status}`,
      );
      return;
    }

    console.info(
      `[webhooks] delivered transcription.completed for ${userId} (HTTP ${response.status})`,
    );
  } catch (error) {
    console.error(
      `[webhooks] trigger failed for ${userId}:`,
      error instanceof Error ? error.message : error,
    );
  }
}

function buildProductionPayload(data: {
  userEmail: string;
  plan: string;
  result: TranscriptionResult | Record<string, unknown>;
}): WebhookProductionPayload {
  const result = data.result as TranscriptionResult & { fullText?: string };
  const fullText =
    result?.fullText ??
    (Array.isArray(result?.transcript) && result.transcript.length > 0
      ? buildTranscriptText(result)
      : "");

  return {
    event: "transcription.completed",
    status: "completed",
    source: "staz-ai",
    metadata: {
      userEmail: data.userEmail,
      plan: data.plan,
      fileName: result?.fileName ?? "unknown",
      duration: result?.duration ?? 0,
      processedAt: new Date().toISOString(),
    },
    summary: (result?.summary as Record<string, unknown>) ?? {},
    fullText,
    transcript: result?.transcript ?? [],
    actionItems: result?.actionItems ?? [],
  };
}
