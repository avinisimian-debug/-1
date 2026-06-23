import type { ActionItemsPushPayload } from "../../types";
import type { IntegrationAdapter } from "./adapter.types";

export interface JiraIntegrationSecrets {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

/**
 * Jira Cloud adapter — creates issues via REST API v3.
 * Config stored in UserIntegrationsConfig extension when UI ships.
 */
export const jiraAdapter: IntegrationAdapter = {
  id: "jira",
  isConfigured: (_config) => false,
  push: async (_config, payload: ActionItemsPushPayload) => {
    void payload;
    return {
      provider: "jira",
      ok: false,
      error: "Jira adapter scaffold — configure baseUrl, apiToken, and projectKey",
    };
  },
};
