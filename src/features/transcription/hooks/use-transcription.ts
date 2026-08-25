"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlan } from "@/context/PlanContext";
import { useToast } from "@/context/ToastContext";
import { useUsage } from "@/hooks/useUsage";
import { PROCESSING_STAGES } from "@/lib/constants";
import { saveToHistory } from "@/lib/history-store";
import { HISTORY_LIMITS } from "@/lib/plan-features";
import { isFailure } from "@/shared/lib/result";
import {
  resumeActiveYouTubeJob,
  transcribeFromUrl,
  uploadTranscription,
  type UploadProgressInfo,
} from "../api/transcription.api";
import type {
  ProcessingStage,
  TranscriptionResult,
  TranscriptionStatus,
  UploadedFile,
} from "../types";

export function useTranscription() {
  const { data: session } = useSession();
  const { plan } = usePlan();
  const { toast } = useToast();
  const { canTranscribe, recordUsage } = useUsage();
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [stage, setStage] = useState<ProcessingStage>("uploading");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressInfo | null>(
    null,
  );
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"audio" | "video">("audio");
  const audioUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioObjectUrl(null);
    setMediaKind("audio");
  }, []);

  useEffect(() => () => {
    abortRef.current?.abort();
    revokeAudioUrl();
  }, [revokeAudioUrl]);

  // Resume YouTube job after refresh / reopen while processing.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    void (async () => {
      const resumed = await resumeActiveYouTubeJob({
        signal: controller.signal,
        onJobStage: (jobStage) => {
          if (cancelled || jobStage === "completed") return;
          setStatus("processing");
          setStage(jobStage);
        },
        onHeadersReceived: () => {
          if (!cancelled) setStage("analyzing");
        },
      });
      if (cancelled || !resumed) return;
      if (isFailure(resumed)) {
        if (resumed.error.message === "Upload cancelled.") return;
        setError(resumed.error.message);
        setStatus("error");
        return;
      }
      setResult(resumed.data);
      setStatus("complete");
      setStage("completed");
      setUploadedFile({
        name: resumed.data.fileName,
        size: 0,
        type: "text/uri-list",
      });
      recordUsage();
      saveToHistory(resumed.data, HISTORY_LIMITS[plan]);
    })();
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resume once on mount
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    revokeAudioUrl();
    setStatus("idle");
    setStage("uploading");
    setUploadedFile(null);
    setResult(null);
    setError(null);
    setUploadProgress(null);
  }, [revokeAudioUrl]);

  const processFile = useCallback(
    (file: File, language = "auto") => {
      if (!canTranscribe) {
        const message =
          "QUOTA: נשמרו מספיק פגישות החודש. שמרו את ספריית הפגישות עם Staz Pro.";
        setError(message);
        setStatus("error");
        toast({ title: message, variant: "warning" });
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

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
        file.type.startsWith("video/") ||
          /\.(mp4|m4v|mov|webm|mkv|avi)$/i.test(file.name)
          ? "video"
          : "audio",
      );
      setStatus("processing");
      setStage("uploading");
      setResult(null);
      setError(null);
      setUploadProgress({
        percent: 0,
        loadedBytes: 0,
        totalBytes: file.size,
        bytesPerSecond: 0,
      });

      uploadTranscription({
        file,
        plan,
        userEmail: session?.user?.email ?? null,
        language,
        signal: controller.signal,
        onUploadProgress: (info) => {
          setUploadProgress(info);
          setStage("uploading");
        },
        onUploadComplete: () => {
          setUploadProgress((prev) =>
            prev
              ? {
                  ...prev,
                  percent: 100,
                  loadedBytes: prev.totalBytes,
                }
              : prev,
          );
          // Direct sync path: upload done → STT in flight.
          // Blob/job path immediately overrides via onJobStage("queued").
          setStage("transcribing");
        },
        onJobStage: (jobStage) => {
          if (jobStage === "completed") return;
          setStage(jobStage);
        },
        onHeadersReceived: () => setStage("analyzing"),
      }).then((uploadResult) => {
        if (abortRef.current !== controller) return;

        if (isFailure(uploadResult)) {
          const message = uploadResult.error.message;
          if (message === "Upload cancelled.") {
            setStatus("idle");
            setError(null);
            setUploadProgress(null);
            return;
          }
          setError(message);
          setStatus("error");
          toast({
            title: "העיבוד נכשל",
            description: message,
            variant: "error",
          });
          return;
        }

        setResult(uploadResult.data);
        setStatus("complete");
        setUploadProgress(null);
        recordUsage();
        saveToHistory(uploadResult.data, HISTORY_LIMITS[plan]);
        toast({
          title: "הסגירה מוכנה",
          description: uploadResult.data.fileName,
          variant: "success",
        });
      });
    },
    [
      plan,
      canTranscribe,
      recordUsage,
      revokeAudioUrl,
      session?.user?.email,
      toast,
    ],
  );

  const processUrl = useCallback(
    (url: string, language = "auto") => {
      if (!canTranscribe) {
        const message =
          "QUOTA: נשמרו מספיק פגישות החודש. שמרו את ספריית הפגישות עם Staz Pro.";
        setError(message);
        setStatus("error");
        toast({ title: message, variant: "warning" });
        return;
      }

      const trimmed = url.trim();
      if (!trimmed) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      revokeAudioUrl();
      setUploadedFile({
        name: trimmed,
        size: 0,
        type: "text/uri-list",
      });
      setMediaKind("audio");
      setStatus("processing");
      setStage("uploading");
      setResult(null);
      setError(null);
      setUploadProgress({
        percent: 8,
        loadedBytes: 8,
        totalBytes: 100,
        bytesPerSecond: 0,
      });

      // Fake progressive stages while the sync from-url API runs
      // (validating → preparing → STT → analysis).
      const stageTimers = [
        window.setTimeout(() => {
          if (abortRef.current === controller) setStage("queued");
        }, 1200),
        window.setTimeout(() => {
          if (abortRef.current === controller) setStage("transcribing");
        }, 4000),
      ];

      transcribeFromUrl({
        url: trimmed,
        plan,
        language,
        signal: controller.signal,
        onUploadProgress: (info) => {
          setUploadProgress(info);
        },
        onUploadComplete: () => {
          setUploadProgress((prev) =>
            prev
              ? { ...prev, percent: 55, loadedBytes: 55 }
              : prev,
          );
          setStage("queued");
        },
        onJobStage: (jobStage) => {
          if (jobStage === "completed") return;
          setStage(jobStage);
        },
        onHeadersReceived: () => setStage("analyzing"),
      }).then((uploadResult) => {
        for (const t of stageTimers) window.clearTimeout(t);
        if (abortRef.current !== controller) return;

        if (isFailure(uploadResult)) {
          const message = uploadResult.error.message;
          if (message === "Upload cancelled.") {
            setStatus("idle");
            setError(null);
            setUploadProgress(null);
            return;
          }
          setError(message);
          setStatus("error");
          toast({
            title: "העיבוד נכשל",
            description: message.replace(/^[A-Z_]+:\s*/, ""),
            variant: "error",
          });
          return;
        }

        setStage("completed");
        setResult(uploadResult.data);
        setStatus("complete");
        setUploadProgress(null);
        recordUsage();
        saveToHistory(uploadResult.data, HISTORY_LIMITS[plan]);
        toast({
          title: "הסגירה מוכנה",
          description: uploadResult.data.fileName,
          variant: "success",
        });
      });
    },
    [plan, canTranscribe, recordUsage, revokeAudioUrl, toast],
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
    uploadProgress,
    processFile,
    processUrl,
    reset,
    canTranscribe,
  };
}
