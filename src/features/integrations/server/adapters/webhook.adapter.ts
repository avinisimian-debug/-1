import { createHmac } from "crypto";
import type { ActionItemsPushPayload, IntegrationPushResult } from "../../types";
import type { IntegrationAdapter } from "./adapter.types";

function isValidHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

async function postJson(
  url: string,
  payload: ActionItemsPushPayload,
  secret?: string,
): Promise<IntegrationPushResult> {
  if (!isValidHttpsUrl(url)) {
    return {
      provider: "webhook",
      ok: false,
      error: "Webhook URL must use HTTPS",
    };
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "StazAI-Integrations/1.0",
  };

  if (secret) {
    headers["X-Staz-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(15_000),
    });
    return {
      provider: "webhook",
      ok: response.ok,
      statusCode: response.status,
      error: response.ok ? undefined : `Webhook returned ${response.status}`,
    };
  } catch (error) {
    return {
      provider: "webhook",
      ok: false,
      error: error instanceof Error ? error.message : "Webhook request failed",
    };
  }
}

export const webhookAdapter: IntegrationAdapter = {
  id: "webhook",
  isConfigured: (config) =>
    Boolean(config.webhook?.enabled && config.webhook.url?.trim()),
  push: async (config, payload) => {
    const hook = config.webhook!;
    return postJson(hook.url.trim(), payload, hook.secret);
  },
};

export const zapierAdapter: IntegrationAdapter = {
  id: "zapier",
  isConfigured: (config) =>
    Boolean(config.zapier?.enabled && config.zapier.hookUrl?.trim()),
  push: async (config, payload) => {
    const url = config.zapier!.hookUrl!.trim();
    const result = await postJson(url, payload);
    return { ...result, provider: "zapier" };
  },
};
