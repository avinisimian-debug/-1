"use client";

import { useState } from "react";
import { getProPlanPriceLabel } from "@/lib/constants";

export function PayPalSubscribeButton() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const price = getProPlanPriceLabel();

  const start = async () => {
    setStatus("processing");
    setError(null);
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });
      const data = (await res.json()) as {
        approveUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.approveUrl) {
        setStatus("error");
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
        Staz Pro — {price} לחודש
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        שומר את הפגישות בענן, מגדיל נפח, ומכין סגירה מקצועית שאפשר לשלוח.
        התשלום מאובטח דרך PayPal. אפשר לבטל בכל עת.
      </p>
      <button
        type="button"
        onClick={() => void start()}
        disabled={status === "processing"}
        className="lat-btn-primary mt-5 w-full disabled:opacity-60"
      >
        {status === "processing"
          ? "פותחים את PayPal…"
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
