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
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useDashboardController } from "@/hooks/useDashboardController";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";

export function DashboardContent() {
  const dash = useDashboardController();
  const router = useRouter();
  const { isPro } = usePlan();
  const { t } = useLocale();

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

  const idle = dash.phase === "idle";

  return (
    <DashboardShell
      title={idle ? t.dashTitle : t.resComplete}
      description={idle ? t.dashDesc : t.resExecutive}
    >
      {idle && (
        <div className="mx-auto max-w-2xl">
          <LaunchDashboardCard isPro={isPro} />
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
