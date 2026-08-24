"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";

/** Compact dashboard card — only for free users while campaign is active. */
export function LaunchDashboardCard({ isPro }: { isPro: boolean }) {
  const router = useRouter();
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  if (isPro || !snap.active) return null;

  return (
    <aside className="mb-6 overflow-hidden rounded-[var(--staz-radius,1rem)] border border-[var(--staz-border)] bg-[linear-gradient(135deg,#0c1a16_0%,#16352c_100%)] p-5 text-[var(--staz-on-dark,#f4f1ea)]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5fb7a0]">
        LAUNCH MONTH
      </p>
      <h3 className="mt-2 font-brand text-xl tracking-tight">
        הוזמנתם לחוות Staz Pro
      </h3>
      <p className="mt-2 text-sm text-white/75">
        <span className="line-through opacity-60">{snap.originalPriceLabel}</span>
        {" → "}
        <span className="font-semibold text-white">{snap.launchPriceLabel}/חודש</span>
      </p>
      <p className="mt-1 text-xs text-white/55">{snap.billingNoteHe}</p>
      <button
        type="button"
        onClick={() => {
          trackLaunchEvent("pro_upgrade_click", { source: "dashboard_card" });
          router.push(SETTINGS_UPGRADE_PATH);
        }}
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#f5f3ee] px-4 text-sm font-semibold text-[#0c1a16] transition-colors hover:bg-white"
      >
        שדרגו ל-PRO
      </button>
    </aside>
  );
}
