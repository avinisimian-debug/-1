import type { IntegrationAdapter } from "./adapter.types";

export const slackAdapter: IntegrationAdapter = {
  id: "slack",
  isConfigured: (config) =>
    Boolean(config.slack?.enabled && config.slack.webhookUrl?.trim()),
  push: async (config, payload) => {
    const slack = config.slack!;
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
      return {
        provider: "slack",
        ok: res.ok,
        statusCode: res.status,
        error: res.ok ? undefined : `Slack returned ${res.status}`,
      };
    } catch (error) {
      return {
        provider: "slack",
        ok: false,
        error: error instanceof Error ? error.message : "Slack push failed",
      };
    }
  },
};
