"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Globe, Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { WHISPER_LANGUAGES } from "@/lib/whisper-languages";
import { cn } from "@/lib/utils";

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
  onPromptLanguageUpgrade: _onPromptLanguageUpgrade,
  usageCount,
  usageLimit,
  canTranscribe,
  className,
}: UploadToolbarProps) {
  const { t } = useLocale();
  const { isPro, limits } = usePlan();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? [...WHISPER_LANGUAGES]
      : WHISPER_LANGUAGES.filter(
          (l) =>
            l.code.includes(q) ||
            l.name.toLowerCase().includes(q) ||
            l.native.toLowerCase().includes(q),
        );
    // Keep the selected language visible even when filtered out.
    if (!base.some((l) => l.code === language)) {
      const selected = WHISPER_LANGUAGES.find((l) => l.code === language);
      if (selected) base.unshift(selected);
    }
    return base;
  }, [query, language]);

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

        <div className="flex w-full flex-col gap-2 sm:max-w-sm">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.langLabel}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.langSearchPlaceholder}
              className="min-h-9 w-full rounded-lg border border-border bg-card pe-3 ps-9 text-xs text-foreground shadow-xs focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="min-h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground shadow-xs transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            aria-label={t.langLabel}
          >
            {filtered.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code === "auto"
                  ? t.langAuto
                  : `${l.native} — ${l.name}`}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">
            {t.langWorldHint.replace("{count}", String(WHISPER_LANGUAGES.length - 1))}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-[11px] font-medium",
            isPro
              ? "border border-accent/25 bg-accent-muted text-accent"
              : "border border-border bg-muted text-muted-foreground",
          )}
        >
          {isPro
            ? `Pro · ${limits.maxFileSizeLabel}`
            : `Free · ${limits.maxFileSizeLabel}`}
        </span>
        <p className="text-[11px] text-muted-foreground">
          {t.dashUsageRemaining}: {usageLimit - usageCount} / {usageLimit}
        </p>
      </div>

      {!canTranscribe && (
        <div className="rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
          {t.dashUsageLimit}{" "}
          <Link
            href="/settings#upgrade"
            className="font-medium underline underline-offset-2"
          >
            {t.planUpgrade}
          </Link>
        </div>
      )}
    </div>
  );
}
