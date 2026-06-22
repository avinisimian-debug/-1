"use client";

import { useCallback, useEffect, useState } from "react";
import { Blocks, Loader2 } from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import {
  fetchIntegrationsConfig,
  saveIntegrationsConfig,
} from "../api/integrations.client";
import { INTEGRATION_PROVIDERS } from "../providers/registry";
import type { IntegrationProviderId, UserIntegrationsConfig } from "../types";
import { IntegrationProviderCard } from "./IntegrationProviderCard";
import { IntegrationsEmptyState } from "./IntegrationsEmptyState";
import { WebhookConfigForm } from "./WebhookConfigForm";

export function IntegrationBridge() {
  const { t } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const unlocked = hasFeature(plan, "integrationsPush");

  const [config, setConfig] = useState<UserIntegrationsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<IntegrationProviderId | null>("webhook");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    if (!unlocked) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchIntegrationsConfig();
      setConfig(data);
    } catch {
      setMessage({ type: "error", text: t.integLoadFailed });
    } finally {
      setLoading(false);
    }
  }, [unlocked, t.integLoadFailed]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveWebhook = async (
    webhook: NonNullable<UserIntegrationsConfig["webhook"]>,
  ) => {
    setSaving(true);
    setMessage(null);
    try {
      const next = await saveIntegrationsConfig({ webhook });
      setConfig(next);
      setMessage({ type: "success", text: t.integSaveSuccess });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.integSaveFailed,
      });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (!unlocked) {
    return (
      <IntegrationsEmptyState onUpgrade={() => promptUpgrade("integrationsPush")} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-muted">
          <Blocks className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {t.integTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.integSubtitle}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.integLoading}
        </div>
      ) : (
        <div className="space-y-3">
          {INTEGRATION_PROVIDERS.map((provider) => (
            <IntegrationProviderCard
              key={provider.id}
              provider={provider}
              config={config ?? { email: "", updatedAt: "" }}
              expanded={expanded === provider.id}
              locked={provider.proOnly && !unlocked}
              onToggle={() =>
                setExpanded((current) =>
                  current === provider.id ? null : provider.id,
                )
              }
              onUpgrade={() => promptUpgrade("integrationsPush")}
            >
              {provider.id === "webhook" && (
                <WebhookConfigForm
                  value={config?.webhook}
                  saving={saving}
                  onSave={handleSaveWebhook}
                />
              )}
              {provider.id !== "webhook" && provider.available === false && (
                <p className="text-xs text-muted-foreground">
                  {t.integComingSoonDetail}
                </p>
              )}
            </IntegrationProviderCard>
          ))}
        </div>
      )}

      {message && (
        <p
          className={
            message.type === "success"
              ? "text-xs text-emerald-600"
              : "text-xs text-red-600"
          }
        >
          {message.text}
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {t.integPayloadNote}
      </p>
    </div>
  );
}
