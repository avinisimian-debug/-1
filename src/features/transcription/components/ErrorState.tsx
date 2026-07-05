"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import {
  resolveTranscriptionErrorMessage,
  shouldShowProUpsell,
} from "@/features/transcription/lib/error-messages";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  fileName?: string;
  onRetry: () => void;
}

export function ErrorState({ message, fileName, onRetry }: ErrorStateProps) {
  const { t } = useLocale();
  const { isPro } = usePlan();
  const { text, kind } = resolveTranscriptionErrorMessage(message, t, isPro);
  const showPro = shouldShowProUpsell(kind, isPro);

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in-up">
      <div className="glass-card overflow-hidden rounded-2xl border border-red-200/60">
        <div className="border-b border-border/60 bg-gradient-to-b from-red-50/80 to-card px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100/80 ring-1 ring-red-200/80">
            <AlertCircle className="h-8 w-8 text-red-600" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t.transcriptionFailed}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.transcriptionFailedSubtitle}
          </p>
          {fileName && (
            <p
              className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-1.5 text-xs text-muted-foreground"
              dir="auto"
            >
              <span className="truncate">{fileName}</span>
            </p>
          )}
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/90">
            {text}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="btn-cinema mt-6 inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            {t.tryAgain}
          </button>
        </div>

        {showPro && (
          <div className="border-b border-border/60 bg-accent-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-muted ring-1 ring-accent/20">
                  <Crown className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.transcriptionErrorProTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t.transcriptionErrorProDesc}
                  </p>
                </div>
              </div>
              <Link
                href={SETTINGS_UPGRADE_PATH}
                className={cn(
                  "btn-cinema inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium",
                )}
              >
                {t.transcriptionErrorProCta}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        <div className="px-6 py-5 sm:px-8">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t.transcriptionErrorTipsTitle}
          </p>
          <ul className="space-y-2 text-start">
            {[t.transcriptionErrorTip1, t.transcriptionErrorTip2].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
