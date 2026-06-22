import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createPayPalSubscription,
  formatPayPalError,
  getAppBaseUrl,
  getSubscriptionPlanId,
  getPayPalSubscription,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, error: "PayPal is not configured on the server." },
      { status: 500 },
    );
  }

  const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];

  try {
    const planId = await getSubscriptionPlanId();
    checks.push({ name: "resolve_plan", ok: true, detail: planId });

    const baseUrl = getAppBaseUrl();
    const subscriptionId = await createPayPalSubscription(
      `${baseUrl}/settings?subscription=success`,
      `${baseUrl}/settings?subscription=cancel`,
    );
    checks.push({
      name: "create_subscription",
      ok: true,
      detail: subscriptionId,
    });

    const sub = await getPayPalSubscription(subscriptionId);
    checks.push({
      name: "subscription_status",
      ok: ["APPROVAL_PENDING", "APPROVED", "ACTIVE"].includes(sub.status),
      detail: sub.status,
    });

    return NextResponse.json({
      ok: checks.every((c) => c.ok),
      checks,
      note: "Buyer approval on PayPal.com was not tested (requires a PayPal login).",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        checks,
        error: formatPayPalError(error),
      },
      { status: 500 },
    );
  }
}
