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

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}י ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

  return (
    <div
      className={cn(
        "relative z-[45] border-b border-white/10 bg-[linear-gradient(90deg,#0c1a16_0%,#16352c_50%,#1f6b5c_100%)] text-[var(--staz-on-dark,#f4f1ea)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={go}
        className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-3 py-2.5 text-center text-xs font-medium tracking-wide transition-opacity hover:opacity-95 sm:gap-3 sm:text-sm"
      >
        <span aria-hidden className="hidden sm:inline">
          ✦
        </span>
        <span>
          חודש ההשקה של Staz AI — PRO ב־
          <span className="mx-1 font-semibold">{snap.launchPriceLabel}</span>
          <span className="mx-1 text-white/50 line-through">
            {snap.originalPriceLabel}
          </span>
        </span>
        <span className="hidden rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] sm:inline">
          {formatCountdown(snap.endsInMs)}
        </span>
      </button>
    </div>
  );
}
