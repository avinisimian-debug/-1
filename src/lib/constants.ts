export type PlanTier = "free" | "pro";

export const PRO_PLAN_REGULAR_PRICE = "24.90";
export const PRO_PLAN_REGULAR_PRICE_LABEL = "$24.90";
/** Launch-week intro price (first month), then regular price. */
export const PRO_PLAN_INTRO_PRICE = "9.99";
export const PRO_PLAN_INTRO_PRICE_LABEL = "$9.99";
/** @deprecated Use PRO_PLAN_INTRO_PRICE — kept for imports during migration */
export const PRO_PLAN_SALE_PRICE = PRO_PLAN_INTRO_PRICE;
export const PRO_PLAN_SALE_PRICE_LABEL = PRO_PLAN_INTRO_PRICE_LABEL;

export const PRO_TRIAL_DAYS = 7;
/** Launch week ends Jun 29, 2026 — $9.99/mo intro pricing until then. */
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

/** One-time lifetime Pro price (USD). */
export const PRO_LIFETIME_PRICE = "19.00";
export const PRO_LIFETIME_PRICE_LABEL = "$19";
/** Launch-week lifetime price — pay once, Pro forever. */
export const PRO_LIFETIME_LAUNCH_PRICE = "9.99";

export function getProLifetimePrice(): string {
  return isLaunchWeekActive() ? PRO_LIFETIME_LAUNCH_PRICE : PRO_LIFETIME_PRICE;
}

export function getProLifetimePriceLabel(): string {
  return isLaunchWeekActive() ? PRO_PLAN_INTRO_PRICE_LABEL : PRO_LIFETIME_PRICE_LABEL;
}

/** @deprecated Use getProLifetimePrice — kept for legacy imports */
export function getProPlanPrice(): string {
  return getProLifetimePrice();
}

export function getProPlanPriceLabel(): string {
  return getProLifetimePriceLabel();
}

/** Headline price shown in marketing UI during launch week. */
export function getProPlanDisplayPriceLabel(): string {
  return getProLifetimePriceLabel();
}

export const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

/** Vercel Functions reject request bodies above ~4.5 MB — use Blob upload above this. */
export const VERCEL_DIRECT_UPLOAD_BYTES = 4 * 1024 * 1024;

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
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/flac",
  "audio/ogg",
  "audio/webm",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/x-msvideo",
  "video/avi",
  // Zoom / browser variants
  "application/mp4",
  "video/x-m4v",
  "video/mpeg",
];

export const ACCEPTED_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".flac",
  ".ogg",
  ".mp4",
  ".mov",
  ".webm",
  ".mkv",
  ".avi",
  ".m4v",
];

/** HTML accept attribute for file inputs */
export const ACCEPTED_FILE_INPUT =
  ACCEPTED_EXTENSIONS.join(",") +
  ",audio/*,video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-msvideo,video/x-m4v,application/mp4";

export const PROCESSING_STAGES = [
  { key: "uploading" as const },
  { key: "transcribing" as const },
  { key: "analyzing" as const },
] as const;

export const NAV_ITEMS = [
  { href: "/", labelKey: "navDashboard" as const, icon: "LayoutDashboard" as const },
  { href: "/live", labelKey: "navLive" as const, icon: "Video" as const },
  { href: "/history", labelKey: "navHistory" as const, icon: "History" as const },
  { href: "/settings", labelKey: "navSettings" as const, icon: "Settings" as const },
] as const;

export function getMaxFileSizeForPlan(plan: PlanTier): number {
  return PLAN_LIMITS[plan].maxFileSizeBytes;
}
