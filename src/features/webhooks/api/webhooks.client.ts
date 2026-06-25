import type { ApiResponse } from "@/shared/api/withApiHandler";
import type {
  WebhookSettingsPatch,
  WebhookTestResult,
} from "../types";

export interface WebhookSettingsResponse {
  url: string;
  signingKey: string;
  isActive: boolean;
  updatedAt: string;
}

async function parseApi<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json.data;
}

export async function fetchWebhooksConfig(): Promise<WebhookSettingsResponse> {
  const res = await fetch("/api/webhooks");
  const data = await parseApi<{ settings: WebhookSettingsResponse }>(res);
  return data.settings;
}

export async function saveWebhooksConfig(
  patch: WebhookSettingsPatch,
): Promise<WebhookSettingsResponse> {
  const res = await fetch("/api/webhooks", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await parseApi<{ settings: WebhookSettingsResponse }>(res);
  return data.settings;
}

export async function testWebhook(
  url?: string,
  signingKey?: string,
): Promise<WebhookTestResult> {
  const res = await fetch("/api/webhooks/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(url ? { url } : {}),
      ...(signingKey !== undefined ? { signingKey } : {}),
    }),
  });
  return parseApi<WebhookTestResult>(res);
}
