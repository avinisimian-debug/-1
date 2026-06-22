"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import type { CreateSubscriptionActions } from "@paypal/paypal-js";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import {
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE_LABEL,
  PRO_PLAN_REGULAR_PRICE_LABEL,
} from "@/lib/constants";
import { Button } from "@/shared/ui/button";

interface PayPalCheckoutProps {
  onSuccess?: () => void;
}

function PayPalButtonInner({ onSuccess }: PayPalCheckoutProps) {
  const { t } = useLocale();
  const { upgradeToPro } = usePlan();
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const launchWeek = isLaunchWeekActive();

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-700">
        {t.paypalNotConfigured}
      </p>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700">{t.paypalSuccess}</p>
      </div>
    );
  }

  const activateSubscription = async (subscriptionId: string) => {
    const res = await fetch("/api/paypal/activate-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg((result.error as string) ?? t.paypalError);
      return false;
    }

    upgradeToPro();
    setStatus("success");
    onSuccess?.();
    return true;
  };

  const handleRedirectCheckout = async () => {
    setRedirecting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });

      const data = (await res.json()) as {
        approveUrl?: string;
        subscriptionId?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || t.paypalError);
      }

      if (data.approveUrl) {
        window.location.href = data.approveUrl;
        return;
      }

      if (data.subscriptionId) {
        await activateSubscription(data.subscriptionId);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.paypalError);
    } finally {
      setRedirecting(false);
    }
  };

  return (
    <div>
      {status === "processing" && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.paypalProcessing}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 space-y-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{errorMsg}</p>
          <p className="text-xs text-red-600/90">{t.paypalBuyerTip}</p>
        </div>
      )}

      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "subscribe",
          height: 45,
        }}
        disabled={status === "processing" || redirecting}
        createSubscription={async (_data, actions: CreateSubscriptionActions) => {
          setStatus("processing");
          setErrorMsg(null);

          try {
            const res = await fetch("/api/paypal/subscription-plan");
            const data = (await res.json()) as { planId?: string; error?: string };

            if (!res.ok || !data.planId) {
              const msg = data.error || t.paypalError;
              setStatus("error");
              setErrorMsg(msg);
              throw new Error(msg);
            }

            return actions.subscription.create({
              plan_id: data.planId,
            });
          } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : t.paypalError);
            throw err;
          }
        }}
        onApprove={async (data) => {
          try {
            if (!data.subscriptionID) {
              setStatus("error");
              setErrorMsg(t.paypalError);
              return;
            }
            await activateSubscription(data.subscriptionID);
          } catch {
            setStatus("error");
            setErrorMsg(t.paypalError);
          }
        }}
        onError={() => {
          setStatus("error");
          setErrorMsg(t.paypalPreapprovalError);
        }}
        onCancel={() => {
          setStatus("idle");
        }}
      />

      <div className="mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          disabled={status === "processing" || redirecting}
          onClick={handleRedirectCheckout}
        >
          {redirecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          {t.paypalRedirectCta}
        </Button>
      </div>

      {launchWeek && (
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          {t.paypalAutoBillingNote
            .replace("{intro}", PRO_PLAN_INTRO_PRICE_LABEL)
            .replace("{regular}", PRO_PLAN_REGULAR_PRICE_LABEL)}
        </p>
      )}

      <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground/80">
        {t.paypalBuyerTip}
      </p>
    </div>
  );
}

export function PayPalCheckout(props: PayPalCheckoutProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return <PayPalButtonInner {...props} />;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "subscription",
        vault: true,
      }}
    >
      <PayPalButtonInner {...props} />
    </PayPalScriptProvider>
  );
}
