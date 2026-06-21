"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { hasFeature } from "@/lib/plan-features";
import type { Translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "auto", labelKey: "langAuto" as const },
  { code: "he", labelKey: "langHe" as const },
  { code: "en", labelKey: "langEn" as const },
  { code: "ar", labelKey: "langAr" as const },
  { code: "es", labelKey: "langEs" as const },
  { code: "fr", labelKey: "langFr" as const },
  { code: "ru", labelKey: "langRu" as const },
];

interface UploadToolbarProps {
  language: string;
  onLanguageChange: (code: string) => void;
  onPromptLanguageUpgrade: () => void;
  usageCount: number;
  usageLimit: number;
  canTranscribe: boolean;
  className?: string;
}

export function UploadToolbar({
  language,
  onLanguageChange,
  onPromptLanguageUpgrade,
  usageCount,
  usageLimit,
  canTranscribe,
  className,
}: UploadToolbarProps) {
  const { t } = useLocale();
  const { isPro, limits, plan } = usePlan();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 text-start">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {t.dashNewTranscription}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t.uploadBrowse}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {hasFeature(plan, "languageSelect") ? (
            <label className="flex min-h-10 min-w-0 items-center gap-2">
              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="min-h-10 max-w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground shadow-xs transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {t[l.labelKey as keyof Translations] as string}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <button
              type="button"
              onClick={onPromptLanguageUpgrade}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-xs transition-colors hover:border-accent/30 hover:bg-accent-muted/50"
            >
              <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              {t.langAuto}
              <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pro
              </span>
            </button>
          )}

          <span
            className={cn(
              "inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-[11px] font-medium",
              isPro
                ? "border border-accent/25 bg-accent-muted text-accent"
                : "border border-border bg-muted text-muted-foreground",
            )}
          >
            {isPro ? `Pro · ${limits.maxFileSizeLabel}` : `Free · ${limits.maxFileSizeLabel}`}
          </span>
        </div>
      </div>

      {!canTranscribe && (
        <div className="rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
          {t.dashUsageLimit}{" "}
          <Link href="/settings#upgrade" className="font-medium underline underline-offset-2">
            {t.planUpgrade}
          </Link>
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        {t.dashUsageRemaining}: {usageLimit - usageCount} / {usageLimit}
      </p>
    </div>
  );
}
