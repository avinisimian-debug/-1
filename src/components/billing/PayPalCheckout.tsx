"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import type { CreateOrderActions, OnApproveData } from "@paypal/paypal-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import {
  getProLifetimePriceLabel,
  isLaunchWeekActive,
  PRO_LIFETIME_PRICE_LABEL,
} from "@/lib/constants";

interface PayPalCheckoutProps {
  onSuccess?: () => void;
}

function PayPalButtonInner({ onSuccess }: PayPalCheckoutProps) {
  const { t } = useLocale();
  const { upgradeToPro, syncPlan } = usePlan();
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

  const captureOrder = async (orderId: string) => {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg((result.error as string) ?? t.paypalError);
      return false;
    }

    upgradeToPro();
    await syncPlan();
    setStatus("success");
    onSuccess?.();
    return true;
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
          label: "pay",
          height: 45,
        }}
        disabled={status === "processing"}
        createOrder={async (_data, actions: CreateOrderActions) => {
          setStatus("processing");
          setErrorMsg(null);

          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
            });
            const data = (await res.json()) as { orderId?: string; error?: string };

            if (!res.ok || !data.orderId) {
              const msg = data.error || t.paypalError;
              setStatus("error");
              setErrorMsg(msg);
              throw new Error(msg);
            }

            return data.orderId;
          } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : t.paypalError);
            throw err;
          }
        }}
        onApprove={async (data: OnApproveData) => {
          try {
            if (!data.orderID) {
              setStatus("error");
              setErrorMsg(t.paypalError);
              return;
            }
            await captureOrder(data.orderID);
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
          {t.paypalLifetimeNote
            .replace("{price}", getProLifetimePriceLabel())
            .replace("{regular}", PRO_LIFETIME_PRICE_LABEL)}
        </p>
      )}

      <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground/80">
        {t.paypalOnlyNote}
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
        intent: "capture",
      }}
    >
      <PayPalButtonInner {...props} />
    </PayPalScriptProvider>
  );
}
