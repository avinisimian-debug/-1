"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Globe } from "lucide-react";
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

/** Compact meta row — language + usage. Does not compete with the dropzone. */
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
  const [openLang, setOpenLang] = useState(false);

  const selected = useMemo(
    () => WHISPER_LANGUAGES.find((l) => l.code === language),
    [language],
  );

  const langOptions = useMemo(() => {
    const priority = ["auto", "he", "en", "ar", "ru", "fr", "es", "de"];
    const head = priority
      .map((code) => WHISPER_LANGUAGES.find((l) => l.code === code))
      .filter((l): l is (typeof WHISPER_LANGUAGES)[number] => Boolean(l));
    const rest = WHISPER_LANGUAGES.filter((l) => !priority.includes(l.code));
    return [...head, ...rest];
  }, []);

  const remaining = Math.max(0, usageLimit - usageCount);
  const langLabel =
    language === "auto"
      ? t.langAuto
      : selected
        ? selected.native
        : language;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenLang((v) => !v)}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-3 text-xs font-medium text-[var(--ink-secondary)] shadow-xs transition-all duration-150 hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)] active:scale-[0.98]"
            aria-expanded={openLang}
            aria-haspopup="listbox"
          >
            <Globe className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
            {langLabel}
          </button>
          {openLang ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20 cursor-default"
                aria-label="סגירה"
                onClick={() => setOpenLang(false)}
              />
              <ul
                role="listbox"
                className="absolute start-0 z-30 mt-2 max-h-56 w-56 overflow-auto rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-premium)] animate-in fade-in zoom-in-95 duration-150"
              >
                {langOptions.map((l) => {
                  const active = l.code === language;
                  return (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-xs",
                          active
                            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]",
                        )}
                        onClick={() => {
                          onLanguageChange(l.code);
                          setOpenLang(false);
                        }}
                      >
                        <span>
                          {l.code === "auto" ? t.langAuto : l.native}
                        </span>
                        {active ? <Check className="h-3.5 w-3.5" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex min-h-9 items-center rounded-full px-3 text-[11px] font-medium",
              isPro
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "bg-[var(--bg-subtle)] text-[var(--ink-tertiary)]",
            )}
          >
            {isPro ? "Pro" : "Free"} · {limits.maxFileSizeLabel}
          </span>
          <span className="text-[11px] tabular-nums text-[var(--ink-tertiary)]">
            נותרו {remaining} מתוך {usageLimit}
          </span>
        </div>
      </div>

      {!canTranscribe && (
        <div className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
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
