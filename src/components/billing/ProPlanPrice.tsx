"use client";

import { getProPlanPriceLabel } from "@/lib/constants";
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
  const priceClass =
    size === "lg" ? "text-2xl font-bold" : "text-sm font-semibold";

  return (
    <p className={cn(priceClass, "text-zinc-900", className)}>
      {getProPlanPriceLabel()}
      <span className="text-sm font-normal text-zinc-500"> / month</span>
    </p>
  );
}
