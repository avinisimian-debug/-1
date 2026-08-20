import { describe, expect, it } from "vitest";
import { getProPlanPrice, getProPlanPriceLabel } from "@/lib/constants";
import { TIER_PRICING } from "@/lib/pricing-tiers";
import { hasFeature } from "@/lib/plan-features";

describe("public pricing source of truth", () => {
  it("exposes a single $24.90/month Pro offer", () => {
    expect(getProPlanPrice()).toBe("24.90");
    expect(getProPlanPriceLabel()).toBe("$24.90");
    expect(TIER_PRICING.pro.monthly).toBe(24.9);
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
