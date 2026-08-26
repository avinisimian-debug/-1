"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle2, Crown, Keyboard, Shield, Wallet } from "lucide-react";
import { PayPalSubscribeButton } from "@/components/billing/PayPalSubscribeButton";
import { PlanFeatureComparison } from "@/components/billing/PlanFeatureComparison";
import { ProPlanPrice } from "@/components/billing/ProPlanPrice";
import { Pricing, type PricingPlan } from "@/components/blocks/pricing";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AnimatedDrawer } from "@/components/spectrumui/animateddrawer";
import { VintageKeyboard } from "@/components/ui/vintage-keyboard";
import { LANDING } from "@/lib/landing-copy";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import { getLaunchCampaignSnapshot } from "@/lib/launch-campaign";
import { markStepComplete } from "@/lib/onboarding-store";
import { scrollToUpgradeWithRetry } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

interface PlanApiResponse {
  plan: "free" | "pro";
  hasSubscription?: boolean;
  needsPayPalSetup?: boolean;
  trialEndsAt?: string;
  proLifetime?: boolean;
}

export default function SettingsPage() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { plan, isPro, syncPlan } = usePlan();
  const { data: session, status } = useSession();
  const [planDetails, setPlanDetails] = useState<PlanApiResponse | null>(null);
  const [subMessage, setSubMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadPlanDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        setPlanDetails((await res.json()) as PlanApiResponse);
      }
    } catch {
      setPlanDetails(null);
    }
  }, []);

  useEffect(() => {
    const email = session?.user?.email;
    if (email) markStepComplete(email, "profile");
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      loadPlanDetails();
    }
  }, [session?.user?.email, plan, loadPlanDetails]);

  useEffect(() => {
    if (window.location.hash !== "#upgrade") return;
    scrollToUpgradeWithRetry();
  }, [pathname, isPro, planDetails]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#upgrade") {
        scrollToUpgradeWithRetry();
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("subscription") === "cancel") {
      setSubMessage({ type: "error", text: t.paypalCancelled });
      window.history.replaceState({}, "", "/settings#upgrade");
      return;
    }

    const subscriptionId = params.get("subscription_id");
    if (!subscriptionId) return;

    // Wait for auth — activating before session is ready causes 401 toasts.
    if (status !== "authenticated" || !session?.user?.email) return;

    const activationKey = `paypal-activated:${subscriptionId}`;
    if (sessionStorage.getItem(activationKey)) {
      window.history.replaceState({}, "", "/settings#upgrade");
      return;
    }
    sessionStorage.setItem(activationKey, "1");

    fetch("/api/paypal/activate-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          await syncPlan();
          await loadPlanDetails();
          setSubMessage({ type: "success", text: t.paypalSuccess });
          void import("@/lib/launch-campaign").then(({ trackLaunchEvent }) => {
            trackLaunchEvent("checkout_completed");
          });
        } else {
          sessionStorage.removeItem(activationKey);
          setSubMessage({
            type: "error",
            text: (data.error as string) ?? t.paypalError,
          });
        }
      })
      .catch(() => {
        sessionStorage.removeItem(activationKey);
        setSubMessage({ type: "error", text: t.paypalError });
      })
      .finally(() => {
        window.history.replaceState({}, "", "/settings#upgrade");
      });
  }, [
    status,
    session?.user?.email,
    syncPlan,
    loadPlanDetails,
    t.paypalCancelled,
    t.paypalError,
    t.paypalSuccess,
  ]);

  const scrollToCheckout = useCallback(() => {
    window.history.pushState(null, "", "/settings#upgrade");
    scrollToUpgradeWithRetry();
  }, []);

  const needsPayPalSetup = Boolean(planDetails?.needsPayPalSetup);
  const hasSubscription = Boolean(planDetails?.hasSubscription);
  const proLifetime = Boolean(planDetails?.proLifetime);
  const showCheckout = !isPro || needsPayPalSetup;
  const showProActive = isPro && !needsPayPalSetup;
  const snap = getLaunchCampaignSnapshot();
  const pricingCopy = LANDING.pricing;
  const proPrice = getProPlanPriceLabel();

  const settingsPlans: PricingPlan[] = [
    {
      name: "FREE",
      price: "0",
      yearlyPrice: "0",
      period: pricingCopy.perMonth,
      description: pricingCopy.freeTag,
      features: [...pricingCopy.freeBullets],
      buttonText:
        plan === "free" ? t.pricingCurrentPlan : pricingCopy.freeCta,
      note: pricingCopy.freeNote,
      disabled: plan === "free",
      isPopular: false,
    },
    {
      name: "PRO",
      price: snap.originalPrice,
      yearlyPrice: snap.active ? snap.launchPrice : snap.originalPrice,
      period: pricingCopy.perMonth,
      description: pricingCopy.proValue,
      features: [...pricingCopy.proBullets],
      buttonText:
        plan === "pro"
          ? t.pricingCurrentPlan
          : snap.active
            ? `Pro · ${snap.launchPriceLabel}`
            : pricingCopy.proCta,
      note: snap.active ? snap.billingNoteHe : pricingCopy.proNote(proPrice),
      badge: snap.active ? `${snap.discountPercent}% הנחה` : "Most Popular",
      onClick: plan === "pro" ? undefined : scrollToCheckout,
      disabled: plan === "pro",
      isPopular: true,
    },
  ];

  return (
    <DashboardShell title={t.settingsTitle} description={t.settingsDesc}>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="lat-panel rounded-xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted">
              <Crown className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              {t.settingsPlan}
            </h2>
          </div>

          <Pricing
            plans={settingsPlans}
            title={t.pricingTitle}
            description={t.pricingSubtitle}
            showToggle={snap.active}
            tone="default"
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

          {showProActive && (
            <div className="mt-6 space-y-2 text-center">
              <p className="text-xs font-medium text-emerald-700">
                {t.settingsProActive}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {hasSubscription && !proLifetime
                  ? t.settingsManagePayPal
                  : t.settingsProLifetime}
              </p>
            </div>
          )}

          {showCheckout && (
            <div className="mt-8 scroll-mt-24 space-y-4" id="upgrade" data-paypal-section>
              <div className="lat-panel rounded-xl p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {getLaunchCampaignSnapshot().active
                      ? `חודש ההשקה — Staz Pro ב־${getProPlanPriceLabel()}`
                      : `Staz Pro — ${getProPlanPriceLabel()} לחודש`}
                  </h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  כל פגישה נשמרת בספרייה, עם יותר נפח וסגירה מקצועית לשליחה.
                </p>
                <div className="mb-4">
                  <ProPlanPrice size="sm" />
                </div>
                <PayPalSubscribeButton />
              </div>
            </div>
          )}
        </section>

        <div className="mx-auto max-w-2xl space-y-6">
          <section className="lat-panel rounded-xl p-6">
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

          <section className="lat-panel rounded-xl p-6">
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

          <section className="lat-panel rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <Wallet className="h-4 w-4 text-muted-foreground" />
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

          <section className="lat-panel rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                {t.settingsSecurity}
              </h2>
            </div>
          </section>

          <section className="lat-panel overflow-hidden rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  מקלדת רטרו
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  קומפוננטת Vintage Keyboard מהפקודה — בלי שינוי עיצוב.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#120e0b] px-2 py-6 sm:px-4">
              <VintageKeyboard />
            </div>
          </section>

          <section className="lat-panel overflow-hidden rounded-xl p-6">
            <h2 className="mb-2 text-base font-semibold text-foreground">
              Animated Drawer
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              קומפוננטת Spectrum / 21st animated-drawer — כפי שהותקנה מהפקודה.
            </p>
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-border bg-muted/30">
              <AnimatedDrawer />
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
