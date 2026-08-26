"use client";

import { useState } from "react";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { getProPlanPriceLabel } from "@/lib/constants";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";

export function PayPalSubscribeButton() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const snap = getLaunchCampaignSnapshot();
  const price = getProPlanPriceLabel();

  const start = async () => {
    setStatus("processing");
    setError(null);
    trackLaunchEvent("checkout_started", {
      source: "paypal_subscribe_button",
      launch: snap.active,
    });
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });
      const data = (await res.json()) as {
        approveUrl?: string;
        error?: string;
        offerExpired?: boolean;
      };
      if (!res.ok || !data.approveUrl) {
        setStatus("error");
        if (data.offerExpired) {
          setError(
            "מבצע ההשקה הסתיים. המחיר הנוכחי הוא $24.90 לחודש — רעננו את הדף ונסו שוב.",
          );
          return;
        }
        setError(data.error ?? "לא ניתן לפתוח את PayPal. נסו שוב בעוד רגע.");
        return;
      }
      window.location.href = data.approveUrl;
    } catch {
      setStatus("error");
      setError("לא ניתן לפתוח את PayPal. בדקו את החיבור ונסו שוב.");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm font-semibold text-foreground">
        {snap.active
          ? `Staz Pro — חודש השקה ${price}`
          : `Staz Pro — ${price} לחודש`}
      </p>
      {snap.active ? (
        <div className="mt-3">
          <LaunchPriceStack size="sm" />
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          שומר את הפגישות בענן, מגדיל נפח, ומכין סגירה מקצועית שאפשר לשלוח.
          התשלום מאובטח דרך PayPal. אפשר לבטל בכל עת.
        </p>
      )}
      {snap.active ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          תשלום מאובטח דרך PayPal. אפשר לבטל בכל עת.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void start()}
        disabled={status === "processing"}
        className="lat-btn-primary mt-5 w-full disabled:opacity-60"
      >
        {status === "processing"
          ? "פותחים את PayPal…"
          : snap.active
            ? `התחילו עם Pro · ${price}`
            : `המשיכו לתשלום · ${price}/חודש`}
      </button>
      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
