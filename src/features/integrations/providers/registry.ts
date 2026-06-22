import type { LucideIcon } from "lucide-react";
import { FileText, MessageSquare, Webhook, Zap } from "lucide-react";
import type { IntegrationProviderId } from "../types";

export interface IntegrationProviderMeta {
  id: IntegrationProviderId;
  icon: LucideIcon;
  nameKey: "integWebhookName" | "integSlackName" | "integNotionName" | "integZapierName";
  descKey:
    | "integWebhookDesc"
    | "integSlackDesc"
    | "integNotionDesc"
    | "integZapierDesc";
  /** Shipped and configurable in UI */
  available: boolean;
  /** Pro-only connector */
  proOnly: boolean;
}

export const INTEGRATION_PROVIDERS: IntegrationProviderMeta[] = [
  {
    id: "webhook",
    icon: Webhook,
    nameKey: "integWebhookName",
    descKey: "integWebhookDesc",
    available: true,
    proOnly: true,
  },
  {
    id: "slack",
    icon: MessageSquare,
    nameKey: "integSlackName",
    descKey: "integSlackDesc",
    available: false,
    proOnly: true,
  },
  {
    id: "notion",
    icon: FileText,
    nameKey: "integNotionName",
    descKey: "integNotionDesc",
    available: false,
    proOnly: true,
  },
  {
    id: "zapier",
    icon: Zap,
    nameKey: "integZapierName",
    descKey: "integZapierDesc",
    available: false,
    proOnly: true,
  },
];

export function getProviderMeta(
  id: IntegrationProviderId,
): IntegrationProviderMeta | undefined {
  return INTEGRATION_PROVIDERS.find((p) => p.id === id);
}

export const INTEGRATION_PROVIDER_IDS = INTEGRATION_PROVIDERS.map(
  (p) => p.id,
) as IntegrationProviderId[];
