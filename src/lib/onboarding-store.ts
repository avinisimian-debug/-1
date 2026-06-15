export type OnboardingStepId = "profile" | "first_project" | "review_summary";

export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "profile",
  "first_project",
  "review_summary",
];

export interface OnboardingState {
  dismissed: boolean;
  completed: OnboardingStepId[];
  finished: boolean;
}

const STORAGE_PREFIX = "stazai-onboarding";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

const DEFAULT_STATE: OnboardingState = {
  dismissed: false,
  completed: [],
  finished: false,
};

function parseState(raw: string | null): OnboardingState {
  if (!raw) return { ...DEFAULT_STATE };
  try {
    const data = JSON.parse(raw) as Partial<OnboardingState>;
    return {
      dismissed: data.dismissed ?? false,
      completed: Array.isArray(data.completed) ? data.completed : [],
      finished: data.finished ?? false,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function getOnboardingState(userId: string): OnboardingState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  return parseState(localStorage.getItem(storageKey(userId)));
}

export function saveOnboardingState(userId: string, state: OnboardingState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function markStepComplete(
  userId: string,
  stepId: OnboardingStepId,
): OnboardingState {
  const state = getOnboardingState(userId);
  if (state.finished) return state;

  const completed = state.completed.includes(stepId)
    ? state.completed
    : [...state.completed, stepId];

  const finished = ONBOARDING_STEPS.every((s) => completed.includes(s));

  const next: OnboardingState = { ...state, completed, finished };
  saveOnboardingState(userId, next);
  return next;
}

export function dismissOnboarding(userId: string): OnboardingState {
  const state = getOnboardingState(userId);
  const next = { ...state, dismissed: true };
  saveOnboardingState(userId, next);
  return next;
}

export function getOnboardingProgress(completed: OnboardingStepId[]): number {
  return Math.round((completed.length / ONBOARDING_STEPS.length) * 100);
}
