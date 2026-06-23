import type {
  ActionItemsPushPayload,
  IntegrationProviderId,
  IntegrationPushResult,
  UserIntegrationsConfig,
} from "../../types";

export interface IntegrationAdapter {
  readonly id: IntegrationProviderId;
  /** Whether this adapter can run with the user's current config. */
  isConfigured(config: UserIntegrationsConfig): boolean;
  push(
    config: UserIntegrationsConfig,
    payload: ActionItemsPushPayload,
  ): Promise<IntegrationPushResult>;
}
