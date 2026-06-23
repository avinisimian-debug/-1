import type { ActionItem } from "@/features/transcription/types";

export type IntegrationProviderId =
  | "webhook"
  | "slack"
  | "notion"
  | "zapier"
  | "jira";

export interface WebhookIntegrationConfig {
  url: string;
  enabled: boolean;
  secret?: string;
}

export interface SlackIntegrationConfig {
  webhookUrl: string;
  enabled: boolean;
}

export interface NotionIntegrationConfig {
  enabled: boolean;
  workspaceName?: string;
}

export interface ZapierIntegrationConfig {
  enabled: boolean;
  hookUrl?: string;
}

export interface UserIntegrationsConfig {
  email: string;
  updatedAt: string;
  webhook?: WebhookIntegrationConfig;
  slack?: SlackIntegrationConfig;
  notion?: NotionIntegrationConfig;
  zapier?: ZapierIntegrationConfig;
}

export interface ActionItemsPushPayload {
  source: "staz-ai";
  fileName: string;
  processedAt: string;
  headline?: string;
  overview?: string;
  actionItems: ActionItem[];
}

export interface IntegrationPushResult {
  provider: IntegrationProviderId;
  ok: boolean;
  statusCode?: number;
  error?: string;
}

export interface IntegrationPushResponse {
  results: IntegrationPushResult[];
  pushedAt: string;
}

export type IntegrationConfigPatch = Partial<
  Pick<UserIntegrationsConfig, "webhook" | "slack" | "notion" | "zapier">
>;
