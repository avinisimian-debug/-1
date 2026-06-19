import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  activatePayPalSubscription,
  isPayPalConfigured,
  mapPayPalSubscriptionStatus,
} from "@/lib/paypal-subscriptions";
import { setUserSubscription } from "@/lib/users-store";

export async function POST(request: NextRequest) {
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

    const { subscriptionId } = (await request.json()) as {
      subscriptionId?: string;
    };

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscription ID" },
        { status: 400 },
      );
    }

    const result = await activatePayPalSubscription(subscriptionId);
    const status = mapPayPalSubscriptionStatus(result.status);

    if (status === "cancelled") {
      return NextResponse.json(
        { error: "Subscription was not activated." },
        { status: 400 },
      );
    }

    await setUserSubscription(session.user.email, subscriptionId, status);

    return NextResponse.json({
      success: true,
      plan: "pro",
      subscriptionId,
      status,
    });
  } catch (error) {
    console.error("Activate subscription error:", error);
    return NextResponse.json(
      { error: "Failed to activate subscription." },
      { status: 500 },
    );
  }
}
