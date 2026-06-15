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
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-red-100">
          <AlertCircle className="h-7 w-7 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">
          {t.transcriptionFailed}
        </h2>
        {fileName && <p className="mt-2 text-sm text-zinc-500">{fileName}</p>}
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-red-700">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="btn-cinema mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          {t.tryAgain}
        </button>
      </div>
    </div>
  );
}
