"use client";

import { useEffect, useMemo, useState } from "react";
import { PremiumWorkspace } from "@/features/staz-workspace";
import type { TranscriptionResult } from "../types";

interface ResultsViewProps {
  result: TranscriptionResult;
  mediaSrc?: string;
  mediaKind?: "audio" | "video";
  /** @deprecated Use mediaSrc */
  audioSrc?: string;
  onReset: () => void;
}

/**
 * Wave 1 cutover: premium 3-pane workspace (assistant-first).
 * Legacy tabbed results retired in favor of AI rail + timeline.
 */
export function ResultsView({
  result,
  mediaSrc,
  mediaKind = "audio",
  audioSrc,
  onReset,
}: ResultsViewProps) {
  const resolvedMediaSrc = mediaSrc ?? audioSrc;
  const [transcript, setTranscript] = useState(result.transcript);

  useEffect(() => {
    setTranscript(result.transcript);
  }, [result.fileName, result.processedAt, result.transcript]);

  const displayResult = useMemo(
    () => ({ ...result, transcript }),
    [result, transcript],
  );

  return (
    <PremiumWorkspace
      result={displayResult}
      mediaSrc={resolvedMediaSrc}
      mediaKind={mediaKind}
      onReset={onReset}
      className="-mx-2 sm:-mx-4 lg:-mx-6"
    />
  );
}
