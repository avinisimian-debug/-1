import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  formatPayPalError,
  getSubscriptionPlanId,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";

/** Returns the active PayPal plan ID for client-side subscription approval. */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal is not configured on the server." },
        { status: 500 },
      );
    }

    const planId = await getSubscriptionPlanId();
    return NextResponse.json({ planId });
  } catch (error) {
    console.error("Subscription plan error:", error);
    return NextResponse.json(
      { error: formatPayPalError(error) },
      { status: 500 },
    );
  }
}
