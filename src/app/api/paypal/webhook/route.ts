import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/lib/paypal";
import {
  decidePayPalWebhookApplication,
  paypalSignatureHeadersPresent,
  subscriptionIdFromEvent,
  type PayPalWebhookEvent,
} from "@/lib/paypal-webhook";
import { updateSubscriptionByPayPalId } from "@/lib/users-store";

async function verifyPayPalWebhookSignature(
  request: NextRequest,
  rawBody: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) return false;
  if (!paypalSignatureHeadersPresent(request.headers)) return false;

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return false;
  }

  const token = await getPayPalAccessToken();
  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event,
      }),
    },
  );
  if (!response.ok) return false;
  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: PayPalWebhookEvent;
    try {
      body = JSON.parse(rawBody) as PayPalWebhookEvent;
    } catch {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const verified = await verifyPayPalWebhookSignature(request, rawBody);
    const subscriptionId = subscriptionIdFromEvent(body);
    const decision = decidePayPalWebhookApplication({
      verified,
      eventType: body.event_type ?? "",
      subscriptionId,
    });

    if (!decision.apply || !decision.status || !subscriptionId) {
      if (!verified) {
        console.error("[paypal-webhook] unsigned or invalid — ignoring");
      }
      return NextResponse.json({
        received: true,
        applied: false,
        reason: decision.reason,
      });
    }

    const found = await updateSubscriptionByPayPalId(
      subscriptionId,
      decision.status,
    );

    return NextResponse.json({
      received: true,
      applied: found,
      reason: found ? "updated" : "unknown_subscription",
    });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ received: true, applied: false });
  }
}
