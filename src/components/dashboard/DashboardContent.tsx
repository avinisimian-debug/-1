"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { LaunchDashboardCard } from "@/components/launch/LaunchDashboardCard";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
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
      contentClassName={idle ? "!p-0 sm:!p-0 lg:!p-0" : undefined}
    >
      {idle && (
        <div className="space-y-0">
          <div className="overflow-hidden border-b border-white/10 bg-zinc-950">
            <div className="max-h-[min(52vh,420px)] overflow-hidden">
              <HeroSection />
            </div>
          </div>
          <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
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
        </div>
      )}

      {dash.phase === "processing" && dash.uploadedFile && (
        <div className="p-4 sm:p-6 lg:p-8">
          <ProcessingState
            fileName={dash.uploadedFile.name}
            fileSize={dash.uploadedFile.size}
            stage={dash.stage}
            stageIndex={dash.stageIndex}
            uploadProgress={dash.uploadProgress}
            onCancel={dash.resetAll}
          />
        </div>
      )}

      {dash.phase === "error" && dash.error && (
        <div className="p-4 sm:p-6 lg:p-8">
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
        </div>
      )}

      {dash.phase === "complete" && dash.displayResult && (
        <div className="p-4 sm:p-6 lg:p-8">
          <ResultsView
            result={dash.displayResult}
            mediaSrc={dash.audioSrc}
            mediaKind={dash.mediaKind}
            onReset={dash.resetAll}
          />
        </div>
      )}
    </DashboardShell>
  );
}
