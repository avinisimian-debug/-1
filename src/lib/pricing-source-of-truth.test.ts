import { describe, expect, it } from "vitest";
import {
  getProPlanPrice,
  getProPlanPriceLabel,
  getProPlanRegularPriceLabel,
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE_LABEL,
  PRO_PLAN_REGULAR_PRICE_LABEL,
} from "@/lib/constants";
import { getLaunchCampaignSnapshot } from "@/lib/launch-campaign";
import { TIER_PRICING } from "@/lib/pricing-tiers";
import { hasFeature } from "@/lib/plan-features";

describe("public pricing source of truth", () => {
  it("keeps catalog / health amount at $24.90 always", () => {
    expect(getProPlanPrice()).toBe("24.90");
    expect(getProPlanRegularPriceLabel()).toBe("$24.90");
    expect(TIER_PRICING.pro.monthly).toBe(24.9);
  });

  it("surfaces launch intro label only while campaign is active", () => {
    if (isLaunchWeekActive()) {
      expect(getProPlanPriceLabel()).toBe(PRO_PLAN_INTRO_PRICE_LABEL);
      const snap = getLaunchCampaignSnapshot();
      expect(snap.active).toBe(true);
      expect(snap.discountPercent).toBe(59);
    } else {
      expect(getProPlanPriceLabel()).toBe(PRO_PLAN_REGULAR_PRICE_LABEL);
    }
  });

  it("computes discount from 24.90 → 9.99 as 59%", () => {
    const snap = getLaunchCampaignSnapshot(
      new Date("2026-08-15T12:00:00.000Z").getTime(),
    );
    expect(snap.discountPercent).toBe(59);
    expect(snap.launchPriceLabel).toBe("$9.99");
    expect(snap.originalPriceLabel).toBe("$24.90");
  });

  it("keeps copy aha free and professional PDF on Pro", () => {
    expect(hasFeature("free", "copyToClipboard")).toBe(true);
    expect(hasFeature("free", "smartDecisions")).toBe(true);
    expect(hasFeature("free", "pdfExport")).toBe(false);
    expect(hasFeature("pro", "pdfExport")).toBe(true);
  });

  it("ignores client plan claims — Free cannot grant Pro features", () => {
    expect(hasFeature("free", "largeFiles")).toBe(false);
    expect(hasFeature("free", "meetingQuota")).toBe(false);
  });
});

describe("launch campaign window", () => {
  it("is inactive after end date", () => {
    const snap = getLaunchCampaignSnapshot(
      new Date("2026-10-01T00:00:00.000Z").getTime(),
    );
    expect(snap.active).toBe(false);
  });

  it("is inactive before start date", () => {
    const snap = getLaunchCampaignSnapshot(
      new Date("2026-07-15T00:00:00.000Z").getTime(),
    );
    expect(snap.active).toBe(false);
  });
});
