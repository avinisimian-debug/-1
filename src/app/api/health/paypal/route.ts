import { NextResponse } from "next/server";
import {
  checkPayPalBillingSetup,
  getAppBaseUrl,
  isPayPalConfigured,
} from "@/lib/paypal-subscriptions";
import { getPayPalAccessToken } from "@/lib/paypal";

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

  const baseUrl = getAppBaseUrl();
  const billing =
    configured && authOk ? await checkPayPalBillingSetup() : null;

  return NextResponse.json({
    configured,
    publicClientId,
    mode,
    clientIdMatch: clientMatch,
    authOk,
    baseUrl,
    blobStorage: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    assemblyai: Boolean(process.env.ASSEMBLYAI_API_KEY?.trim()),
    openai: Boolean(process.env.OPENAI_API_KEY?.trim()),
    billing: billing
      ? {
          planOk: billing.planOk,
          planSource: billing.planSource,
          launchWeekActive: billing.launchWeekActive,
          schemaVersion: billing.schemaVersion,
          error: billing.error,
        }
      : null,
    webhookUrl: `${baseUrl}/api/paypal/webhook`,
    ok:
      configured &&
      authOk &&
      clientMatch &&
      Boolean(billing?.planOk),
  });
}
