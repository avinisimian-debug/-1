"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { PROCESSING_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProcessingStage } from "../types";
import { SelectedFileBadge } from "./FileUploadZone";

const STAGE_LABELS: Record<ProcessingStage, keyof ReturnType<typeof useLocale>["t"]> = {
  uploading: "procUploading",
  transcribing: "procTranscribing",
  analyzing: "procAnalyzing",
};

interface ProcessingStateProps {
  fileName: string;
  fileSize: number;
  stage: ProcessingStage;
  stageIndex: number;
}

export function ProcessingState({
  fileName,
  fileSize,
  stage,
  stageIndex,
}: ProcessingStateProps) {
  const { t } = useLocale();
  const progress = ((stageIndex + 1) / PROCESSING_STAGES.length) * 100;
  const currentLabel = t[STAGE_LABELS[stage]];

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in-up">
      <div className="glass-card rounded-2xl p-8 sm:p-10">
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

          <div className="mt-8 w-full">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="usage-bar-fill h-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
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
                    isCurrent && "bg-accent-muted text-foreground ring-1 ring-accent/20",
                    isComplete && "text-muted-foreground",
                    !isCurrent && !isComplete && "text-muted-foreground/60",
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
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
