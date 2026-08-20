"use client";

import { useCallback, useEffect, useState } from "react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useUsage } from "@/hooks/useUsage";
import {
  HISTORY_VIEW_KEY,
  useTranscription,
  type TranscriptionResult,
  type TranscriptionStatus,
} from "@/features/transcription";
import { markProcessedFirstFile } from "@/lib/user-milestones";

export type DashboardPhase = TranscriptionStatus;

export function useDashboardController() {
  const { promptUpgrade } = useFeatureGate();
  const { count, limit, canTranscribe } = useUsage();
  const [language, setLanguage] = useState("auto");
  const [historyResult, setHistoryResult] = useState<TranscriptionResult | null>(
    null,
  );
  const [historyMedia, setHistoryMedia] = useState<string | undefined>();
  const [historyMediaKind, setHistoryMediaKind] = useState<"audio" | "video">(
    "audio",
  );

  const transcription = useTranscription();

  useEffect(() => {
    const loadFromStorage = () => {
      const stored = sessionStorage.getItem(HISTORY_VIEW_KEY);
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as
          | TranscriptionResult
          | {
              result: TranscriptionResult;
              mediaSrc?: string;
              mediaKind?: "audio" | "video";
            };
        if ("result" in parsed && parsed.result) {
          setHistoryResult(parsed.result);
          setHistoryMedia(parsed.mediaSrc);
          setHistoryMediaKind(parsed.mediaKind ?? "audio");
        } else {
          setHistoryResult(parsed as TranscriptionResult);
          setHistoryMedia(undefined);
        }
        sessionStorage.removeItem(HISTORY_VIEW_KEY);
      } catch {
        sessionStorage.removeItem(HISTORY_VIEW_KEY);
      }
    };

    loadFromStorage();
    window.addEventListener("stazai:open-history-result", loadFromStorage);
    return () =>
      window.removeEventListener("stazai:open-history-result", loadFromStorage);
  }, []);

  // Hide demo after first successful real transcription (not demo workspace)
  useEffect(() => {
    const result = transcription.result;
    if (!result) return;
    if (
      result.fileName.includes("Staz Demo") ||
      result.fileName.includes("Demo")
    ) {
      return;
    }
    markProcessedFirstFile();
  }, [transcription.result]);

  const displayResult = transcription.result ?? historyResult;
  const phase: DashboardPhase = displayResult
    ? "complete"
    : transcription.status;

  const onboarding = useOnboarding({
    transcriptionStatus: phase,
    usageCount: count,
  });

  const showCompactHero = onboarding.showOnboarding && !onboarding.dismissed;

  const processFile = useCallback(
    (file: File) => {
      if (!canTranscribe) {
        promptUpgrade("meetingQuota");
        return;
      }
      markProcessedFirstFile();
      transcription.processFile(file, language);
    },
    [transcription, language, canTranscribe, promptUpgrade],
  );

  const processUrl = useCallback(
    (url: string) => {
      if (!canTranscribe) {
        promptUpgrade("meetingQuota");
        return;
      }
      markProcessedFirstFile();
      transcription.processUrl(url, language);
    },
    [transcription, language, canTranscribe, promptUpgrade],
  );

  const resetAll = useCallback(() => {
    transcription.reset();
    setHistoryResult(null);
    setHistoryMedia(undefined);
  }, [transcription]);

  return {
    phase,
    language,
    setLanguage,
    displayResult,
    uploadedFile: transcription.uploadedFile,
    audioSrc: transcription.audioObjectUrl ?? historyMedia,
    mediaKind: historyResult ? historyMediaKind : transcription.mediaKind,
    stage: transcription.stage,
    stageIndex: transcription.stageIndex,
    uploadProgress: transcription.uploadProgress,
    error: transcription.error,
    canTranscribe,
    usageCount: count,
    usageLimit: limit,
    showCompactHero,
    onboarding,
    processFile,
    processUrl,
    resetAll,
    promptLanguageUpgrade: () => promptUpgrade("languageSelect"),
  };
}
