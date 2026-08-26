"use client";

import { UploadToolbar } from "@/components/dashboard/UploadToolbar";
import { StazMark } from "@/components/brand/Logo";
import { FileUploadZone } from "@/features/transcription";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { useLocale } from "@/context/LocaleContext";
import type { OnboardingStepId } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

interface DashboardWorkspaceProps {
  language: string;
  onLanguageChange: (code: string) => void;
  onPromptLanguageUpgrade: () => void;
  usageCount: number;
  usageLimit: number;
  canTranscribe: boolean;
  onFileSelect: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
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

/**
 * Idle workbench: one job — drop a meeting.
 * Visual craft aligned with the landing product surface.
 */
export function DashboardWorkspace({
  language,
  onLanguageChange,
  onPromptLanguageUpgrade,
  usageCount,
  usageLimit,
  canTranscribe,
  onFileSelect,
  onUrlSubmit,
  showHero = true,
  onboarding,
}: DashboardWorkspaceProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 page-enter">
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

      <section className="staz-surface-card staz-surface-card--static overflow-hidden">
        {showHero ? (
          <div className="relative border-b border-[var(--line-subtle)] px-5 py-5 sm:px-8 sm:py-7">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_0%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_65%)]"
              aria-hidden
            />
            <div className="relative flex items-center gap-2">
              <StazMark size={22} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                STAZ
              </p>
            </div>
            <h2 className="relative mt-2 text-balance font-brand text-xl font-semibold leading-snug tracking-tight text-[var(--ink-primary)] sm:text-2xl">
              {t.dashHero}
            </h2>
            <p className="relative mt-2 max-w-lg text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-[0.95rem]">
              {t.dashHeroDesc}
            </p>
          </div>
        ) : null}

        <div
          id="onboarding-upload-zone"
          className={cn("px-4 py-5 sm:px-8 sm:py-7", !showHero && "pt-6")}
        >
          <UploadToolbar
            language={language}
            onLanguageChange={onLanguageChange}
            onPromptLanguageUpgrade={onPromptLanguageUpgrade}
            usageCount={usageCount}
            usageLimit={usageLimit}
            canTranscribe={canTranscribe}
            className="mb-5"
          />

          <FileUploadZone
            onFileSelect={onFileSelect}
            onUrlSubmit={onUrlSubmit}
            disabled={!canTranscribe}
          />
        </div>
      </section>
    </div>
  );
}
