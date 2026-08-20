import type { ProSubscriptionStatus } from "@/lib/users-store";

export type PayPalWebhookEvent = {
  event_type?: string;
  resource?: { id?: string; billing_agreement_id?: string };
};

const SUBSCRIPTION_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  "PAYMENT.SALE.COMPLETED",
]);

export function paypalSignatureHeadersPresent(
  headers: Headers | { get(name: string): string | null },
): boolean {
  return Boolean(
    headers.get("paypal-transmission-id") &&
      headers.get("paypal-transmission-time") &&
      headers.get("paypal-cert-url") &&
      headers.get("paypal-auth-algo") &&
      headers.get("paypal-transmission-sig"),
  );
}

export function subscriptionIdFromEvent(
  body: PayPalWebhookEvent,
): string | undefined {
  const resource = body.resource ?? {};
  if (body.event_type === "PAYMENT.SALE.COMPLETED") {
    return resource.billing_agreement_id ?? resource.id;
  }
  return resource.id;
}

export function mapWebhookEventToStatus(
  eventType: string,
): ProSubscriptionStatus | null {
  if (!SUBSCRIPTION_EVENTS.has(eventType)) return null;
  if (
    eventType === "BILLING.SUBSCRIPTION.CANCELLED" ||
    eventType === "BILLING.SUBSCRIPTION.EXPIRED"
  ) {
    return "cancelled";
  }
  if (
    eventType === "BILLING.SUBSCRIPTION.SUSPENDED" ||
    eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED"
  ) {
    return "past_due";
  }
  if (
    eventType === "BILLING.SUBSCRIPTION.ACTIVATED" ||
    eventType === "PAYMENT.SALE.COMPLETED"
  ) {
    return "active";
  }
  return "active";
}

export function decidePayPalWebhookApplication(input: {
  verified: boolean;
  eventType: string;
  subscriptionId?: string;
}): {
  apply: boolean;
  status?: ProSubscriptionStatus;
  reason: string;
} {
  if (!input.verified) {
    return { apply: false, reason: "unverified" };
  }
  const status = mapWebhookEventToStatus(input.eventType);
  if (!status) {
    return { apply: false, reason: "ignored_event" };
  }
  if (!input.subscriptionId) {
    return { apply: false, reason: "missing_subscription_id" };
  }
  return { apply: true, status, reason: "ok" };
}
