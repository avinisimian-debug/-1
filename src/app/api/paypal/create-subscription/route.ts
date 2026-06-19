import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createPayPalSubscription,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";

export async function POST() {
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

    const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
    const subscriptionId = await createPayPalSubscription(
      `${baseUrl}/settings?subscription=success`,
      `${baseUrl}/settings?subscription=cancel`,
    );

    return NextResponse.json({ subscriptionId });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription." },
      { status: 500 },
    );
  }
}
