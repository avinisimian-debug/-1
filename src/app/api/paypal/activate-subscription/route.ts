import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  activatePayPalSubscription,
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
      return NextResponse.json({ error: "נדרשת התחברות." }, { status: 401 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "תשלום PayPal אינו מוגדר. פנו לתמיכה." },
        { status: 500 },
      );
    }

    const { subscriptionId } = (await request.json()) as {
      subscriptionId?: string;
    };

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "חסר מזהה מנוי." },
        { status: 400 },
      );
    }

    const existingOwner = await findUserBySubscriptionId(subscriptionId);
    if (existingOwner && existingOwner.email !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "המנוי משויך לחשבון אחר." },
        { status: 403 },
      );
    }

    const result = await activatePayPalSubscription(
      subscriptionId,
      session.user.email,
    );
    const status = mapPayPalSubscriptionStatus(result.status);

    if (status === "cancelled" || status === "past_due") {
      return NextResponse.json(
        { error: "המנוי לא הופעל. השלימו את האישור ב-PayPal ונסו שוב." },
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
        { error: "החשבון לא נמצא." },
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
      { error: "התשלום נכשל או ממתין. נסו שוב מההגדרות." },
      { status: 500 },
    );
  }
}
