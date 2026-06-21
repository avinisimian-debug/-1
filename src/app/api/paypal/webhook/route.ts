import { NextRequest, NextResponse } from "next/server";
import { mapPayPalSubscriptionStatus } from "@/lib/paypal-subscriptions";
import { updateSubscriptionByPayPalId } from "@/lib/users-store";

type PayPalWebhookEvent = {
  event_type?: string;
  resource?: { id?: string };
};

const SUBSCRIPTION_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  "PAYMENT.SALE.COMPLETED",
]);

function subscriptionIdFromEvent(body: PayPalWebhookEvent): string | undefined {
  const resource = body.resource as {
    id?: string;
    billing_agreement_id?: string;
  };
  if (body.event_type === "PAYMENT.SALE.COMPLETED") {
    return resource.billing_agreement_id ?? resource.id;
  }
  return resource.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PayPalWebhookEvent;
    const eventType = body.event_type ?? "";
    const subscriptionId = subscriptionIdFromEvent(body);

    if (!subscriptionId || !SUBSCRIPTION_EVENTS.has(eventType)) {
      return NextResponse.json({ received: true });
    }

    let status: "trialing" | "active" | "cancelled" | "past_due" = "active";

    if (
      eventType === "BILLING.SUBSCRIPTION.CANCELLED" ||
      eventType === "BILLING.SUBSCRIPTION.EXPIRED"
    ) {
      status = "cancelled";
    } else if (
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED" ||
      eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED"
    ) {
      status = "past_due";
    } else if (
      eventType === "BILLING.SUBSCRIPTION.ACTIVATED" ||
      eventType === "PAYMENT.SALE.COMPLETED"
    ) {
      status = mapPayPalSubscriptionStatus("ACTIVE");
    }

    await updateSubscriptionByPayPalId(subscriptionId, status);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
