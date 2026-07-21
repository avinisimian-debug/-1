"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { DashboardInspector } from "@/components/dashboard/DashboardInspector";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import {
  ErrorState,
  ProcessingState,
  ResultsView,
} from "@/features/transcription";
import { useLocale } from "@/context/LocaleContext";
import { useDashboardController } from "@/hooks/useDashboardController";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";

export function DashboardContent() {
  const { t } = useLocale();
  const dash = useDashboardController();
  const router = useRouter();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("staz-upgrade-intent") === "1") {
        sessionStorage.removeItem("staz-upgrade-intent");
        router.replace(SETTINGS_UPGRADE_PATH);
      }
    } catch {
      /* ignore */
    }
  }, [router]);

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
        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
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
          </div>
          <DashboardInspector />
        </div>
      )}

      {dash.phase === "processing" && dash.uploadedFile && (
        <ProcessingState
          fileName={dash.uploadedFile.name}
          fileSize={dash.uploadedFile.size}
          stage={dash.stage}
          stageIndex={dash.stageIndex}
          uploadProgress={dash.uploadProgress}
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
