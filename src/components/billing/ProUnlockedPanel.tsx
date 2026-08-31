"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Crown } from "lucide-react";
import { LANDING } from "@/lib/landing-copy";
import { PLAN_LIMITS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

type ProUnlockedPanelProps = {
  className?: string;
  showContinue?: boolean;
};

/** Shown after successful Pro checkout — lists what is now available. */
export function ProUnlockedPanel({
  className,
  showContinue = true,
}: ProUnlockedPanelProps) {
  const { t, locale } = useLocale();
  const he = locale === "he";
  const copy = LANDING.pricing;
  const limits = PLAN_LIMITS.pro;

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-[var(--bg-elevated)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Crown className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          </span>
          <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            {t.proUnlockedTitle}
          </h3>
        </div>

        <ul className="space-y-2">
          {copy.proBullets.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-50/90"
            >
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-emerald-800/80 dark:text-emerald-200/70">
          {he
            ? `עד ${limits.transcriptionsPerMonth} פגישות בחודש · קבצים עד ${limits.maxFileSizeLabel} · ספרייה בענן עד 50 פגישות.`
            : `Up to ${limits.transcriptionsPerMonth} meetings/month · files up to ${limits.maxFileSizeLabel} · cloud library up to 50 meetings.`}
        </p>

        {showContinue ? (
          <Link
            href="/"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            {t.proUnlockedCta}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
