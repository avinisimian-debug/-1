"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";

const DISMISS_KEY = "staz-launch-dash-card-dismissed-v1";

/** Slim, dismissible strip — never dominates the workbench. */
export function LaunchDashboardCard({ isPro }: { isPro: boolean }) {
  const router = useRouter();
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (isPro || !snap.active || hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2.5 shadow-xs sm:px-4">
      <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-[var(--accent)]">
        LAUNCH
      </span>
      <p className="min-w-0 flex-1 text-sm text-[var(--ink-secondary)]">
        Pro ב־
        <span className="font-semibold text-[var(--ink-primary)]">
          {snap.launchPriceLabel}
        </span>
        <span className="mx-1.5 text-[var(--ink-tertiary)] line-through">
          {snap.originalPriceLabel}
        </span>
      </p>
      <button
        type="button"
        onClick={() => {
          trackLaunchEvent("pro_upgrade_click", { source: "dashboard_card" });
          router.push(SETTINGS_UPGRADE_PATH);
        }}
        className="lat-btn-primary !min-h-9 !rounded-full !px-3.5 !text-xs"
      >
        שדרגו
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-lg p-1.5 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
        aria-label="הסתר הצעה"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}
