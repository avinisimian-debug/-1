"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { LaunchDashboardCard } from "@/components/launch/LaunchDashboardCard";
import {
  ErrorState,
  ProcessingState,
  ResultsView,
} from "@/features/transcription";
import { usePlan } from "@/context/PlanContext";
import { useDashboardController } from "@/hooks/useDashboardController";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";

export function DashboardContent() {
  const dash = useDashboardController();
  const router = useRouter();
  const { isPro } = usePlan();

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
    <DashboardShell
      title="סגירת פגישה"
      description="העלו הקלטה — קבלו תמצית, החלטות ומשימות."
    >
      {dash.phase === "idle" && (
        <div className="mx-auto max-w-3xl">
          <LaunchDashboardCard isPro={isPro} />
          <p className="mb-4 text-sm text-muted-foreground">
            תנו ל-Staz פגישה. קבלו בהירות.
          </p>
          <DashboardWorkspace
            language={dash.language}
            onLanguageChange={dash.setLanguage}
            onPromptLanguageUpgrade={dash.promptLanguageUpgrade}
            usageCount={dash.usageCount}
            usageLimit={dash.usageLimit}
            canTranscribe={dash.canTranscribe}
            onFileSelect={dash.processFile}
            onUrlSubmit={dash.processUrl}
            showHero
          />
        </div>
      )}

      {dash.phase === "processing" && dash.uploadedFile && (
        <ProcessingState
          fileName={dash.uploadedFile.name}
          fileSize={dash.uploadedFile.size}
          stage={dash.stage}
          stageIndex={dash.stageIndex}
          uploadProgress={dash.uploadProgress}
          onCancel={dash.resetAll}
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
