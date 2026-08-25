"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Link2,
  Lock,
  Mic,
  Square,
  Upload,
  X,
  FileAudio,
} from "lucide-react";
import { useFeatureGate } from "@/context/FeatureGateContext";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { useToast } from "@/context/ToastContext";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_FILE_INPUT,
  ACCEPTED_FILE_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
  disabled?: boolean;
}

function isAcceptedFile(file: File): boolean {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();
  return (
    ACCEPTED_FILE_TYPES.includes(file.type) ||
    ACCEPTED_EXTENSIONS.includes(extension) ||
    (!file.type && ACCEPTED_EXTENSIONS.includes(extension))
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadZone({
  onFileSelect,
  onUrlSubmit,
  disabled,
}: FileUploadZoneProps) {
  const { limits, isPro } = usePlan();
  const { promptUpgrade } = useFeatureGate();
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!isAcceptedFile(file)) {
        setError(t.uploadErrorType);
        toast({ title: t.uploadErrorType, variant: "error" });
        return;
      }
      if (file.size > limits.maxFileSizeBytes) {
        if (!isPro) {
          promptUpgrade("largeFiles");
        }
        const msg = isPro ? t.uploadErrorSizePro : t.uploadErrorSize;
        setError(msg);
        toast({ title: msg, variant: "warning" });
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [onFileSelect, limits, isPro, t, promptUpgrade, toast],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setRecording(false);
  }, []);

  useEffect(() => () => stopRecording(), [stopRecording]);

  const startRecording = async () => {
    if (disabled || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("webm") ? "webm" : "m4a";
        const file = new File(
          [blob],
          `recording-${new Date().toISOString().slice(0, 19)}.${ext}`,
          { type: mimeType },
        );
        handleFile(file);
      };
      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setRecording(true);
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      toast({
        title: t.uploadMicDenied,
        variant: "error",
      });
    }
  };

  const submitLink = () => {
    const url = linkUrl.trim();
    if (!url) return;
    try {
      // Basic client validation — server re-validates.
       
      new URL(url);
    } catch {
      toast({
        title: t.uploadLinkInvalid,
        variant: "error",
      });
      return;
    }
    if (!onUrlSubmit) {
      toast({
        title: t.uploadLinkSoonTitle,
        description: t.uploadLinkSoonDesc,
        variant: "warning",
      });
      return;
    }
    setError(null);
    onUrlSubmit(url);
    setLinkUrl("");
    setShowLink(false);
  };

  return (
    <div className="w-full space-y-4">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "lat-capture-zone group relative cursor-pointer overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12",
          isDragging && "lat-capture-zone--dragging",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_INPUT}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] ring-1 ring-[color-mix(in_srgb,var(--accent)_16%,transparent)] transition-transform duration-200 group-hover:scale-[1.04] sm:mb-6 sm:h-16 sm:w-16"
        >
          <Upload className="h-6 w-6 text-[var(--accent)] sm:h-7 sm:w-7" strokeWidth={1.75} />
        </div>

        <h2 className="relative font-brand text-lg font-semibold tracking-tight text-[var(--ink-primary)] sm:text-xl">
          גררו הקלטה לכאן
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-secondary)]">
          או לחצו לבחירת קובץ — ותוך דקות תקבלו סגירה ברורה
        </p>

        <p className="relative mx-auto mt-5 max-w-lg text-[11px] leading-relaxed text-[var(--ink-tertiary)] sm:text-xs">
          אודיו · וידאו · עד {limits.maxFileSizeLabel} · עד {limits.maxDurationLabel}
          {!isPro ? ` · ${t.planFree}` : " · Pro"}
        </p>

        {!isPro && (
          <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--accent)]">
            <Lock className="h-3 w-3" />
            <Link
              href="/settings#upgrade"
              className="underline-offset-2 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {t.uploadUpgradeLink}
            </Link>
            {t.uploadUpgrade}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => (recording ? stopRecording() : startRecording())}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]",
            recording
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-[var(--line-subtle)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]",
            disabled && "opacity-50",
          )}
        >
          {recording ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              {t.uploadStopRec} ({recSeconds}s)
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5 text-[var(--accent)]" />
              {t.uploadRecordMic}
            </>
          )}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowLink((v) => !v)}
          aria-expanded={showLink}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)] disabled:opacity-50",
            showLink
              ? "border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--line-subtle)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)] hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]",
          )}
        >
          <Link2 className="h-3.5 w-3.5 text-[var(--accent)]" />
          {t.uploadPasteLink}
        </button>
      </div>

      {showLink && (
        <div className="flex flex-col gap-2 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-elevated)] p-3 shadow-xs sm:flex-row sm:items-center">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={t.uploadLinkPlaceholder}
            className="ds-input min-h-10 flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitLink();
            }}
          />
          <button
            type="button"
            onClick={submitLink}
            className="lat-btn-primary !min-h-10 !px-4 !text-xs"
          >
            {t.uploadLinkSubmit}
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

export function SelectedFileBadge({ name, size }: { name: string; size: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2 text-sm text-[var(--ink-primary)] shadow-xs">
      <FileAudio className="h-4 w-4 text-[var(--accent)]" />
      <span className="max-w-[200px] truncate">{name}</span>
      <span className="text-[var(--ink-tertiary)]">·</span>
      <span className="text-[var(--ink-tertiary)]">{formatFileSize(size)}</span>
    </div>
  );
}
