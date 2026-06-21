"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  FileAudio,
  Maximize2,
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
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="onboarding-progress-fill h-full rounded-full bg-foreground transition-all duration-700 ease-out"
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
  const activeStepId = STEPS.find(
    (step, index) =>
      !isStepComplete(step.id) &&
      (index === 0 || isStepComplete(STEPS[index - 1].id)),
  )?.id;

  return (
    <>
      <div className={cn("mb-5", compact && "mb-4")}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">{t.onboardProgress}</span>
          <span className="tabular-nums font-semibold text-foreground">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <ul className={cn("space-y-2", compact && "space-y-1.5")}>
        {STEPS.map((step, index) => {
          const done = isStepComplete(step.id);
          const Icon = step.icon;
          const prevDone = index === 0 || isStepComplete(STEPS[index - 1].id);
          const actionable = !done && prevDone;
          const isActive = step.id === activeStepId;

          return (
            <li
              key={step.id}
              className={cn(
                "rounded-lg border transition-all duration-300",
                done &&
                  "border-emerald-200/50 bg-emerald-50/25 px-3 py-2 opacity-70",
                isActive &&
                  "border-accent/35 bg-card px-4 py-4 shadow-sm ring-1 ring-accent/15",
                !done &&
                  !isActive &&
                  "border-border/60 bg-muted/30 px-3 py-3 opacity-80",
              )}
            >
              <div className={cn("flex gap-3", done && "items-center gap-2.5")}>
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-md",
                    done ? "h-6 w-6 bg-emerald-100" : "h-8 w-8 bg-muted",
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-accent" : "text-muted-foreground",
                      )}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "font-medium",
                        done
                          ? "text-sm text-emerald-800/80"
                          : isActive
                            ? "text-sm text-foreground"
                            : "text-sm text-muted-foreground",
                      )}
                    >
                      {t[step.titleKey] as string}
                    </p>
                    {!done && !isActive && (
                      <Circle className="mt-0.5 h-3 w-3 shrink-0 text-border" />
                    )}
                  </div>

                  {!done && (
                    <>
                      <p
                        className={cn(
                          "mt-0.5 text-xs leading-relaxed",
                          isActive ? "text-muted-foreground" : "text-muted-foreground/80",
                        )}
                      >
                        {t[step.descKey] as string}
                      </p>
                      {isActive && (
                        <p className="mt-1.5 text-[11px] font-medium text-accent">
                          {t[step.outcomeKey] as string}
                        </p>
                      )}
                      {actionable && step.id !== "review_summary" && (
                        <button
                          type="button"
                          onClick={() => onGoToStep(step.id)}
                          className="btn-cinema mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium"
                        >
                          {t[step.ctaKey] as string}
                          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                        </button>
                      )}
                      {actionable && step.id === "review_summary" && (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          {t.onboardStep3Waiting}
                        </p>
                      )}
                    </>
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
  const [bodyCollapsed, setBodyCollapsed] = useState(false);

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
      <section className="glass-card rounded-xl p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 text-start">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              {t.onboardTag}
            </p>
            <h3 className="mt-1 text-base font-semibold text-foreground">
              {t.onboardTitle}
            </h3>
            {!bodyCollapsed && (
              <p className="mt-1 text-xs text-muted-foreground">{t.onboardSubtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onOpenModal && (
              <button
                type="button"
                onClick={onOpenModal}
                aria-label={t.onboardExpand}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setBodyCollapsed((v) => !v)}
              aria-expanded={!bodyCollapsed}
              aria-label={bodyCollapsed ? t.onboardExpand : t.onboardHide}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {!bodyCollapsed && <span>{t.onboardHide}</span>}
              {bodyCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        {!bodyCollapsed && (
          <ChecklistBody
            t={t}
            progress={progress}
            isStepComplete={isStepComplete}
            onGoToStep={onGoToStep}
            compact
          />
        )}
      </section>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.onboardDismiss}
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          aria-label={t.onboardDismiss}
          onClick={onDismiss}
          className="absolute end-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {showCelebration ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{t.onboardComplete}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.onboardCompleteDesc}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 pe-8 text-start">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                {t.onboardTag}
              </p>
              <h2 id="onboarding-title" className="mt-1 text-xl font-semibold text-foreground">
                {t.onboardTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.onboardSubtitle}</p>
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
              className="mt-5 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.onboardDismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
