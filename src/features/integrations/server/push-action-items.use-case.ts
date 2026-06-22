import { createHmac } from "crypto";
import type {
  ActionItemsPushPayload,
  IntegrationProviderId,
  IntegrationPushResult,
  UserIntegrationsConfig,
} from "../types";

function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
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
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    headers["X-Staz-Signature"] = `sha256=${signature}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return {
        provider: "webhook",
        ok: false,
        statusCode: response.status,
        error: `Webhook returned ${response.status}`,
      };
    }

    return { provider: "webhook", ok: true, statusCode: response.status };
  } catch (error) {
    return {
      provider: "webhook",
      ok: false,
      error: error instanceof Error ? error.message : "Webhook request failed",
    };
  }
}

export async function pushActionItemsToIntegrations(
  config: UserIntegrationsConfig,
  payload: ActionItemsPushPayload,
  providers?: IntegrationProviderId[],
): Promise<IntegrationPushResult[]> {
  const targets = providers ?? ["webhook"];
  const results: IntegrationPushResult[] = [];

  for (const provider of targets) {
    if (provider === "webhook") {
      const hook = config.webhook;
      if (!hook?.enabled || !hook.url?.trim()) {
        results.push({
          provider: "webhook",
          ok: false,
          error: "Webhook not configured",
        });
        continue;
      }
      results.push(await postJson(hook.url.trim(), payload, hook.secret));
      continue;
    }

    if (provider === "slack") {
      const slack = config.slack;
      if (!slack?.enabled || !slack.webhookUrl?.trim()) {
        results.push({
          provider: "slack",
          ok: false,
          error: "Slack not configured",
        });
        continue;
      }
      const slackPayload = {
        text: `Action items from *${payload.fileName}*`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: payload.headline ?? payload.overview ?? payload.fileName,
            },
          },
          ...payload.actionItems.map((item) => ({
            type: "section",
            text: {
              type: "mrkdwn",
              text: `• *${item.task}*\n  Owner: ${item.owner} · Due: ${item.deadline}`,
            },
          })),
        ],
      };

      try {
        const res = await fetch(slack.webhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slackPayload),
          signal: AbortSignal.timeout(15_000),
        });
        results.push({
          provider: "slack",
          ok: res.ok,
          statusCode: res.status,
          error: res.ok ? undefined : `Slack returned ${res.status}`,
        });
      } catch (error) {
        results.push({
          provider: "slack",
          ok: false,
          error: error instanceof Error ? error.message : "Slack push failed",
        });
      }
      continue;
    }

    results.push({
      provider,
      ok: false,
      error: "Provider not available yet",
    });
  }

  return results;
}
