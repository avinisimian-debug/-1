"use client";

import { useMemo } from "react";
import { getLaunchCampaignSnapshot } from "@/lib/launch-campaign";
import { cn } from "@/lib/utils";

/** Shared price stack: strike + launch / or regular only. */
export function LaunchPriceStack({
  className,
  size = "md",
  tone = "light",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
}) {
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);
  const dark = tone === "dark";

  if (!snap.active) {
    return (
      <p
        className={cn(
          "font-bold tracking-tight",
          size === "lg" && "text-4xl",
          size === "md" && "text-3xl",
          size === "sm" && "text-xl",
          dark ? "text-[var(--staz-on-dark)]" : "text-[var(--staz-ink)]",
          className,
        )}
      >
        {snap.originalPriceLabel}
        <span
          className={cn(
            "ms-2 text-sm font-medium",
            dark ? "text-[var(--staz-on-dark-muted)]" : "text-[var(--staz-muted)]",
          )}
        >
          /חודש
        </span>
      </p>
    );
  }

  return (
    <div className={cn("text-start", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        <del
          className={cn(
            "font-medium",
            size === "lg" ? "text-lg" : "text-sm",
            dark ? "text-white/45" : "text-[var(--staz-muted)]",
          )}
        >
          {snap.originalPriceLabel}
        </del>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
            dark ? "bg-white/10 text-[#5fb7a0]" : "bg-[var(--staz-primary-soft)] text-[var(--staz-primary)]",
          )}
        >
          {snap.discountPercent}% OFF
        </span>
      </div>
      <p
        className={cn(
          "mt-1 font-bold tracking-tight",
          size === "lg" && "text-4xl",
          size === "md" && "text-3xl",
          size === "sm" && "text-xl",
          dark ? "text-[var(--staz-on-dark)]" : "text-[var(--staz-ink)]",
        )}
      >
        {snap.launchPriceLabel}
        <span
          className={cn(
            "ms-2 text-sm font-medium",
            dark ? "text-[var(--staz-on-dark-muted)]" : "text-[var(--staz-muted)]",
          )}
        >
          /חודש
        </span>
      </p>
      <p
        className={cn(
          "mt-1 text-xs",
          dark ? "text-white/55" : "text-[var(--staz-muted)]",
        )}
      >
        {snap.billingNoteHe}
      </p>
    </div>
  );
}
