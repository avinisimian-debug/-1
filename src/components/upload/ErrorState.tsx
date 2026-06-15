"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface ErrorStateProps {
  message: string;
  fileName?: string;
  onRetry: () => void;
}

export function ErrorState({ message, fileName, onRetry }: ErrorStateProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
          {t.transcriptionFailed}
        </h2>
        {fileName && <p className="mt-2 text-sm text-zinc-500">{fileName}</p>}
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-red-300/90">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="btn-cinema mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          <RotateCcw className="h-4 w-4" />
          {t.tryAgain}
        </button>
      </div>
    </div>
  );
}
