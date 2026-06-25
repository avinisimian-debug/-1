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

export type DashboardPhase = TranscriptionStatus;

export function useDashboardController() {
  const { promptUpgrade } = useFeatureGate();
  const { count, limit, canTranscribe } = useUsage();
  const [language, setLanguage] = useState("auto");
  const [historyResult, setHistoryResult] = useState<TranscriptionResult | null>(null);

  const transcription = useTranscription();

  useEffect(() => {
    const stored = sessionStorage.getItem(HISTORY_VIEW_KEY);
    if (!stored) return;
    try {
      setHistoryResult(JSON.parse(stored) as TranscriptionResult);
      sessionStorage.removeItem(HISTORY_VIEW_KEY);
    } catch {
      sessionStorage.removeItem(HISTORY_VIEW_KEY);
    }
  }, []);

  const displayResult = transcription.result ?? historyResult;
  const phase: DashboardPhase = displayResult ? "complete" : transcription.status;

  const onboarding = useOnboarding({
    transcriptionStatus: phase,
    usageCount: count,
  });

  const showCompactHero = onboarding.showOnboarding && !onboarding.dismissed;

  const processFile = useCallback(
    (file: File) => {
      transcription.processFile(file, language);
    },
    [transcription, language],
  );

  const resetAll = useCallback(() => {
    transcription.reset();
    setHistoryResult(null);
  }, [transcription]);

  return {
    phase,
    language,
    setLanguage,
    displayResult,
    uploadedFile: transcription.uploadedFile,
    audioSrc: transcription.audioObjectUrl ?? undefined,
    mediaKind: transcription.mediaKind,
    stage: transcription.stage,
    stageIndex: transcription.stageIndex,
    error: transcription.error,
    canTranscribe,
    usageCount: count,
    usageLimit: limit,
    showCompactHero,
    onboarding,
    processFile,
    resetAll,
    promptLanguageUpgrade: () => promptUpgrade("languageSelect"),
  };
}
