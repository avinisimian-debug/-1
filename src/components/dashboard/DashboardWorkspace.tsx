"use client";

import { UploadToolbar } from "@/components/dashboard/UploadToolbar";
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
 * Language / usage sit as quiet meta above the capture zone.
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
          <div className="border-b border-[var(--line-subtle)] px-5 py-4 sm:px-7 sm:py-5">
            <h2 className="text-balance text-lg font-semibold leading-snug tracking-tight text-[var(--ink-primary)] sm:text-xl">
              {t.dashHero}
            </h2>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[var(--ink-secondary)]">
              {t.dashHeroDesc}
            </p>
          </div>
        ) : null}

        <div
          id="onboarding-upload-zone"
          className={cn("px-4 py-4 sm:px-7 sm:py-6", !showHero && "pt-6")}
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
