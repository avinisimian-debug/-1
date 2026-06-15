import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";

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

    const orderId = await createPayPalOrder();

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order." },
      { status: 500 },
    );
  }
}
