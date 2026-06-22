import type { ApiResponse } from "@/shared/api/withApiHandler";
import type {
  ActionItemsPushPayload,
  IntegrationConfigPatch,
  IntegrationProviderId,
  IntegrationPushResponse,
  UserIntegrationsConfig,
} from "../types";

async function parseApi<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json.data;
}

export async function fetchIntegrationsConfig(): Promise<UserIntegrationsConfig> {
  const res = await fetch("/api/integrations");
  const data = await parseApi<{ config: UserIntegrationsConfig }>(res);
  return data.config;
}

export async function saveIntegrationsConfig(
  patch: IntegrationConfigPatch,
): Promise<UserIntegrationsConfig> {
  const res = await fetch("/api/integrations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await parseApi<{ config: UserIntegrationsConfig }>(res);
  return data.config;
}

export async function pushActionItems(
  payload: ActionItemsPushPayload,
  providers?: IntegrationProviderId[],
): Promise<IntegrationPushResponse> {
  const res = await fetch("/api/integrations/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload, providers }),
  });
  return parseApi<IntegrationPushResponse>(res);
}
