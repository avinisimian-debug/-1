"use client";

import { useEffect, useState } from "react";
import type { ProcessingStage } from "@/features/transcription/types";
import { cn } from "@/lib/utils";

const STAGE_LABELS = [
  "Uploading",
  "Listening",
  "Understanding",
  "Organizing decisions",
] as const;

const STAGE_LABELS_HE = [
  "\u05de\u05e2\u05dc\u05d9\u05dd",
  "\u05de\u05e7\u05e9\u05d9\u05d1\u05d9\u05dd",
  "\u05de\u05d1\u05d9\u05e0\u05d9\u05dd",
  "\u05de\u05d0\u05e8\u05d2\u05e0\u05d9\u05dd \u05d4\u05d7\u05dc\u05d8\u05d5\u05ea",
] as const;

interface ProcessingTheatreProps {
  fileName?: string;
  stage?: ProcessingStage;
  className?: string;
}

function stageIndex(stage?: ProcessingStage): number {
  switch (stage) {
    case "uploading":
    case "queued":
      return 0;
    case "transcribing":
      return 1;
    case "analyzing":
      return 2;
    case "completed":
      return 3;
    default:
      return 1;
  }
}

export function ProcessingTheatre({
  fileName,
  stage,
  className,
}: ProcessingTheatreProps) {
  const active = stageIndex(stage);
  const [tick, setTick] = useState(0);
  const title = "Staz " + "\u05de\u05e7\u05e9\u05d9\u05d1";
  const caption =
    "\u05d0\u05e4\u05e9\u05e8 \u05dc\u05d4\u05de\u05e9\u05d9\u05da \u05dc\u05e2\u05d1\u05d5\u05d3 \u2014 \u05e0\u05e2\u05d3\u05db\u05df \u05db\u05e9\u05d9\u05d4\u05d9\u05d4 \u05de\u05d5\u05db\u05df";

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "lat-stage flex min-h-[420px] flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
        className,
      )}
    >
      <p className="font-brand text-3xl tracking-tight text-[#ededea]">STAZ</p>
      <h2 className="mt-4 text-xl font-semibold text-[#ededea]">{title}</h2>
      {fileName ? (
        <p className="mt-2 max-w-sm truncate text-sm text-[#a8aea8]">{fileName}</p>
      ) : null}

      <ol className="mt-10 w-full max-w-xs space-y-3 text-start">
        {STAGE_LABELS_HE.map((label, i) => {
          const done = i < active || (i === active && stage === "completed");
          const current = i === active && stage !== "completed";
          return (
            <li key={STAGE_LABELS[i]} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-bold",
                  done && "bg-[#3d9b86] text-[#0c0e0d]",
                  current && "bg-[#c4a35a] text-[#0c0e0d]",
                  !done && !current && "bg-white/10 text-[#6f7670]",
                )}
              >
                {done ? "OK" : String(i + 1)}
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

      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[var(--signal)] to-[#3d9b86] transition-all duration-500"
          style={{
            width: `${Math.min(95, 20 + active * 22 + (tick % 3) * 2)}%`,
          }}
        />
      </div>
      <p className="mt-4 text-xs text-[#6f7670]">{caption}</p>
    </div>
  );
}
