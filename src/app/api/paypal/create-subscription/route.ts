import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createPayPalSubscription,
  formatPayPalError,
  getAppBaseUrl,
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

    const baseUrl = getAppBaseUrl();
    const subscriptionId = await createPayPalSubscription(
      `${baseUrl}/settings?subscription=success`,
      `${baseUrl}/settings?subscription=cancel`,
    );

    return NextResponse.json({ subscriptionId });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: formatPayPalError(error) },
      { status: 500 },
    );
  }
}
