"use client";

import dynamic from "next/dynamic";
import { ListChecks, Sparkles, Upload, Wand2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { UploadToolbar } from "@/components/dashboard/UploadToolbar";
import { FileUploadZone } from "@/features/transcription";
import { useLocale } from "@/context/LocaleContext";
import type { OnboardingStepId } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

const TestimonialsCarousel = dynamic(
  () =>
    import("@/components/dashboard/TestimonialsCarousel").then((m) => ({
      default: m.TestimonialsCarousel,
    })),
  {
    loading: () => (
      <div className="skeleton-shimmer h-40 rounded-xl border border-border" />
    ),
  },
);

interface DashboardWorkspaceProps {
  language: string;
  onLanguageChange: (code: string) => void;
  onPromptLanguageUpgrade: () => void;
  usageCount: number;
  usageLimit: number;
  canTranscribe: boolean;
  onFileSelect: (file: File) => void;
  showHero?: boolean;
  onboarding?: {
    show: boolean;
    dismissed: boolean;
    progress: number;
    completed: OnboardingStepId[];
    isStepComplete: (id: OnboardingStepId) => boolean;
    onDismiss: () => void;
    onGoToStep: (id: OnboardingStepId) => void;
    onOpenModal?: () => void;
  };
}

export function DashboardWorkspace({
  language,
  onLanguageChange,
  onPromptLanguageUpgrade,
  usageCount,
  usageLimit,
  canTranscribe,
  onFileSelect,
  showHero = true,
  onboarding,
}: DashboardWorkspaceProps) {
  const { t } = useLocale();

  const features = [
    { icon: Wand2, label: t.authFeature1 },
    { icon: Sparkles, label: t.authFeature2 },
    { icon: ListChecks, label: t.authFeature3 },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 page-enter">
      {onboarding?.show && onboarding.dismissed && (
        <OnboardingChecklist
          variant="card"
          open={false}
          progress={onboarding.progress}
          completed={onboarding.completed}
          isStepComplete={onboarding.isStepComplete}
          onDismiss={onboarding.onDismiss}
          onGoToStep={onboarding.onGoToStep}
          onOpenModal={onboarding.onOpenModal}
        />
      )}

      <section className="glass-card-premium overflow-hidden rounded-2xl">
        {showHero && (
          <div className="relative border-b border-border/60 bg-gradient-to-b from-accent-muted/30 via-card to-card px-6 py-6 sm:px-8 sm:py-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              aria-hidden
            />
            <div className="flex items-start gap-4">
              <Logo size="md" />
              <div className="min-w-0 flex-1 text-start">
                <h2 className="text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                  {t.dashHero}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t.dashHeroDesc}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:border-accent/25 hover:bg-accent-muted/40"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          id="onboarding-upload-zone"
          className={cn("px-4 py-6 sm:px-8 sm:py-8", !showHero && "pt-8")}
        >
          <UploadToolbar
            language={language}
            onLanguageChange={onLanguageChange}
            onPromptLanguageUpgrade={onPromptLanguageUpgrade}
            usageCount={usageCount}
            usageLimit={usageLimit}
            canTranscribe={canTranscribe}
            className="mb-6 sm:mb-8"
          />

          <FileUploadZone
            onFileSelect={onFileSelect}
            disabled={!canTranscribe}
          />
        </div>
      </section>

      <details className="group glass-card rounded-xl">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 marker:content-none">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-muted">
            <Upload className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="flex-1 text-start text-sm font-medium text-foreground">
            {t.dashProTip}
          </span>
          <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-border/60 px-5 pb-4 pt-0 text-start">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.dashProTipDesc}
          </p>
        </div>
      </details>

      <TestimonialsCarousel variant="premium" />
    </div>
  );
}
