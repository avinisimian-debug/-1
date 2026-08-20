import { NextResponse } from "next/server";
import {
  checkPayPalBillingSetup,
  getAppBaseUrl,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";
import { getPayPalAccessToken } from "@/lib/paypal";
import { getPayPalBaseUrl, getPayPalMode } from "@/lib/paypal-plan-inspect";

/** Public PayPal ops — no secrets. authOk is false unless Live/Sandbox token actually works. */
export async function GET() {
  const configured = isPayPalConfigured();
  const publicClientId = Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim(),
  );
  const mode = getPayPalMode();
  const clientMatch =
    configured &&
    publicClientId &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ===
      process.env.PAYPAL_CLIENT_ID?.trim();

  let authOk = false;
  if (configured) {
    try {
      await getPayPalAccessToken();
      authOk = true;
    } catch {
      authOk = false;
    }
  }

  const billing =
    configured && authOk ? await checkPayPalBillingSetup() : null;

  return NextResponse.json({
    mode,
    configured,
    authOk,
    clientIdMatch: clientMatch,
    publicClientId,
    apiBase: getPayPalBaseUrl(),
    webhookIdConfigured: Boolean(process.env.PAYPAL_WEBHOOK_ID?.trim()),
    webhookUrl: `${getAppBaseUrl()}/api/paypal/webhook`,
    billing: billing
      ? {
          planId: billing.planId ?? null,
          cycle: billing.cycle ?? null,
          billedAmount: billing.billedAmount ?? null,
          currency: billing.currency ?? null,
          priceMatchesUi: billing.priceMatchesUi,
          planOk: billing.planOk,
          planSource: billing.planSource,
          error: billing.error ?? null,
        }
      : null,
    ok:
      configured &&
      authOk &&
      clientMatch &&
      Boolean(billing?.planOk) &&
      billing?.priceMatchesUi === true,
  });
}
