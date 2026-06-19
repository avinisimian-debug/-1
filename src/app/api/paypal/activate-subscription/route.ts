import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  activatePayPalSubscription,
  formatPayPalError,
  isPayPalConfigured,
  mapPayPalSubscriptionStatus,
} from "@/lib/paypal-subscriptions";
import {
  findUserBySubscriptionId,
  setUserSubscription,
} from "@/lib/users-store";

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

    const existingOwner = await findUserBySubscriptionId(subscriptionId);
    if (existingOwner && existingOwner.email !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Subscription already linked to another account." },
        { status: 403 },
      );
    }

    const result = await activatePayPalSubscription(
      subscriptionId,
      session.user.email,
    );
    const status = mapPayPalSubscriptionStatus(result.status);

    if (status === "cancelled") {
      return NextResponse.json(
        { error: "Subscription was not activated." },
        { status: 400 },
      );
    }

    const saved = await setUserSubscription(
      session.user.email,
      subscriptionId,
      status,
    );

    if (!saved) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      plan: "pro",
      subscriptionId,
      status,
    });
  } catch (error) {
    console.error("Activate subscription error:", error);
    return NextResponse.json(
      { error: formatPayPalError(error) },
      { status: 500 },
    );
  }
}
