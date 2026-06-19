"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, CreditCard, Crown, Shield } from "lucide-react";
import { PayPalCheckout } from "@/components/billing/PayPalCheckout";
import { PlanFeatureComparison } from "@/components/billing/PlanFeatureComparison";
import { PricingTable } from "@/components/billing/PricingTable";
import { ProPlanPrice } from "@/components/billing/ProPlanPrice";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { StartProTrialButton } from "@/components/billing/StartProTrialButton";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { getProPlanPriceLabel, isLaunchWeekActive, PRO_PLAN_INTRO_PRICE_LABEL, PRO_PLAN_REGULAR_PRICE_LABEL } from "@/lib/constants";
import { markStepComplete } from "@/lib/onboarding-store";

export default function SettingsPage() {
  const { t } = useLocale();
  const { plan, isPro, downgradeToFree, syncPlan } = usePlan();
  const { data: session } = useSession();

  useEffect(() => {
    const email = session?.user?.email;
    if (email) markStepComplete(email, "profile");
  }, [session?.user?.email]);

  useEffect(() => {
    if (window.location.hash === "#upgrade") {
      document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth" });
    }

    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get("subscription_id");
    if (params.get("subscription") === "success" && subscriptionId) {
      fetch("/api/paypal/activate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      })
        .then(async (res) => {
          if (res.ok) await syncPlan();
        })
        .finally(() => {
          window.history.replaceState({}, "", "/settings#upgrade");
        });
    }
  }, [syncPlan]);

  const scrollToCheckout = () => {
    document.querySelector("[data-paypal-section]")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DashboardShell title={t.settingsTitle} description={t.settingsDesc}>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="glass-card rounded-lg p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50">
              <Crown className="h-4 w-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900">{t.settingsPlan}</h2>
          </div>

          {!isPro && isLaunchWeekActive() && (
            <div className="mb-8">
              <SaleCountdown />
            </div>
          )}

          <PricingTable
            currentPlan={plan}
            onSelectPro={scrollToCheckout}
            onSelectBasic={isPro ? downgradeToFree : undefined}
          />

          <div className="mt-8">
            <PlanFeatureComparison />
          </div>

          {isPro ? (
            <p className="mt-6 text-center text-xs text-emerald-600">
              {t.settingsProActive}
            </p>
          ) : (
            <div className="mt-8 space-y-6" id="upgrade" data-paypal-section>
              {isLaunchWeekActive() && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-emerald-900">
                    {t.trialTitle}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-emerald-800/80">
                    {t.trialDesc}
                  </p>
                  <StartProTrialButton onSuccess={syncPlan} />
                </div>
              )}

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-zinc-500" />
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {isLaunchWeekActive() ? t.paypalSubscribeTitle : t.paypalTitle}
                  </h3>
                </div>
                <p className="mb-4 text-xs text-zinc-500">
                  {(isLaunchWeekActive() ? t.paypalSubscribeDesc : t.paypalDesc)
                    .replace("{intro}", PRO_PLAN_INTRO_PRICE_LABEL)
                    .replace("{regular}", PRO_PLAN_REGULAR_PRICE_LABEL)}
                </p>
                <div className="mb-4">
                  <ProPlanPrice size="sm" showBadge />
                  <p className="mt-1 text-xs text-zinc-500">PayPal</p>
                </div>
                <PayPalCheckout onSuccess={syncPlan} />
                <p className="mt-4 text-center text-[10px] text-zinc-400">
                  {t.paypalSandboxNote}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="mx-auto max-w-2xl space-y-6">
          <section className="glass-card rounded-lg p-6">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">{t.settingsProfile}</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Name</label>
                <input
                  readOnly
                  defaultValue={session?.user?.name ?? ""}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Email</label>
                <input
                  readOnly
                  defaultValue={session?.user?.email ?? ""}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-lg p-6">
            <div className="mb-4 flex items-center gap-3">
              <Bell className="h-4 w-4 text-zinc-400" />
              <h2 className="text-base font-semibold text-zinc-900">{t.settingsNotifications}</h2>
            </div>
            <p className="text-sm text-zinc-500">
              Email updates enabled for {session?.user?.email}
            </p>
          </section>

          <section className="glass-card rounded-lg p-6">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-zinc-400" />
              <h2 className="text-base font-semibold text-zinc-900">{t.settingsBilling}</h2>
            </div>
            <div className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3">
              <p className="text-sm font-medium text-indigo-900">
                {isPro ? `Pro Plan — ${getProPlanPriceLabel()}/month` : "Basic Plan — $0/month"}
              </p>
            </div>
          </section>

          <section className="glass-card rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-zinc-400" />
              <h2 className="text-base font-semibold text-zinc-900">{t.settingsSecurity}</h2>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
