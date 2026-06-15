"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getHistory } from "@/lib/history-store";
import {
  ONBOARDING_STEPS,
  type OnboardingState,
  type OnboardingStepId,
  dismissOnboarding,
  getOnboardingProgress,
  getOnboardingState,
  markStepComplete,
  saveOnboardingState,
} from "@/lib/onboarding-store";

interface UseOnboardingOptions {
  transcriptionStatus?: "idle" | "processing" | "complete" | "error";
  usageCount?: number;
}

export function useOnboarding(options: UseOnboardingOptions = {}) {
  const { transcriptionStatus = "idle", usageCount = 0 } = options;
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.email ?? "";

  const [state, setState] = useState<OnboardingState>({
    dismissed: false,
    completed: [],
    finished: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const applyState = useCallback((next: OnboardingState) => {
    setState(next);
    if (next.finished) {
      setModalOpen(false);
    } else if (!next.dismissed) {
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    applyState(getOnboardingState(userId));
    setHydrated(true);
  }, [userId, applyState]);

  useEffect(() => {
    if (!userId) return;
    const refresh = () => applyState(getOnboardingState(userId));
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [userId, applyState]);

  useEffect(() => {
    if (!userId || !hydrated || state.finished) return;

    const completed = new Set(state.completed);
    let changed = false;

    const hasUploaded =
      usageCount > 0 ||
      transcriptionStatus === "processing" ||
      transcriptionStatus === "complete" ||
      getHistory().length > 0;

    if (hasUploaded && !completed.has("first_project")) {
      completed.add("first_project");
      changed = true;
    }

    if (transcriptionStatus === "complete" && !completed.has("review_summary")) {
      completed.add("review_summary");
      changed = true;
    }

    if (!changed) return;

    const completedList = ONBOARDING_STEPS.filter((s) => completed.has(s));
    const finished = ONBOARDING_STEPS.every((s) => completed.has(s));
    const next: OnboardingState = {
      ...state,
      completed: completedList,
      finished,
    };
    saveOnboardingState(userId, next);
    applyState(next);
  }, [
    userId,
    hydrated,
    state,
    usageCount,
    transcriptionStatus,
    applyState,
  ]);

  const progress = useMemo(
    () => getOnboardingProgress(state.completed),
    [state.completed],
  );

  const isStepComplete = useCallback(
    (stepId: OnboardingStepId) => state.completed.includes(stepId),
    [state.completed],
  );

  const completeStep = useCallback(
    (stepId: OnboardingStepId) => {
      if (!userId) return;
      applyState(markStepComplete(userId, stepId));
    },
    [userId, applyState],
  );

  const dismiss = useCallback(() => {
    if (!userId) return;
    applyState(dismissOnboarding(userId));
    setModalOpen(false);
  }, [userId, applyState]);

  const openModal = useCallback(() => setModalOpen(true), []);

  const goToStep = useCallback(
    (stepId: OnboardingStepId) => {
      switch (stepId) {
        case "profile":
          router.push("/settings");
          break;
        case "first_project":
          setModalOpen(false);
          requestAnimationFrame(() => {
            document
              .getElementById("onboarding-upload-zone")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
          break;
        case "review_summary":
          break;
      }
    },
    [router],
  );

  const showOnboarding = hydrated && Boolean(userId) && !state.finished;

  return {
    showOnboarding,
    modalOpen: showOnboarding && modalOpen,
    dismissed: state.dismissed,
    finished: state.finished,
    completed: state.completed,
    progress,
    totalSteps: ONBOARDING_STEPS.length,
    isStepComplete,
    completeStep,
    dismiss,
    openModal,
    goToStep,
  };
}
