import { describe, expect, it } from "vitest";
import { mapPayPalSubscriptionStatus } from "@/lib/paypal-subscriptions";

describe("mapPayPalSubscriptionStatus", () => {
  it("never treats APPROVAL_PENDING as a paid Pro state", () => {
    expect(mapPayPalSubscriptionStatus("APPROVAL_PENDING")).toBe("cancelled");
  });

  it("activates APPROVED and ACTIVE subscriptions", () => {
    expect(mapPayPalSubscriptionStatus("APPROVED")).toBe("active");
    expect(mapPayPalSubscriptionStatus("ACTIVE")).toBe("active");
  });
});
