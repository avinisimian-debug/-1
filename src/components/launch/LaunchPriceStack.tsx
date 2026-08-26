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
          dark ? "text-white" : "text-[var(--staz-ink)]",
          className,
        )}
      >
        {snap.originalPriceLabel}
        <span
          className={cn(
            "ms-2 text-sm font-medium",
            dark ? "text-white/50" : "text-[var(--staz-muted)]",
          )}
        >
          /חודש
        </span>
      </p>
    );
  }

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-baseline justify-center gap-2">
        <del
          className={cn(
            "font-medium",
            size === "lg" ? "text-lg" : "text-sm",
            dark ? "text-white/40" : "text-[var(--staz-muted)]",
          )}
        >
          {snap.originalPriceLabel}
        </del>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
            dark
              ? "border border-teal-400/30 bg-teal-400/10 text-[#5eead4]"
              : "bg-[var(--staz-primary-soft)] text-[var(--staz-primary)]",
          )}
        >
          {snap.discountPercent}% הנחה
        </span>
      </div>
      <p
        className={cn(
          "mt-1.5 font-bold tracking-tight",
          size === "lg" && "text-5xl",
          size === "md" && "text-4xl",
          size === "sm" && "text-2xl",
          dark ? "text-white" : "text-[var(--staz-ink)]",
        )}
      >
        {snap.launchPriceLabel}
        <span
          className={cn(
            "ms-2 text-sm font-medium",
            dark ? "text-white/50" : "text-[var(--staz-muted)]",
          )}
        >
          /חודש
        </span>
      </p>
      <p
        className={cn(
          "mt-2 text-xs leading-relaxed",
          dark ? "text-white/45" : "text-[var(--staz-muted)]",
        )}
      >
        {snap.billingNoteHe}
      </p>
    </div>
  );
}
