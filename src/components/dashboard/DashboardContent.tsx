"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import {
  ErrorState,
  ProcessingState,
  ResultsView,
} from "@/features/transcription";
import { useLocale } from "@/context/LocaleContext";
import { useDashboardController } from "@/hooks/useDashboardController";

export function DashboardContent() {
  const { t } = useLocale();
  const dash = useDashboardController();

  return (
    <DashboardShell title={t.dashTitle} description={t.dashDesc}>
      {dash.onboarding.showOnboarding && (
        <OnboardingChecklist
          open={dash.onboarding.modalOpen}
          progress={dash.onboarding.progress}
          completed={dash.onboarding.completed}
          isStepComplete={dash.onboarding.isStepComplete}
          onDismiss={dash.onboarding.dismiss}
          onGoToStep={dash.onboarding.goToStep}
        />
      )}

      {dash.phase === "idle" && (
        <DashboardWorkspace
          language={dash.language}
          onLanguageChange={dash.setLanguage}
          onPromptLanguageUpgrade={dash.promptLanguageUpgrade}
          usageCount={dash.usageCount}
          usageLimit={dash.usageLimit}
          canTranscribe={dash.canTranscribe}
          onFileSelect={dash.processFile}
          showHero={!dash.showCompactHero}
          onboarding={{
            show: dash.onboarding.showOnboarding,
            dismissed: dash.onboarding.dismissed,
            progress: dash.onboarding.progress,
            completed: dash.onboarding.completed,
            isStepComplete: dash.onboarding.isStepComplete,
            onDismiss: dash.onboarding.dismiss,
            onGoToStep: dash.onboarding.goToStep,
            onOpenModal: dash.onboarding.openModal,
          }}
        />
      )}

      {dash.phase === "processing" && dash.uploadedFile && (
        <ProcessingState
          fileName={dash.uploadedFile.name}
          fileSize={dash.uploadedFile.size}
          stage={dash.stage}
          stageIndex={dash.stageIndex}
        />
      )}

      {dash.phase === "error" && dash.error && (
        <ErrorState
          message={dash.error}
          fileName={dash.uploadedFile?.name}
          onRetry={dash.resetAll}
        />
      )}

      {dash.phase === "complete" && dash.displayResult && (
        <ResultsView
          result={dash.displayResult}
          mediaSrc={dash.audioSrc}
          mediaKind={dash.mediaKind}
          onReset={dash.resetAll}
        />
      )}
    </DashboardShell>
  );
}
