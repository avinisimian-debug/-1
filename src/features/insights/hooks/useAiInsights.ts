"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TranscriptionResult } from "@/features/transcription/types";
import { updateHistoryAiInsights } from "@/lib/history-store";
import type { AiInsights } from "../types";
import { buildTranscriptPlainText } from "../lib/transcript-text";

interface InsightsApiResponse {
  data: AiInsights | null;
  error: { message: string } | null;
}

export function useAiInsights(result: TranscriptionResult) {
  const [insights, setInsights] = useState<AiInsights | null>(
    result.aiInsights ?? null,
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >(result.aiInsights ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const autoStarted = useRef(false);

  const fetchInsights = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcriptText: buildTranscriptPlainText(result),
          fileName: result.fileName,
        }),
      });

      const payload = (await res.json()) as InsightsApiResponse;

      if (!res.ok || payload.error || !payload.data) {
        throw new Error(payload.error?.message ?? "Failed to generate insights.");
      }

      setInsights(payload.data);
      setStatus("success");
      updateHistoryAiInsights(
        result.fileName,
        result.processedAt,
        payload.data,
      );
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to generate insights.");
    }
  }, [result]);

  useEffect(() => {
    if (insights || autoStarted.current) return;
    autoStarted.current = true;
    void fetchInsights();
  }, [insights, fetchInsights]);

  return {
    insights,
    status,
    error,
    regenerate: fetchInsights,
    isLoading: status === "loading",
  };
}
