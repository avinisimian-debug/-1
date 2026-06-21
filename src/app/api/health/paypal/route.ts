import { NextResponse } from "next/server";
import {
  createPayPalSubscription,
  formatPayPalError,
  getAppBaseUrl,
  getSubscriptionPlanId,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";
import { getPayPalAccessToken, getPayPalBaseUrl } from "@/lib/paypal";

/** Public health — no secrets exposed. */
export async function GET() {
  const configured = isPayPalConfigured();
  const publicClientId = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
  const clientMatch =
    configured &&
    publicClientId &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID === process.env.PAYPAL_CLIENT_ID;

  let authOk = false;
  if (configured) {
    try {
      await getPayPalAccessToken();
      authOk = true;
    } catch {
      authOk = false;
    }
  }

  return NextResponse.json({
    configured,
    publicClientId,
    mode,
    clientIdMatch: clientMatch,
    authOk,
    baseUrl: getAppBaseUrl(),
  });
}
