"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { FileAudio, FileVideo, Film, Lock, Upload, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { ACCEPTED_EXTENSIONS, ACCEPTED_FILE_TYPES } from "@/lib/constants";
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
    ACCEPTED_EXTENSIONS.includes(extension)
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadZone({ onFileSelect, disabled }: FileUploadZoneProps) {
  const { limits, isPro } = usePlan();
  const { t } = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!isAcceptedFile(file)) {
        setError(t.uploadErrorType);
        return;
      }
      if (file.size > limits.maxFileSizeBytes) {
        setError(isPro ? t.uploadErrorSizePro : t.uploadErrorSize);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [onFileSelect, limits, isPro, t],
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

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "gradient-border group relative cursor-pointer overflow-hidden rounded-2xl p-10 text-center transition-all duration-300 sm:p-14",
          isDragging ? "bg-violet-600/10" : "glass-card glass-card-hover",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.mp4,.m4a,audio/*,video/mp4"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-amber-500/20 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
          <Upload className="h-8 w-8 text-amber-400" />
        </div>

        <h2 className="relative text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
          {t.uploadDrop}
        </h2>
        <p className="relative mt-2 text-sm text-zinc-500">{t.uploadBrowse}</p>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: FileAudio, label: "MP3 / WAV" },
            { icon: FileVideo, label: "MP4 / M4A" },
            { icon: Film, label: "Pro" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
              <Icon className="h-3.5 w-3.5 text-violet-400" />
              {label}
            </span>
          ))}
        </div>

        <p className="relative mt-5 text-xs text-zinc-600">
          {t.uploadMax} {limits.maxFileSizeLabel}
          {isPro ? " · Pro" : " · Free"} · {limits.maxDurationLabel}
        </p>

        {!isPro && (
          <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400/80">
            <Lock className="h-3 w-3" />
            <Link href="/settings" className="underline-offset-2 hover:underline">{t.uploadUpgradeLink}</Link>
            {t.uploadUpgrade}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

export function SelectedFileBadge({ name, size }: { name: string; size: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
      <FileAudio className="h-4 w-4 text-amber-400" />
      <span className="max-w-[200px] truncate">{name}</span>
      <span className="text-zinc-700">·</span>
      <span className="text-zinc-500">{formatFileSize(size)}</span>
    </div>
  );
}
