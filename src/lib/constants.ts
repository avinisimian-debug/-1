export type PlanTier = "free" | "pro";

export const PRO_PLAN_REGULAR_PRICE = "29.90";
export const PRO_PLAN_REGULAR_PRICE_LABEL = "$29.90";
export const PRO_PLAN_SALE_PRICE = "14.90";
export const PRO_PLAN_SALE_PRICE_LABEL = "$14.90";
export const PRO_PLAN_DISCOUNT_PERCENT = 50;
/** Launch sale ends one week after go-live (Jun 22, 2026). */
export const PRO_PLAN_SALE_END = new Date("2026-06-22T23:59:59");

export function isProSaleActive(now = Date.now()): boolean {
  return now < PRO_PLAN_SALE_END.getTime();
}

export function getProPlanPrice(): string {
  return isProSaleActive() ? PRO_PLAN_SALE_PRICE : PRO_PLAN_REGULAR_PRICE;
}

export function getProPlanPriceLabel(): string {
  return isProSaleActive() ? PRO_PLAN_SALE_PRICE_LABEL : PRO_PLAN_REGULAR_PRICE_LABEL;
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
