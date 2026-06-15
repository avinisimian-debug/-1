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
      <div className="countdown-digit relative w-full overflow-hidden rounded-lg border border-amber-500/25 bg-black/50 px-2 py-2.5 text-center sm:px-3 sm:py-3">
        <span className="countdown-digit-inner font-mono text-xl font-bold tabular-nums text-amber-300 sm:text-2xl">
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
          ? "sale-countdown rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-violet-500/5 to-transparent p-4"
          : "sale-countdown gradient-border animate-glow-pulse rounded-2xl p-5 sm:p-6"
      }
    >
      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="sale-badge inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-lg shadow-amber-500/25">
            <Sparkles className="h-3.5 w-3.5" />
            {t.saleBadge}
          </span>
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
            -{PRO_PLAN_DISCOUNT_PERCENT}%
          </span>
        </div>

        {!compact && (
          <p className="mb-4 text-center text-sm text-zinc-400 sm:text-start">
            {t.saleTitle}
          </p>
        )}

        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-amber-400/80 sm:text-start">
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
