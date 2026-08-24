import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isLaunchWeekActive } from "@/lib/constants";
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
      launchOffer: isLaunchWeekActive(),
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create subscription.";
    const offerExpired =
      /launch|expired|not active|campaign/i.test(message) &&
      !isLaunchWeekActive();

    return NextResponse.json(
      {
        error: offerExpired
          ? "מבצע ההשקה הסתיים. רעננו את הדף ונסו שוב במחיר הרגיל."
          : "לא ניתן לפתוח תשלום. נסו שוב או פנו לתמיכה.",
        offerExpired,
      },
      { status: 500 },
    );
  }
}
