"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Circle,
  FileAudio,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { OnboardingStepId } from "@/lib/onboarding-store";
import type { Translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface OnboardingChecklistProps {
  open: boolean;
  progress: number;
  completed: OnboardingStepId[];
  isStepComplete: (id: OnboardingStepId) => boolean;
  onDismiss: () => void;
  onGoToStep: (id: OnboardingStepId) => void;
  variant?: "modal" | "card";
  onOpenModal?: () => void;
}

const STEPS: {
  id: OnboardingStepId;
  icon: typeof User;
  titleKey: keyof Translations;
  descKey: keyof Translations;
  outcomeKey: keyof Translations;
  ctaKey: keyof Translations;
}[] = [
  {
    id: "profile",
    icon: User,
    titleKey: "onboardStep1Title",
    descKey: "onboardStep1Desc",
    outcomeKey: "onboardStep1Outcome",
    ctaKey: "onboardStep1Cta",
  },
  {
    id: "first_project",
    icon: FileAudio,
    titleKey: "onboardStep2Title",
    descKey: "onboardStep2Desc",
    outcomeKey: "onboardStep2Outcome",
    ctaKey: "onboardStep2Cta",
  },
  {
    id: "review_summary",
    icon: Sparkles,
    titleKey: "onboardStep3Title",
    descKey: "onboardStep3Desc",
    outcomeKey: "onboardStep3Outcome",
    ctaKey: "onboardStep3Cta",
  },
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
      <div
        className="onboarding-progress-fill h-full rounded-full bg-zinc-900 transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ChecklistBody({
  t,
  progress,
  isStepComplete,
  onGoToStep,
  compact,
}: {
  t: Translations;
  progress: number;
  isStepComplete: (id: OnboardingStepId) => boolean;
  onGoToStep: (id: OnboardingStepId) => void;
  compact?: boolean;
}) {
  return (
    <>
      <div className={cn("mb-5", compact && "mb-4")}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-500">{t.onboardProgress}</span>
          <span className="tabular-nums font-semibold text-zinc-900">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <ul className="space-y-3">
        {STEPS.map((step, index) => {
          const done = isStepComplete(step.id);
          const Icon = step.icon;
          const prevDone = index === 0 || isStepComplete(STEPS[index - 1].id);
          const actionable = !done && prevDone;

          return (
            <li
              key={step.id}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                done
                  ? "border-emerald-200 bg-emerald-50/50"
                  : actionable
                    ? "border-zinc-200 bg-white"
                    : "border-zinc-100 bg-zinc-50/80",
              )}
            >
              <div className="flex gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    done ? "bg-emerald-100" : "bg-zinc-100",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Icon className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        done ? "text-emerald-800" : "text-zinc-900",
                      )}
                    >
                      {t[step.titleKey] as string}
                    </p>
                    {!done && (
                      <Circle className="mt-0.5 h-3 w-3 shrink-0 text-zinc-300" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {t[step.descKey] as string}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-indigo-600">
                    {t[step.outcomeKey] as string}
                  </p>
                  {actionable && step.id !== "review_summary" && (
                    <button
                      type="button"
                      onClick={() => onGoToStep(step.id)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
                    >
                      {t[step.ctaKey] as string}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                  {actionable && step.id === "review_summary" && (
                    <p className="mt-2 text-[11px] text-zinc-400">
                      {t.onboardStep3Waiting}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function OnboardingChecklist({
  open,
  progress,
  isStepComplete,
  onDismiss,
  onGoToStep,
  variant = "modal",
  onOpenModal,
}: OnboardingChecklistProps) {
  const { t } = useLocale();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setShowCelebration(true);
      const timer = setTimeout(() => onDismiss(), 2200);
      return () => clearTimeout(timer);
    }
    setShowCelebration(false);
  }, [progress, onDismiss]);

  if (variant === "card") {
    return (
      <section className="glass-card rounded-lg p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              {t.onboardTag}
            </p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900">
              {t.onboardTitle}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">{t.onboardSubtitle}</p>
          </div>
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              {t.onboardExpand}
            </button>
          )}
        </div>
        <ChecklistBody
          t={t}
          progress={progress}
          isStepComplete={isStepComplete}
          onGoToStep={onGoToStep}
          compact
        />
      </section>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.onboardDismiss}
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="relative z-10 w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          aria-label={t.onboardDismiss}
          onClick={onDismiss}
          className="absolute end-4 top-4 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>

        {showCelebration ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">{t.onboardComplete}</h2>
            <p className="mt-2 text-sm text-zinc-500">{t.onboardCompleteDesc}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 pe-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                {t.onboardTag}
              </p>
              <h2 id="onboarding-title" className="mt-1 text-xl font-semibold text-zinc-900">
                {t.onboardTitle}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">{t.onboardSubtitle}</p>
            </div>

            <ChecklistBody
              t={t}
              progress={progress}
              isStepComplete={isStepComplete}
              onGoToStep={onGoToStep}
            />

            <button
              type="button"
              onClick={onDismiss}
              className="mt-5 w-full text-center text-xs text-zinc-400 hover:text-zinc-600"
            >
              {t.onboardDismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
