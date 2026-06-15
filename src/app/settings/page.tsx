"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Check, CreditCard, Crown, Shield } from "lucide-react";
import { PayPalCheckout } from "@/components/billing/PayPalCheckout";
import { PlanFeatureComparison } from "@/components/billing/PlanFeatureComparison";
import { ProPlanPrice } from "@/components/billing/ProPlanPrice";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { PLAN_LIMITS, getProPlanPriceLabel, isProSaleActive } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t } = useLocale();
  const { plan, isPro, downgradeToFree, syncPlan } = usePlan();
  const { data: session } = useSession();

  return (
    <DashboardShell title={t.settingsTitle} description={t.settingsDesc}>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <section className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15">
              <Crown className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white">{t.settingsPlan}</h2>
          </div>

          {!isPro && isProSaleActive() && (
            <div className="mb-6">
              <SaleCountdown />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {(["free", "pro"] as const).map((tier) => {
              const limits = PLAN_LIMITS[tier];
              const selected = plan === tier;
              return (
                <div
                  key={tier}
                  className={cn(
                    "relative rounded-xl border p-5 text-start transition-all",
                    selected
                      ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                      : "border-white/[0.06] bg-white/[0.02]",
                  )}
                >
                  {selected && (
                    <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                      <Check className="h-3 w-3 text-black" />
                    </span>
                  )}
                  <p className="text-sm font-bold capitalize text-white">
                    {tier === "pro" ? "Pro" : "Free"}
                  </p>
                  {tier === "pro" ? (
                    <div className="mt-1">
                      <ProPlanPrice />
                    </div>
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-amber-400">
                      $0
                      <span className="text-sm font-normal text-zinc-500">/mo</span>
                    </p>
                  )}
                  <ul className="mt-4 space-y-2 text-xs text-zinc-400">
                    <li>{limits.maxFileSizeLabel} / file</li>
                    <li>{limits.maxDurationLabel}</li>
                    <li>{limits.transcriptionsPerMonth} / month</li>
                  </ul>
                  {tier === "free" && isPro && (
                    <button
                      type="button"
                      onClick={downgradeToFree}
                      className="mt-4 text-xs text-zinc-500 underline hover:text-zinc-300"
                    >
                      Switch to Free (demo)
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <PlanFeatureComparison />

          {isPro ? (
            <p className="mt-4 text-center text-xs text-emerald-400/80">
              {t.settingsProActive}
            </p>
          ) : (
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5" data-paypal-section>
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{t.paypalTitle}</h3>
              </div>
              <p className="mb-4 text-xs text-zinc-500">{t.paypalDesc}</p>
              <div className="mb-4">
                <ProPlanPrice size="sm" showBadge />
                <p className="mt-1 text-xs text-zinc-500">PayPal</p>
              </div>
              <PayPalCheckout onSuccess={syncPlan} />
              <p className="mt-4 text-center text-[10px] text-zinc-600">
                {t.paypalSandboxNote}
              </p>
            </div>
          )}
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-base font-bold text-white">{t.settingsProfile}</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">Name</label>
              <input
                readOnly
                defaultValue={session?.user?.name ?? ""}
                className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2.5 text-sm text-zinc-300"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">Email</label>
              <input
                readOnly
                defaultValue={session?.user?.email ?? ""}
                className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2.5 text-sm text-zinc-300"
              />
            </div>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-bold text-white">{t.settingsNotifications}</h2>
          </div>
          <p className="text-sm text-zinc-500">
            Email updates enabled for {session?.user?.email}
          </p>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">{t.settingsBilling}</h2>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-sm font-medium text-amber-300">
              {isPro ? `Pro Plan — ${getProPlanPriceLabel()}/month` : "Free Plan — $0/month"}
            </p>
          </div>
          {!isPro && (
            <Link
              href="#"
              className="btn-cinema mt-4 inline-flex rounded-lg px-4 py-2 text-xs font-semibold text-white"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("[data-paypal-section]")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t.planUpgrade}
            </Link>
          )}
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-bold text-white">{t.settingsSecurity}</h2>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
