import { describe, expect, it } from "vitest";
import {
  getCampaignDisplayPriceLabel,
  getCampaignStrikePriceLabel,
  getLaunchCampaignSnapshot,
} from "@/lib/launch-campaign";

describe("launch-campaign helpers", () => {
  const midLaunch = new Date("2026-08-20T10:00:00.000Z").getTime();
  const afterLaunch = new Date("2026-10-05T10:00:00.000Z").getTime();

  it("returns intro display during launch", () => {
    expect(getCampaignDisplayPriceLabel(midLaunch)).toBe("$9.99");
    expect(getCampaignStrikePriceLabel(midLaunch)).toBe("$24.90");
  });

  it("returns regular display after launch", () => {
    expect(getCampaignDisplayPriceLabel(afterLaunch)).toBe("$24.90");
    expect(getCampaignStrikePriceLabel(afterLaunch)).toBeNull();
  });

  it("includes honest billing note", () => {
    const snap = getLaunchCampaignSnapshot(midLaunch);
    expect(snap.billingNoteHe).toContain("$9.99");
    expect(snap.billingNoteHe).toContain("$24.90");
    expect(snap.billingNoteEn).toMatch(/First month/i);
  });
});
