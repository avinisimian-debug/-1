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
          <section className="glass-card overflow-hidden rounded-xl">
            <div className="border-b border-border/60 bg-gradient-to-r from-violet-500/5 via-transparent to-amber-500/5 px-6 py-5 sm:px-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted">
                  <Webhook className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t.webhooksSectionTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
