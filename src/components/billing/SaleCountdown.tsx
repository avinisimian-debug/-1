"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import {
  PRO_PLAN_DISCOUNT_PERCENT,
  PRO_PLAN_SALE_END,
  isProSaleActive,
} from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, PRO_PLAN_SALE_END.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function CountdownUnit({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="countdown-digit relative w-full overflow-hidden rounded-md border border-zinc-200 bg-white px-2 py-2.5 text-center shadow-sm sm:px-3 sm:py-3">
        <span className="countdown-digit-inner font-mono text-xl font-semibold tabular-nums text-zinc-900 sm:text-2xl">
          {value}
        </span>
        <div className="pointer-events-none absolute inset-0 shimmer opacity-60" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export function SaleCountdown({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();
  const [active, setActive] = useState(isProSaleActive);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);

  useEffect(() => {
    const tick = () => {
      const stillActive = isProSaleActive();
      setActive(stillActive);
      if (stillActive) setTimeLeft(calcTimeLeft());
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!active) return null;

  return (
    <div
      className={
        compact
          ? "sale-countdown rounded-lg border border-indigo-200 bg-indigo-50 p-4"
          : "sale-countdown rounded-lg p-5 sm:p-6"
      }
    >
      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="sale-badge inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <Sparkles className="h-3.5 w-3.5" />
            {t.saleBadge}
          </span>
          <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
            -{PRO_PLAN_DISCOUNT_PERCENT}%
          </span>
        </div>

        {!compact && (
          <p className="mb-4 text-center text-sm text-zinc-600 sm:text-start">
            {t.saleTitle}
          </p>
        )}

        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-zinc-500 sm:text-start">
          {t.saleEndsIn}
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <CountdownUnit value={pad(timeLeft.days)} label={t.saleDays} />
          <CountdownUnit value={pad(timeLeft.hours)} label={t.saleHours} />
          <CountdownUnit value={pad(timeLeft.minutes)} label={t.saleMinutes} />
          <CountdownUnit value={pad(timeLeft.seconds)} label={t.saleSeconds} />
        </div>
      </div>
    </div>
  );
}
