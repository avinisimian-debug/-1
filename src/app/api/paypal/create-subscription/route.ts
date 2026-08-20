import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createPayPalSubscription,
  getAppBaseUrl,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "נדרשת התחברות." }, { status: 401 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "תשלום PayPal אינו מוגדר. פנו לתמיכה." },
        { status: 500 },
      );
    }

    const baseUrl = getAppBaseUrl();
    const subscription = await createPayPalSubscription(
      `${baseUrl}/settings?subscription=success`,
      `${baseUrl}/settings?subscription=cancel`,
      session.user.email,
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      approveUrl: subscription.approveUrl,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "לא ניתן לפתוח תשלום. נסו שוב או פנו לתמיכה." },
      { status: 500 },
    );
  }
}
