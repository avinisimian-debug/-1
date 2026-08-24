"use client";

import Link from "next/link";
import { ArrowLeft, Webhook } from "lucide-react";
import {
  WebhooksLockedState,
  WebhooksSettingsPanel,
} from "@/features/webhooks";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import { cn } from "@/lib/utils";

export default function WebhooksSettingsPage() {
  const { t, rtl } = useLocale();
  const { plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const unlocked = hasFeature(plan, "transcriptionWebhooks");

  return (
    <DashboardShell title={t.webhooksPageTitle} description={t.webhooksPageDesc}>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Link
          href="/settings"
          className={cn(
            "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
          )}
        >
          <ArrowLeft className={cn("h-4 w-4", rtl && "rotate-180")} />
          {t.webhooksBackToSettings}
        </Link>

        {unlocked ? (
          <section className="lat-panel overflow-hidden">
            <div className="border-b border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                  <Webhook className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--ink-primary)]">
                    {t.webhooksSectionTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                    {t.webhooksSectionDesc}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <WebhooksSettingsPanel />
            </div>
          </section>
        ) : (
          <WebhooksLockedState
            onUpgrade={() => promptUpgrade("transcriptionWebhooks")}
          />
        )}
      </div>
    </DashboardShell>
  );
}
