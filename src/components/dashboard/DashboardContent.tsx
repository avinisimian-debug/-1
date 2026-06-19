"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ListChecks, Sparkles, Upload, Wand2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { TestimonialsCarousel } from "@/components/dashboard/TestimonialsCarousel";
import {
  ErrorState,
  FileUploadZone,
  HISTORY_VIEW_KEY,
  ProcessingState,
  ResultsView,
  useTranscription,
  type TranscriptionResult,
} from "@/features/transcription";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUsage } from "@/hooks/useUsage";
import { hasFeature } from "@/lib/plan-features";

const LANGUAGES = [
  { code: "auto", labelKey: "langAuto" as const },
  { code: "he", labelKey: "langHe" as const },
  { code: "en", labelKey: "langEn" as const },
  { code: "ar", labelKey: "langAr" as const },
  { code: "es", labelKey: "langEs" as const },
  { code: "fr", labelKey: "langFr" as const },
  { code: "ru", labelKey: "langRu" as const },
];

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
        <div className="mx-auto max-w-4xl space-y-6">
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

          <section className="glass-card overflow-hidden rounded-xl">
            <div className="border-b border-border bg-gradient-to-b from-card to-muted/30 px-6 py-8 sm:px-10">
              <div className="flex items-start gap-4">
                <Logo size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {t.dashHero}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t.dashHeroDesc}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {features.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div id="onboarding-upload-zone" className="px-4 py-6 sm:px-8 sm:py-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t.dashNewTranscription}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.uploadBrowse}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {hasFeature(plan, "languageSelect") ? (
                    <label className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-muted-foreground shadow-xs focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
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
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-xs text-muted-foreground shadow-xs transition-colors hover:border-accent/30 hover:bg-accent-muted/50"
                    >
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.langAuto}
                      <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Pro
                      </span>
                    </button>
                  )}
                  <span
                    className={
                      isPro
                        ? "rounded-md border border-accent/25 bg-accent-muted px-3 py-1 text-[11px] font-medium text-accent"
                        : "rounded-md border border-border bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
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
                  <Link href="/settings#upgrade" className="font-medium underline">
                    {t.planUpgrade}
                  </Link>
                </div>
              )}

              <p className="mb-4 text-center text-[11px] text-muted-foreground">
                {t.dashUsageRemaining}: {limit - count} / {limit}
              </p>

              <FileUploadZone
                onFileSelect={(f) => processFile(f, language)}
                disabled={!canTranscribe}
              />
            </div>
          </section>

          <div className="glass-card flex items-start gap-3 rounded-xl px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-muted">
              <Upload className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.dashProTip}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
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
