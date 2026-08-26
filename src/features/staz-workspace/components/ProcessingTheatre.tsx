"use client";

import type { ProcessingStage } from "@/features/transcription/types";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const STAGE_LABELS_HE = [
  "בודקים את הקישור / מעלים",
  "מכינים את המקור לעיבוד",
  "יוצרים תמלול",
  "מנתחים את הפגישה",
  "הפגישה מוכנה",
] as const;

interface ProcessingTheatreProps {
  fileName?: string;
  stage?: ProcessingStage;
  className?: string;
  onCancel?: () => void;
}

function stageIndex(stage?: ProcessingStage): number {
  switch (stage) {
    case "uploading":
      return 0;
    case "queued":
      return 1;
    case "transcribing":
      return 2;
    case "analyzing":
      return 3;
    case "completed":
      return 4;
    default:
      return 1;
  }
}

export function ProcessingTheatre({
  fileName,
  stage,
  className,
  onCancel,
}: ProcessingTheatreProps) {
  const active = stageIndex(stage);

  return (
    <div
      className={cn(
        "lat-stage flex min-h-[420px] flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
        className,
      )}
    >
      <Logo size="lg" tone="dark" href={null} />
      <h2 className="mt-4 text-xl font-semibold text-[#ededea]">Staz מקשיב</h2>
      {fileName ? (
        <p className="mt-2 max-w-sm truncate text-sm text-[#a8aea8]">{fileName}</p>
      ) : null}

      <ol className="mt-10 w-full max-w-sm space-y-3 text-start">
        {STAGE_LABELS_HE.map((label, i) => {
          const done = i < active || (i === active && stage === "completed");
          const current = i === active && stage !== "completed";
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-bold",
                  done && "bg-[#3d9b86] text-[#0c0e0d]",
                  current && "bg-[#c4a35a] text-[#0c0e0d]",
                  !done && !current && "bg-white/10 text-[#6f7670]",
                )}
              >
                {done ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  current ? "font-semibold text-[#ededea]" : "text-[#a8aea8]",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 max-w-xs text-xs text-[#6f7670]">
        השלב המודגש הוא השלב האמיתי בתהליך. אין אחוז מדויק מהשרת.
      </p>
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="lat-btn-ghost mt-6 text-sm text-[#a8aea8]"
        >
          ביטול
        </button>
      ) : null}
    </div>
  );
}
