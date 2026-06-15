"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { PROCESSING_STAGES } from "@/lib/constants";
import type { ProcessingStage } from "@/lib/types";
import { SelectedFileBadge } from "./FileUploadZone";
import { cn } from "@/lib/utils";

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
    <div className="mx-auto w-full max-w-2xl">
      <div className="gradient-border glass-card rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-amber-500/20 ring-1 ring-white/10">
              <Loader2 className="h-9 w-9 animate-spin text-amber-400" />
            </div>
            <div className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full bg-black ring-2 ring-violet-500/30">
              <span className="text-xs font-bold text-amber-400">
                {stageIndex + 1}/{PROCESSING_STAGES.length}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
            {currentLabel}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">{t.procWait}</p>

          <div className="mt-5">
            <SelectedFileBadge name={fileName} size={fileSize} />
          </div>

          <div className="mt-8 w-full">
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-amber-400 transition-all duration-700 ease-out"
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                    isCurrent && "bg-amber-500/5 text-amber-200 ring-1 ring-amber-500/20",
                    isComplete && "text-zinc-400",
                    !isCurrent && !isComplete && "text-zinc-600",
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-400" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border border-zinc-700" />
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
