export type PlanTier = "free" | "pro";

export const PRO_PLAN_REGULAR_PRICE = "24.90";
export const PRO_PLAN_REGULAR_PRICE_LABEL = "$24.90";
/** First paid month after the free launch week. */
export const PRO_PLAN_INTRO_PRICE = "9.99";
export const PRO_PLAN_INTRO_PRICE_LABEL = "$9.99";
/** @deprecated Use PRO_PLAN_INTRO_PRICE — kept for imports during migration */
export const PRO_PLAN_SALE_PRICE = PRO_PLAN_INTRO_PRICE;
export const PRO_PLAN_SALE_PRICE_LABEL = PRO_PLAN_INTRO_PRICE_LABEL;

export const PRO_TRIAL_DAYS = 7;
/** Launch week ends Jun 29, 2026 — free Pro + intro pricing until then. */
export const PRO_LAUNCH_WEEK_END = new Date("2026-06-29T23:59:59");
/** @deprecated Use PRO_LAUNCH_WEEK_END */
export const PRO_PLAN_SALE_END = PRO_LAUNCH_WEEK_END;

export function isLaunchWeekActive(now = Date.now()): boolean {
  return now < PRO_LAUNCH_WEEK_END.getTime();
}

/** Days remaining in launch week (min 1 while active). Used for PayPal trial length. */
export function getLaunchTrialDays(now = Date.now()): number {
  const diff = PRO_LAUNCH_WEEK_END.getTime() - now;
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** @deprecated Use isLaunchWeekActive */
export function isProSaleActive(now = Date.now()): boolean {
  return isLaunchWeekActive(now);
}

/** Price charged on the next PayPal billing cycle (not during free trial). */
export function getProPlanPrice(): string {
  return isLaunchWeekActive() ? PRO_PLAN_INTRO_PRICE : PRO_PLAN_REGULAR_PRICE;
}

export function getProPlanPriceLabel(): string {
  return isLaunchWeekActive() ? PRO_PLAN_INTRO_PRICE_LABEL : PRO_PLAN_REGULAR_PRICE_LABEL;
}

/** Headline price shown in marketing UI during launch week. */
export function getProPlanDisplayPriceLabel(): string {
  return isLaunchWeekActive() ? "$0" : PRO_PLAN_REGULAR_PRICE_LABEL;
}

export const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

export const PLAN_LIMITS = {
  free: {
    maxFileSizeBytes: WHISPER_MAX_BYTES,
    maxFileSizeLabel: "25 MB",
    maxDurationLabel: "~30 min",
    transcriptionsPerMonth: 10,
  },
  pro: {
    maxFileSizeBytes: 500 * 1024 * 1024,
    maxFileSizeLabel: "500 MB",
    maxDurationLabel: "3+ hours",
    transcriptionsPerMonth: 100,
  },
} as const;

export const ACCEPTED_FILE_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "video/mp4",
];

export const ACCEPTED_EXTENSIONS = [".mp3", ".wav", ".mp4", ".m4a"];

export const PROCESSING_STAGES = [
  { key: "uploading" as const },
  { key: "transcribing" as const },
  { key: "analyzing" as const },
] as const;

export const NAV_ITEMS = [
  { href: "/", labelKey: "navDashboard" as const, icon: "LayoutDashboard" as const },
  { href: "/history", labelKey: "navHistory" as const, icon: "History" as const },
  { href: "/settings", labelKey: "navSettings" as const, icon: "Settings" as const },
] as const;

export function getMaxFileSizeForPlan(plan: PlanTier): number {
  return PLAN_LIMITS[plan].maxFileSizeBytes;
}
