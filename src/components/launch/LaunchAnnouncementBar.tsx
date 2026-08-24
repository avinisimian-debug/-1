"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

type LaunchAnnouncementBarProps = {
  onOpenOffer?: () => void;
  className?: string;
};

function formatCountdown(ms: number): { d: string; h: string; m: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return {
    d: String(days),
    h: String(hours).padStart(2, "0"),
    m: String(minutes).padStart(2, "0"),
  };
}

export function LaunchAnnouncementBar({
  onOpenOffer,
  className,
}: LaunchAnnouncementBarProps) {
  const [now, setNow] = useState(() => Date.now());
  const snap = useMemo(() => getLaunchCampaignSnapshot(now), [now]);

  useEffect(() => {
    if (!snap.active) return;
    trackLaunchEvent("launch_banner_view");
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [snap.active]);

  if (!snap.active) return null;

  const go = () => {
    trackLaunchEvent("launch_banner_click");
    if (onOpenOffer) {
      onOpenOffer();
      return;
    }
    window.location.href = SETTINGS_UPGRADE_PATH;
  };

  const cd = formatCountdown(snap.endsInMs);

  return (
    <div
      className={cn(
        "relative z-[45] overflow-hidden border-b border-teal-400/20 bg-[#030607]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.12),transparent)]"
        aria-hidden
      />
      <button
        type="button"
        onClick={go}
        className="relative mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-3 py-2.5 text-center text-xs font-medium tracking-wide text-white/90 transition-opacity hover:opacity-95 sm:gap-4 sm:text-sm"
      >
        <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf] sm:inline-block" aria-hidden />
        <span>
          <span className="font-semibold tracking-[0.12em] text-[#5eead4]">
            LAUNCH MONTH
          </span>
          <span className="mx-2 text-white/35">·</span>
          PRO ב־
          <span className="mx-1 font-semibold text-white">{snap.launchPriceLabel}</span>
          <span className="mx-1 text-white/40 line-through">
            {snap.originalPriceLabel}
          </span>
        </span>
        <span
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-white/70 sm:inline-flex"
          aria-label={`נותרו ${cd.d} ימים ${cd.h} שעות ${cd.m} דקות`}
        >
          <span className="text-white/40">Ends</span>
          <span className="tabular-nums text-[#5eead4]">
            {cd.d}d {cd.h}:{cd.m}
          </span>
        </span>
      </button>
    </div>
  );
}
