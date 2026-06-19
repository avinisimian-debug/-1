"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle2, CreditCard, Crown, Shield } from "lucide-react";
import { PayPalCheckout } from "@/components/billing/PayPalCheckout";
import { PlanFeatureComparison } from "@/components/billing/PlanFeatureComparison";
import { PricingTable } from "@/components/billing/PricingTable";
import { ProPlanPrice } from "@/components/billing/ProPlanPrice";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import {
  getProPlanPriceLabel,
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE_LABEL,
  PRO_PLAN_REGULAR_PRICE_LABEL,
} from "@/lib/constants";
import { markStepComplete } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t } = useLocale();
  const { plan, isPro, syncPlan } = usePlan();
  const { data: session } = useSession();
  const [subMessage, setSubMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const email = session?.user?.email;
    if (email) markStepComplete(email, "profile");
  }, [session?.user?.email]);

  useEffect(() => {
    if (window.location.hash === "#upgrade") {
      document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth" });
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("subscription") === "cancel") {
      setSubMessage({ type: "error", text: t.paypalCancelled });
      window.history.replaceState({}, "", "/settings#upgrade");
      return;
    }

    const subscriptionId = params.get("subscription_id");
    if (params.get("subscription") === "success" && subscriptionId) {
      fetch("/api/paypal/activate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            await syncPlan();
            setSubMessage({ type: "success", text: t.paypalSuccess });
          } else {
            setSubMessage({
              type: "error",
              text: (data.error as string) ?? t.paypalError,
            });
          }
        })
        .catch(() => setSubMessage({ type: "error", text: t.paypalError }))
        .finally(() => {
          window.history.replaceState({}, "", "/settings#upgrade");
        });
    }
  }, [syncPlan, t.paypalCancelled, t.paypalError, t.paypalSuccess]);

  const scrollToCheckout = () => {
    document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DashboardShell title={t.settingsTitle} description={t.settingsDesc}>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="glass-card rounded-xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted">
              <Crown className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              {t.settingsPlan}
            </h2>
          </div>

          {!isPro && isLaunchWeekActive() && (
            <div className="mb-8">
              <SaleCountdown />
            </div>
          )}

          <PricingTable
            currentPlan={plan}
            onSelectPro={scrollToCheckout}
            landing={false}
          />

          <div className="mt-8">
            <PlanFeatureComparison />
          </div>

          {subMessage && (
            <div
              className={cn(
                "mt-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm",
                subMessage.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-red-200 bg-red-50 text-red-800",
              )}
            >
              {subMessage.type === "success" && (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              {subMessage.text}
            </div>
          )}

          {isPro ? (
            <div className="mt-6 space-y-2 text-center">
              <p className="text-xs font-medium text-emerald-700">
                {t.settingsProActive}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t.settingsManagePayPal}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4" id="upgrade" data-paypal-section>
              {isLaunchWeekActive() && (
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4">
                  <p className="text-sm font-semibold text-emerald-900">
                    {t.trialTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-800/90">
                    {t.trialDesc
                      .replace("{intro}", PRO_PLAN_INTRO_PRICE_LABEL)
                      .replace("{regular}", PRO_PLAN_REGULAR_PRICE_LABEL)}
                  </p>
                </div>
              )}

              <div className="premium-card rounded-xl p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {isLaunchWeekActive()
                      ? t.paypalSubscribeTitle
                      : t.paypalTitle}
                  </h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {(isLaunchWeekActive()
                    ? t.paypalSubscribeDesc
                    : t.paypalDesc
                  )
                    .replace("{intro}", PRO_PLAN_INTRO_PRICE_LABEL)
                    .replace("{regular}", PRO_PLAN_REGULAR_PRICE_LABEL)}
                </p>
                <div className="mb-4">
                  <ProPlanPrice size="sm" showBadge />
                </div>
                <PayPalCheckout onSuccess={syncPlan} />
              </div>
            </div>
          )}
        </section>

        <div className="mx-auto max-w-2xl space-y-6">
          <section className="glass-card rounded-xl p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              {t.settingsProfile}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t.settingsNameLabel}
                </label>
                <input
                  readOnly
                  defaultValue={session?.user?.name ?? ""}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t.settingsEmailLabel}
                </label>
                <input
                  readOnly
                  defaultValue={session?.user?.email ?? ""}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                {t.settingsNotifications}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.settingsNotificationsBody.replace(
                "{email}",
                session?.user?.email ?? "",
              )}
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                {t.settingsBilling}
              </h2>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent-muted/50 px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                {isPro
                  ? t.settingsProPlanLine.replace(
                      "{price}",
                      getProPlanPriceLabel(),
                    )
                  : t.settingsBasicPlan}
              </p>
            </div>
          </section>

          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                {t.settingsSecurity}
              </h2>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
