/**
 * Launch Month campaign — display helpers + analytics.
 * Window / kill-switch live in `@/lib/constants` (isLaunchWeekActive).
 *
 * Billing truth: when active, PayPal checkout uses launch plan
 * (first month TRIAL $9.99 → REGULAR $24.90). Frontend never invents amounts.
 */

import {
  isLaunchWeekActive,
  LAUNCH_MONTH_ENABLED,
  LAUNCH_MONTH_START,
  PRO_LAUNCH_WEEK_END,
  PRO_PLAN_INTRO_PRICE,
  PRO_PLAN_INTRO_PRICE_LABEL,
  PRO_PLAN_REGULAR_PRICE,
  PRO_PLAN_REGULAR_PRICE_LABEL,
} from "@/lib/constants";

export const LAUNCH_CAMPAIGN_START = LAUNCH_MONTH_START;
export const LAUNCH_CAMPAIGN_END = PRO_LAUNCH_WEEK_END;
export const LAUNCH_CAMPAIGN_ENABLED = LAUNCH_MONTH_ENABLED;

export type LaunchCampaignSnapshot = {
  enabled: boolean;
  active: boolean;
  startDate: string;
  endDate: string;
  originalPrice: string;
  originalPriceLabel: string;
  launchPrice: string;
  launchPriceLabel: string;
  currency: "USD";
  discountPercent: number;
  billingNoteHe: string;
  billingNoteEn: string;
  endsInMs: number;
};

function discountPercent(): number {
  const regular = Number.parseFloat(PRO_PLAN_REGULAR_PRICE);
  const intro = Number.parseFloat(PRO_PLAN_INTRO_PRICE);
  if (!Number.isFinite(regular) || regular <= 0) return 0;
  return Math.floor(((regular - intro) / regular) * 100);
}

export function isLaunchCampaignActive(now = Date.now()): boolean {
  return isLaunchWeekActive(now);
}

export function getLaunchCampaignSnapshot(now = Date.now()): LaunchCampaignSnapshot {
  const active = isLaunchCampaignActive(now);
  const endsInMs = Math.max(0, LAUNCH_CAMPAIGN_END.getTime() - now);
  return {
    enabled: LAUNCH_CAMPAIGN_ENABLED,
    active,
    startDate: LAUNCH_CAMPAIGN_START.toISOString(),
    endDate: LAUNCH_CAMPAIGN_END.toISOString(),
    originalPrice: PRO_PLAN_REGULAR_PRICE,
    originalPriceLabel: PRO_PLAN_REGULAR_PRICE_LABEL,
    launchPrice: PRO_PLAN_INTRO_PRICE,
    launchPriceLabel: PRO_PLAN_INTRO_PRICE_LABEL,
    currency: "USD",
    discountPercent: discountPercent(),
    billingNoteHe: `חודש ראשון ${PRO_PLAN_INTRO_PRICE_LABEL}, אחר כך ${PRO_PLAN_REGULAR_PRICE_LABEL} לחודש`,
    billingNoteEn: `First month ${PRO_PLAN_INTRO_PRICE_LABEL}, then ${PRO_PLAN_REGULAR_PRICE_LABEL}/month`,
    endsInMs,
  };
}

export function getCampaignDisplayPriceLabel(now = Date.now()): string {
  return isLaunchCampaignActive(now)
    ? PRO_PLAN_INTRO_PRICE_LABEL
    : PRO_PLAN_REGULAR_PRICE_LABEL;
}

export function getCampaignStrikePriceLabel(now = Date.now()): string | null {
  return isLaunchCampaignActive(now) ? PRO_PLAN_REGULAR_PRICE_LABEL : null;
}

export type LaunchAnalyticsEvent =
  | "launch_banner_view"
  | "launch_banner_click"
  | "launch_modal_open"
  | "launch_offer_view"
  | "pricing_cta_click"
  | "pro_upgrade_click"
  | "checkout_started"
  | "checkout_completed";

export function trackLaunchEvent(
  event: LaunchAnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  void import("@vercel/analytics")
    .then(({ track }) => {
      track(event, props);
    })
    .catch(() => {});
}
