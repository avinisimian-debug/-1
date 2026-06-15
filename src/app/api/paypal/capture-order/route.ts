import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { capturePayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { upgradeUserToPro } from "@/lib/users-store";

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

    const { orderId } = (await request.json()) as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const result = await capturePayPalOrder(orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Payment was not completed." },
        { status: 400 },
      );
    }

    await upgradeUserToPro(session.user.email, result.transactionId);

    return NextResponse.json({
      success: true,
      plan: "pro",
      transactionId: result.transactionId,
    });
  } catch (error) {
    console.error("Capture order error:", error);
    return NextResponse.json(
      { error: "Failed to process payment." },
      { status: 500 },
    );
  }
}
