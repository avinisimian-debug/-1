"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FileAudio,
  FileVideo,
  Link2,
  Lock,
  Mic,
  Square,
  Upload,
  X,
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

export function FileUploadZone({ onFileSelect, disabled }: FileUploadZoneProps) {
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
    toast({
      title: t.uploadLinkSoonTitle,
      description: t.uploadLinkSoonDesc,
      variant: "default",
    });
    setLinkUrl("");
    setShowLink(false);
  };

  const formatLabels = [
    { icon: FileAudio, label: "MP3 · WAV · M4A · AAC · FLAC" },
    { icon: FileVideo, label: "MP4 · MOV · WEBM · MKV" },
  ];

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
          "upload-zone group relative cursor-pointer overflow-hidden p-10 text-center sm:p-14",
          isDragging && "upload-zone-dragging",
          disabled && "upload-zone-disabled pointer-events-none opacity-50",
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
          className="pointer-events-none mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-muted ring-1 ring-accent/15 transition-transform duration-300 group-hover:scale-105"
        >
          <Upload className="h-7 w-7 text-accent" strokeWidth={1.75} />
        </div>

        <h2 className="relative text-xl font-semibold text-foreground">
          {t.uploadDrop}
        </h2>
        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
          {t.uploadBrowse}
        </p>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
          {formatLabels.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs"
            >
              <Icon className="h-3.5 w-3.5 text-accent/70" />
              {label}
            </span>
          ))}
        </div>

        <div className="relative mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <span className="inline-flex items-center rounded-md border border-border/80 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            {t.uploadFileSizeNote.replace("{size}", limits.maxFileSizeLabel)}
          </span>
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
          <span className="inline-flex items-center rounded-md border border-border/80 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            {t.uploadDurationNote
              .replace("{duration}", limits.maxDurationLabel)
              .replace("{plan}", isPro ? "Pro" : t.planFree)}
          </span>
        </div>

        {!isPro && (
          <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs text-accent">
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

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => (recording ? stopRecording() : startRecording())}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors",
            recording
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border bg-card text-foreground hover:bg-muted",
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
              <Mic className="h-3.5 w-3.5 text-accent" />
              {t.uploadRecordMic}
            </>
          )}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowLink((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Link2 className="h-3.5 w-3.5 text-accent" />
          {t.uploadPasteLink}
        </button>
      </div>

      {showLink && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={t.uploadLinkPlaceholder}
            className="ds-input min-h-9 flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitLink();
            }}
          />
          <button
            type="button"
            onClick={submitLink}
            className="ds-btn-primary min-h-9 px-4 text-xs"
          >
            {t.uploadLinkSubmit}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

export function SelectedFileBadge({ name, size }: { name: string; size: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground shadow-xs">
      <FileAudio className="h-4 w-4 text-accent" />
      <span className="max-w-[200px] truncate">{name}</span>
      <span className="text-border">·</span>
      <span className="text-muted-foreground">{formatFileSize(size)}</span>
    </div>
  );
}
