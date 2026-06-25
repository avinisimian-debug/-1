import { createHmac } from "crypto";

export interface WebhookPostResult {
  ok: boolean;
  statusCode?: number;
  error?: string;
}

export function signWebhookBody(body: string, signingKey: string): string {
  return `sha256=${createHmac("sha256", signingKey).update(body).digest("hex")}`;
}

export async function postWebhookJson(
  url: string,
  payload: unknown,
  signingKey?: string,
): Promise<WebhookPostResult> {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "StazAI-Webhooks/1.0",
    "X-Staz-Event": "transcription.completed",
  };

  if (signingKey?.trim()) {
    headers["X-Staz-Signature"] = signWebhookBody(body, signingKey.trim());
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(15_000),
    });

    return {
      ok: response.ok,
      statusCode: response.status,
      error: response.ok ? undefined : `Webhook returned ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Webhook request failed",
    };
  }
}
