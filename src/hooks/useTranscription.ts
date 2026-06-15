"use client";

import { useCallback, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { HISTORY_LIMITS } from "@/lib/plan-features";
import { saveToHistory } from "@/lib/history-store";
import { PROCESSING_STAGES } from "@/lib/constants";
import { useUsage } from "@/hooks/useUsage";
import type {
  ProcessingStage,
  TranscriptionResult,
  TranscriptionStatus,
  UploadedFile,
} from "@/lib/types";

export function useTranscription() {
  const { plan } = usePlan();
  const { canTranscribe, recordUsage } = useUsage();
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [stage, setStage] = useState<ProcessingStage>("uploading");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setStage("uploading");
    setUploadedFile(null);
    setResult(null);
    setError(null);
  }, []);

  const processFile = useCallback(
    (file: File, language = "auto") => {
      if (!canTranscribe) {
        setError("Monthly transcription limit reached. Upgrade to Pro for more.");
        setStatus("error");
        return;
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setStatus("processing");
      setStage("uploading");
      setResult(null);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("plan", plan);
      if (plan === "pro" && language !== "auto") {
        formData.append("language", language);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/transcribe");

      xhr.upload.addEventListener("load", () => {
        setStage("transcribing");
      });

      xhr.addEventListener("readystatechange", () => {
        if (
          xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED &&
          xhr.status === 200
        ) {
          setStage("analyzing");
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText) as TranscriptionResult;
            setResult(data);
            setStatus("complete");
            recordUsage();
            saveToHistory(data, HISTORY_LIMITS[plan]);
          } catch {
            setError("Failed to parse the server response.");
            setStatus("error");
          }
          return;
        }

        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          setError(body.error ?? "Transcription failed. Please try again.");
        } catch {
          setError("Transcription failed. Please try again.");
        }
        setStatus("error");
      });

      xhr.addEventListener("error", () => {
        setError("Network error. Check your connection and try again.");
        setStatus("error");
      });

      xhr.send(formData);
    },
    [plan, canTranscribe, recordUsage],
  );

  const stageIndex = PROCESSING_STAGES.findIndex((s) => s.key === stage);

  return {
    status,
    stage,
    stageIndex,
    uploadedFile,
    result,
    error,
    processFile,
    reset,
    canTranscribe,
  };
}
