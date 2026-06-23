import type { IntegrationAdapter } from "./adapter.types";

/**
 * Notion adapter — OAuth + database ID required in production.
 * Scaffold returns a clear "not configured" until OAuth ships.
 */
export const notionAdapter: IntegrationAdapter = {
  id: "notion",
  isConfigured: (config) =>
    Boolean(config.notion?.enabled && config.notion.workspaceName),
  push: async () => ({
    provider: "notion",
    ok: false,
    error: "Notion OAuth integration coming soon — use Webhook/Zapier for now",
  }),
};
