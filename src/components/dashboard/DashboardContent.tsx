"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ListChecks, Sparkles, Upload, Wand2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { TestimonialsCarousel } from "@/components/dashboard/TestimonialsCarousel";
import { ResultsView } from "@/components/results/ResultsView";
import { ErrorState } from "@/components/upload/ErrorState";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { ProcessingState } from "@/components/upload/ProcessingState";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useTranscription } from "@/hooks/useTranscription";
import { useOnboarding } from "@/hooks/useOnboarding";
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

const HISTORY_VIEW_KEY = "stazai-view-result";

export function DashboardContent() {
  const { t } = useLocale();
  const { isPro, limits, plan } = usePlan();
  const { promptUpgrade } = useFeatureGate();
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

  const onboarding = useOnboarding({
    transcriptionStatus: displayStatus,
    usageCount: count,
  });

  const features = [
    { icon: Wand2, label: t.authFeature1 },
    { icon: Sparkles, label: t.authFeature2 },
    { icon: ListChecks, label: t.authFeature3 },
  ];

  return (
    <DashboardShell title={t.dashTitle} description={t.dashDesc}>
      {onboarding.showOnboarding && (
        <OnboardingChecklist
          open={onboarding.modalOpen}
          progress={onboarding.progress}
          completed={onboarding.completed}
          isStepComplete={onboarding.isStepComplete}
          onDismiss={onboarding.dismiss}
          onGoToStep={onboarding.goToStep}
        />
      )}

      {displayStatus === "idle" && (
        <div className="mx-auto max-w-3xl space-y-6">
          {onboarding.showOnboarding && onboarding.dismissed && (
            <OnboardingChecklist
              variant="card"
              open={false}
              progress={onboarding.progress}
              completed={onboarding.completed}
              isStepComplete={onboarding.isStepComplete}
              onDismiss={onboarding.dismiss}
              onGoToStep={onboarding.goToStep}
              onOpenModal={onboarding.openModal}
            />
          )}

          <section className="glass-card overflow-hidden rounded-lg">
            <div className="border-b border-zinc-200 bg-white px-6 py-8 sm:px-10">
              <div className="flex items-start gap-4">
                <Logo size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
                    {t.dashHero}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 sm:text-base">
                    {t.dashHeroDesc}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {features.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600"
                  >
                    <Icon className="h-3.5 w-3.5 text-indigo-600" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div id="onboarding-upload-zone" className="px-4 py-6 sm:px-8 sm:py-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    {t.dashNewTranscription}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.uploadBrowse}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {hasFeature(plan, "languageSelect") ? (
                    <label className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-600"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {t[l.labelKey]}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => promptUpgrade("languageSelect")}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                    >
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                      {t.langAuto}
                      <span className="rounded bg-zinc-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                        Pro
                      </span>
                    </button>
                  )}
                  <span
                    className={
                      isPro
                        ? "rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700"
                        : "rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-600"
                    }
                  >
                    {isPro
                      ? `Pro · ${limits.maxFileSizeLabel}`
                      : `Free · ${limits.maxFileSizeLabel}`}
                  </span>
                </div>
              </div>

              {!canTranscribe && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {t.dashUsageLimit}{" "}
                  <Link href="/settings" className="font-medium underline">
                    {t.planUpgrade}
                  </Link>
                </div>
              )}

              <p className="mb-4 text-center text-[11px] text-zinc-400">
                {t.dashUsageRemaining}: {limit - count} / {limit}
              </p>

              <FileUploadZone
                onFileSelect={(f) => processFile(f, language)}
                disabled={!canTranscribe}
              />
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-50">
              <Upload className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {t.dashProTip}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {t.dashProTipDesc}
              </p>
            </div>
          </div>

          <TestimonialsCarousel variant="premium" />
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
