import { describe, expect, it } from "vitest";
import {
  decidePayPalWebhookApplication,
  mapWebhookEventToStatus,
  paypalSignatureHeadersPresent,
  subscriptionIdFromEvent,
} from "@/lib/paypal-webhook";

describe("PayPal webhook application", () => {
  it("rejects missing signature headers", () => {
    const headers = new Headers();
    expect(paypalSignatureHeadersPresent(headers)).toBe(false);
  });

  it("accepts complete signature headers without treating them as verified", () => {
    const headers = new Headers({
      "paypal-transmission-id": "id",
      "paypal-transmission-time": "t",
      "paypal-cert-url": "https://api.paypal.com/cert",
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-transmission-sig": "sig",
    });
    expect(paypalSignatureHeadersPresent(headers)).toBe(true);
    expect(
      decidePayPalWebhookApplication({
        verified: false,
        eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
        subscriptionId: "I-1",
      }).apply,
    ).toBe(false);
  });

  it("rejects invalid / unverified signatures", () => {
    const decision = decidePayPalWebhookApplication({
      verified: false,
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      subscriptionId: "I-1",
    });
    expect(decision).toEqual({ apply: false, reason: "unverified" });
  });

  it("applies a verified activation", () => {
    const decision = decidePayPalWebhookApplication({
      verified: true,
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      subscriptionId: "I-1",
    });
    expect(decision.apply).toBe(true);
    expect(decision.status).toBe("active");
  });

  it("maps cancellation to cancelled", () => {
    expect(mapWebhookEventToStatus("BILLING.SUBSCRIPTION.CANCELLED")).toBe(
      "cancelled",
    );
    const decision = decidePayPalWebhookApplication({
      verified: true,
      eventType: "BILLING.SUBSCRIPTION.CANCELLED",
      subscriptionId: "I-1",
    });
    expect(decision.status).toBe("cancelled");
  });

  it("maps failed payment to past_due", () => {
    expect(
      mapWebhookEventToStatus("BILLING.SUBSCRIPTION.PAYMENT.FAILED"),
    ).toBe("past_due");
  });

  it("is idempotent for duplicate verified events", () => {
    const first = decidePayPalWebhookApplication({
      verified: true,
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      subscriptionId: "I-1",
    });
    const second = decidePayPalWebhookApplication({
      verified: true,
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      subscriptionId: "I-1",
    });
    expect(first).toEqual(second);
  });

  it("does not apply events without a subscription id (unrelated/empty resource)", () => {
    const decision = decidePayPalWebhookApplication({
      verified: true,
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
    });
    expect(decision.apply).toBe(false);
    expect(decision.reason).toBe("missing_subscription_id");
  });

  it("reads billing agreement id from sale completed events", () => {
    expect(
      subscriptionIdFromEvent({
        event_type: "PAYMENT.SALE.COMPLETED",
        resource: { id: "sale", billing_agreement_id: "I-SUB" },
      }),
    ).toBe("I-SUB");
  });
});
