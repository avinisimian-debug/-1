import type {
  ActionItemsPushPayload,
  IntegrationProviderId,
  IntegrationPushResult,
  UserIntegrationsConfig,
} from "../types";
import type { IntegrationAdapter } from "./adapters/adapter.types";
import { jiraAdapter } from "./adapters/jira.adapter";
import { notionAdapter } from "./adapters/notion.adapter";
import { slackAdapter } from "./adapters/slack.adapter";
import { webhookAdapter, zapierAdapter } from "./adapters/webhook.adapter";

const ADAPTERS: IntegrationAdapter[] = [
  webhookAdapter,
  slackAdapter,
  notionAdapter,
  zapierAdapter,
  jiraAdapter,
];

const adapterMap = new Map(
  ADAPTERS.map((adapter) => [adapter.id, adapter]),
);

/**
 * Generic integration bridge — dispatches action items to external tools
 * via pluggable adapters (Webhook, Slack, Notion, Jira, Zapier).
 */
export class IntegrationBridgeService {
  constructor(private readonly adapters: IntegrationAdapter[] = ADAPTERS) {}

  getAdapter(id: IntegrationProviderId): IntegrationAdapter | undefined {
    return adapterMap.get(id) ?? this.adapters.find((a) => a.id === id);
  }

  listConfigured(
    config: UserIntegrationsConfig,
    providerIds?: IntegrationProviderId[],
  ): IntegrationProviderId[] {
    const targets = providerIds ?? this.adapters.map((a) => a.id);
    return targets.filter((id) => {
      const adapter = this.getAdapter(id);
      return adapter?.isConfigured(config);
    });
  }

  async pushActionItems(
    config: UserIntegrationsConfig,
    payload: ActionItemsPushPayload,
    providerIds?: IntegrationProviderId[],
  ): Promise<IntegrationPushResult[]> {
    const targets = providerIds ?? ["webhook"];
    const results: IntegrationPushResult[] = [];

    for (const id of targets) {
      const adapter = this.getAdapter(id);
      if (!adapter) {
        results.push({ provider: id, ok: false, error: "Unknown provider" });
        continue;
      }
      if (!adapter.isConfigured(config)) {
        results.push({
          provider: id,
          ok: false,
          error: `${id} not configured`,
        });
        continue;
      }
      results.push(await adapter.push(config, payload));
    }

    return results;
  }
}

export const integrationBridge = new IntegrationBridgeService();

export async function pushActionItemsToIntegrations(
  config: UserIntegrationsConfig,
  payload: ActionItemsPushPayload,
  providers?: IntegrationProviderId[],
): Promise<IntegrationPushResult[]> {
  return integrationBridge.pushActionItems(config, payload, providers);
}
