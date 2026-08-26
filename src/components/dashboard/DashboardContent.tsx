"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { LaunchDashboardCard } from "@/components/launch/LaunchDashboardCard";
import { StazGlassWorkCard } from "@/components/ui/glassmorphism-trust-hero";
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
  const { t, locale } = useLocale();

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
  const he = locale === "he";

  return (
    <DashboardShell
      title={idle ? t.dashTitle : t.resComplete}
      description={idle ? t.dashDesc : t.resExecutive}
    >
      {idle && (
        <div className="mx-auto max-w-2xl space-y-4">
          <LaunchDashboardCard isPro={isPro} />
          <StazGlassWorkCard
            title={
              he
                ? "כל פגישה נסגרת עם מקור"
                : "Every meeting closes with evidence"
            }
            body={
              he
                ? "העלו הקלטה — תקבלו תמצית, החלטות ומשימות עם קישור למשפט בתמלול."
                : "Upload a recording — get a brief, decisions, and tasks linked to transcript lines."
            }
          />
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
          onRetry={() => {
            const src = dash.uploadedFile?.name?.trim();
            if (src && /^https?:\/\//i.test(src)) {
              dash.processUrl(src);
              return;
            }
            dash.resetAll();
          }}
          onReplaceSource={dash.resetAll}
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
