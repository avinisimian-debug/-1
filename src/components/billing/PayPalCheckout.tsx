"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { isLaunchWeekActive, PRO_PLAN_INTRO_PRICE_LABEL, PRO_PLAN_REGULAR_PRICE_LABEL } from "@/lib/constants";

interface PayPalCheckoutProps {
  onSuccess?: () => void;
}

function PayPalButtonInner({ onSuccess }: PayPalCheckoutProps) {
  const { t } = useLocale();
  const { upgradeToPro } = usePlan();
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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

  return (
    <div>
      {status === "processing" && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.paypalProcessing}
        </div>
      )}

      {errorMsg && (
        <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
      )}

      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "subscribe",
          height: 45,
        }}
        disabled={status === "processing"}
        createSubscription={async () => {
          setStatus("processing");
          setErrorMsg(null);

          const res = await fetch("/api/paypal/create-subscription", {
            method: "POST",
          });

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setErrorMsg(data.error ?? t.paypalError);
            throw new Error(data.error);
          }

          return data.subscriptionId;
        }}
        onApprove={async (data) => {
          try {
            const res = await fetch("/api/paypal/activate-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscriptionId: data.subscriptionID }),
            });

            const result = await res.json();

            if (!res.ok) {
              setStatus("error");
              setErrorMsg(result.error ?? t.paypalError);
              return;
            }

            upgradeToPro();
            setStatus("success");
            onSuccess?.();
          } catch {
            setStatus("error");
            setErrorMsg(t.paypalError);
          }
        }}
        onError={() => {
          setStatus("error");
          setErrorMsg(t.paypalError);
        }}
        onCancel={() => {
          setStatus("idle");
        }}
      />

      {launchWeek && (
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          {t.paypalAutoBillingNote
            .replace("{intro}", PRO_PLAN_INTRO_PRICE_LABEL)
            .replace("{regular}", PRO_PLAN_REGULAR_PRICE_LABEL)}
        </p>
      )}
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
