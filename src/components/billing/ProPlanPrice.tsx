"use client";

import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { getLaunchCampaignSnapshot } from "@/lib/launch-campaign";
import { cn } from "@/lib/utils";

interface ProPlanPriceProps {
  size?: "sm" | "lg";
  className?: string;
  showBadge?: boolean;
}

export function ProPlanPrice({
  size = "lg",
  className,
}: ProPlanPriceProps) {
  const snap = getLaunchCampaignSnapshot();
  if (snap.active) {
    return (
      <LaunchPriceStack
        size={size === "lg" ? "md" : "sm"}
        className={className}
      />
    );
  }

  const priceClass =
    size === "lg" ? "text-2xl font-bold" : "text-sm font-semibold";

  return (
    <p className={cn(priceClass, "text-zinc-900", className)}>
      {snap.originalPriceLabel}
      <span className="text-sm font-normal text-zinc-500"> /חודש</span>
    </p>
  );
}
