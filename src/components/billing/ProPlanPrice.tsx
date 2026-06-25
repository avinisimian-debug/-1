"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  getProLifetimePriceLabel,
  isLaunchWeekActive,
  PRO_LIFETIME_PRICE_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProPlanPriceProps {
  size?: "sm" | "lg";
  showBadge?: boolean;
  className?: string;
}

export function ProPlanPrice({
  size = "lg",
  showBadge = true,
  className,
}: ProPlanPriceProps) {
  const { t } = useLocale();
  const [launchWeek, setLaunchWeek] = useState(isLaunchWeekActive);

  useEffect(() => {
    const id = setInterval(() => setLaunchWeek(isLaunchWeekActive()), 1000);
    return () => clearInterval(id);
  }, []);

  const priceClass =
    size === "lg" ? "text-2xl font-bold" : "text-sm font-semibold";

  if (!launchWeek) {
    return (
      <p className={cn(priceClass, "text-zinc-900", className)}>
        {getProLifetimePriceLabel()}
        <span className="text-sm font-normal text-zinc-500">
          {" "}
          {t.proLifetimeOnce}
        </span>
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={cn(priceClass, "text-zinc-900")}>
          {getProLifetimePriceLabel()}
          <span className="text-sm font-normal text-zinc-500">
            {" "}
            {t.proLifetimeOnce}
          </span>
        </span>
        <span
          className={cn(
            "text-zinc-400 line-through",
            size === "lg" ? "text-sm" : "text-xs",
          )}
        >
          {PRO_LIFETIME_PRICE_LABEL}
        </span>
      </div>
      {showBadge && (
        <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {t.proLifetimeBadge}
        </span>
      )}
      <p className="text-[11px] text-zinc-500">{t.proLifetimePricingNote}</p>
    </div>
  );
}
