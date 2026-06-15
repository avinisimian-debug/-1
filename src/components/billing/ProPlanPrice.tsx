"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  PRO_PLAN_REGULAR_PRICE_LABEL,
  PRO_PLAN_SALE_PRICE_LABEL,
  getProPlanPriceLabel,
  isProSaleActive,
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
  const [onSale, setOnSale] = useState(isProSaleActive);

  useEffect(() => {
    const id = setInterval(() => setOnSale(isProSaleActive()), 1000);
    return () => clearInterval(id);
  }, []);

  const priceClass =
    size === "lg" ? "text-2xl font-bold" : "text-sm font-semibold";

  if (!onSale) {
    return (
      <p className={cn(priceClass, "text-zinc-900", className)}>
        {getProPlanPriceLabel()}
        <span className="text-sm font-normal text-zinc-500">/mo</span>
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={cn(
            "text-zinc-500 line-through decoration-zinc-600",
            size === "lg" ? "text-lg" : "text-xs",
          )}
        >
          {PRO_PLAN_REGULAR_PRICE_LABEL}
        </span>
        <span className={cn(priceClass, "text-zinc-900")}>
          {PRO_PLAN_SALE_PRICE_LABEL}
          <span className="text-sm font-normal text-zinc-500">/mo</span>
        </span>
      </div>
      {showBadge && (
        <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {t.saleFirstMonth}
        </span>
      )}
    </div>
  );
}
