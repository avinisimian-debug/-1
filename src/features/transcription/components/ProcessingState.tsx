"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { PROCESSING_STAGES } from "@/lib/constants";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadProgressInfo } from "../api/transcription.api";
import type { ProcessingStage } from "../types";
import { SelectedFileBadge } from "./FileUploadZone";

const STAGE_LABELS: Record<
  ProcessingStage,
  keyof ReturnType<typeof useLocale>["t"]
> = {
  uploading: "procUploading",
  queued: "procQueued",
  transcribing: "procTranscribing",
  analyzing: "procAnalyzing",
  completed: "procCompleted",
};

interface ProcessingStateProps {
  fileName: string;
  fileSize: number;
  stage: ProcessingStage;
  stageIndex: number;
  uploadProgress?: UploadProgressInfo | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSpeed(bps: number): string {
  if (!bps || bps < 1) return "—";
  const mbps = bps / (1024 * 1024);
  if (mbps >= 0.1) return `${mbps.toFixed(1)} MB/s`;
  return `${(bps / 1024).toFixed(0)} KB/s`;
}

function formatEta(loaded: number, total: number, bps: number): string {
  if (!bps || loaded >= total) return "";
  const remaining = (total - loaded) / bps;
  if (remaining < 60) return `~${Math.ceil(remaining)}s left`;
  return `~${Math.ceil(remaining / 60)}m left`;
}

export function ProcessingState({
  fileName,
  fileSize,
  stage,
  stageIndex,
  uploadProgress,
}: ProcessingStateProps) {
  const { t } = useLocale();
  const currentLabel = t[STAGE_LABELS[stage]];

  const stageBase = (stageIndex / PROCESSING_STAGES.length) * 100;
  const stageSpan = 100 / PROCESSING_STAGES.length;
  const uploadFraction =
    stage === "uploading" && uploadProgress
      ? uploadProgress.percent / 100
      : stage === "uploading"
        ? 0.15
        : 1;
  const progress = Math.min(
    99,
    Math.round(stageBase + stageSpan * uploadFraction),
  );

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in-up">
      <div className="glass-card-premium rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
            <div className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background ring-2 ring-card">
              {stageIndex + 1}
            </div>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {currentLabel}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.procWait}</p>

          <div className="mt-5">
            <SelectedFileBadge name={fileName} size={fileSize} />
          </div>

          <div className="mt-8 w-full space-y-2">
            <Progress value={progress} showLabel size="md" />
            {stage === "uploading" && uploadProgress && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {formatBytes(uploadProgress.loadedBytes)} /{" "}
                  {formatBytes(uploadProgress.totalBytes || fileSize)}
                </span>
                <span className="tabular-nums">
                  {formatSpeed(uploadProgress.bytesPerSecond)}
                  {uploadProgress.bytesPerSecond > 0 && (
                    <>
                      {" · "}
                      {formatEta(
                        uploadProgress.loadedBytes,
                        uploadProgress.totalBytes || fileSize,
                        uploadProgress.bytesPerSecond,
                      )}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <ul className="mt-8 w-full space-y-2 text-start">
            {PROCESSING_STAGES.map((s, index) => {
              const isComplete = index < stageIndex;
              const isCurrent = s.key === stage;
              const label = t[STAGE_LABELS[s.key]];

              return (
                <li
                  key={s.key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200",
                    isCurrent &&
                      "bg-accent-muted text-foreground ring-1 ring-accent/20",
                    isComplete && "text-muted-foreground",
                    !isCurrent && !isComplete && "text-muted-foreground/60",
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border border-border" />
                  )}
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
