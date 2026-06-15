"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clapperboard, Globe, ListChecks, Sparkles, Upload, Wand2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TestimonialsCarousel } from "@/components/dashboard/TestimonialsCarousel";
import { ResultsView } from "@/components/results/ResultsView";
import { ErrorState } from "@/components/upload/ErrorState";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { ProcessingState } from "@/components/upload/ProcessingState";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useTranscription } from "@/hooks/useTranscription";
import { useUsage } from "@/hooks/useUsage";
import { hasFeature } from "@/lib/plan-features";
import type { TranscriptionResult } from "@/lib/types";

const LANGUAGES = [
  { code: "auto", labelKey: "langAuto" as const },
  { code: "he", labelKey: "langHe" as const },
  { code: "en", labelKey: "langEn" as const },
  { code: "ar", labelKey: "langAr" as const },
  { code: "es", labelKey: "langEs" as const },
  { code: "fr", labelKey: "langFr" as const },
  { code: "ru", labelKey: "langRu" as const },
];

const HISTORY_VIEW_KEY = "meetscribe-view-result";

export function DashboardContent() {
  const { t } = useLocale();
  const { isPro, limits, plan } = usePlan();
  const { count, limit } = useUsage();
  const [language, setLanguage] = useState("auto");
  const {
    status,
    stage,
    stageIndex,
    uploadedFile,
    result,
    error,
    processFile,
    reset,
    canTranscribe,
  } = useTranscription();

  const [historyResult, setHistoryResult] = useState<TranscriptionResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(HISTORY_VIEW_KEY);
    if (!stored) return;
    try {
      setHistoryResult(JSON.parse(stored) as TranscriptionResult);
      sessionStorage.removeItem(HISTORY_VIEW_KEY);
    } catch {
      sessionStorage.removeItem(HISTORY_VIEW_KEY);
    }
  }, []);

  const displayResult = result ?? historyResult;
  const displayStatus = displayResult ? "complete" : status;

  const features = [
    { icon: Wand2, label: t.authFeature1 },
    { icon: Sparkles, label: t.authFeature2 },
    { icon: ListChecks, label: t.authFeature3 },
  ];

  return (
    <DashboardShell title={t.dashTitle} description={t.dashDesc}>
      {displayStatus === "idle" && (
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="gradient-border overflow-hidden rounded-3xl">
            <div className="relative bg-gradient-to-br from-violet-950/40 via-[#0a0a0c] to-amber-950/20 px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%)]" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-amber-500 shadow-xl shadow-violet-600/25">
                  <Clapperboard className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className="text-2xl font-bold leading-tight text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {t.dashHero}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                    {t.dashHeroDesc}
                  </p>
                </div>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {features.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-amber-400" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] bg-black/20 px-4 py-6 sm:px-8 sm:py-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3
                    className="text-base font-bold text-white"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {t.dashNewTranscription}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.uploadBrowse}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {hasFeature(plan, "languageSelect") && (
                    <label className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-violet-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-lg border border-white/[0.08] bg-black/30 px-2 py-1.5 text-xs text-zinc-300"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code} className="bg-zinc-900">
                            {t[l.labelKey]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <span
                    className={
                      isPro
                        ? "rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400"
                        : "rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-400"
                    }
                  >
                    {isPro
                      ? `Pro · ${limits.maxFileSizeLabel}`
                      : `Free · ${limits.maxFileSizeLabel}`}
                  </span>
                </div>
              </div>

              {!canTranscribe && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {t.dashUsageLimit}{" "}
                  <Link href="/settings" className="underline text-amber-400">
                    {t.planUpgrade}
                  </Link>
                </div>
              )}

              <p className="mb-4 text-center text-[11px] text-zinc-600">
                {t.dashUsageRemaining}: {limit - count} / {limit}
              </p>

              <FileUploadZone
                onFileSelect={(f) => processFile(f, language)}
                disabled={!canTranscribe}
              />
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/15">
              <Upload className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {t.dashProTip}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {t.dashProTipDesc}
              </p>
            </div>
          </div>

          <TestimonialsCarousel />
        </div>
      )}

      {status === "processing" && uploadedFile && (
        <ProcessingState
          fileName={uploadedFile.name}
          fileSize={uploadedFile.size}
          stage={stage}
          stageIndex={stageIndex}
        />
      )}

      {status === "error" && error && (
        <ErrorState message={error} fileName={uploadedFile?.name} onRetry={reset} />
      )}

      {displayStatus === "complete" && displayResult && (
        <ResultsView
          result={displayResult}
          onReset={() => {
            reset();
            setHistoryResult(null);
          }}
        />
      )}
    </DashboardShell>
  );
}

export { HISTORY_VIEW_KEY };
