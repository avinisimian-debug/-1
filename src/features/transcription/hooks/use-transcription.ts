"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useUsage } from "@/hooks/useUsage";
import { PROCESSING_STAGES } from "@/lib/constants";
import { saveToHistory } from "@/lib/history-store";
import { HISTORY_LIMITS } from "@/lib/plan-features";
import { isFailure } from "@/shared/lib/result";
import { uploadTranscription } from "../api/transcription.api";
import type {
  ProcessingStage,
  TranscriptionResult,
  TranscriptionStatus,
  UploadedFile,
} from "../types";

export function useTranscription() {
  const { plan } = usePlan();
  const { canTranscribe, recordUsage } = useUsage();
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [stage, setStage] = useState<ProcessingStage>("uploading");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"audio" | "video">("audio");
  const audioUrlRef = useRef<string | null>(null);

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioObjectUrl(null);
    setMediaKind("audio");
  }, []);

  useEffect(() => () => revokeAudioUrl(), [revokeAudioUrl]);

  const reset = useCallback(() => {
    revokeAudioUrl();
    setStatus("idle");
    setStage("uploading");
    setUploadedFile(null);
    setResult(null);
    setError(null);
  }, [revokeAudioUrl]);

  const processFile = useCallback(
    (file: File, language = "auto") => {
      if (!canTranscribe) {
        setError("Monthly transcription limit reached. Upgrade to Pro for more.");
        setStatus("error");
        return;
      }

      revokeAudioUrl();
      const objectUrl = URL.createObjectURL(file);
      audioUrlRef.current = objectUrl;
      setAudioObjectUrl(objectUrl);

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setMediaKind(
        file.type.startsWith("video/") || /\.(mp4|m4v)$/i.test(file.name)
          ? "video"
          : "audio",
      );
      setStatus("processing");
      setStage("uploading");
      setResult(null);
      setError(null);

      uploadTranscription({
        file,
        plan,
        language,
        onUploadComplete: () => setStage("transcribing"),
        onHeadersReceived: () => setStage("analyzing"),
      }).then((uploadResult) => {
        if (isFailure(uploadResult)) {
          setError(uploadResult.error.message);
          setStatus("error");
          return;
        }

        setResult(uploadResult.data);
        setStatus("complete");
        recordUsage();
        saveToHistory(uploadResult.data, HISTORY_LIMITS[plan]);
      });
    },
    [plan, canTranscribe, recordUsage, revokeAudioUrl],
  );

  const stageIndex = PROCESSING_STAGES.findIndex((s) => s.key === stage);

  return {
    status,
    stage,
    stageIndex,
    uploadedFile,
    audioObjectUrl,
    mediaKind,
    result,
    error,
    processFile,
    reset,
    canTranscribe,
  };
}
