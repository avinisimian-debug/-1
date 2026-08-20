import { getProPlanPrice } from "@/lib/constants";
import {
  getPayPalBaseUrl,
  getPayPalMode,
  PRO_PLAN_CURRENCY,
} from "@/lib/paypal-plan-inspect";

export { getPayPalBaseUrl, getPayPalMode, PRO_PLAN_CURRENCY };

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("PayPal auth error:", details);
    const hint =
      getPayPalMode() === "live"
        ? " Check PAYPAL_MODE=live matches your Live app keys."
        : " Check PAYPAL_MODE=sandbox matches your Sandbox app keys.";
    throw new Error("Failed to authenticate with PayPal." + hint);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(customId: string): Promise<string> {
  const token = await getPayPalAccessToken();

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: customId,
          description: "Staz AI Pro — monthly (legacy one-time fallback)",
          amount: {
            currency_code: PRO_PLAN_CURRENCY,
            value: getProPlanPrice(),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("PayPal create order error:", error);
    throw new Error("Failed to create PayPal order.");
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}

export async function capturePayPalOrder(orderId: string): Promise<{
  success: boolean;
  transactionId?: string;
  customId?: string;
}> {
  const token = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("PayPal capture error:", error);
    throw new Error("Failed to capture PayPal payment.");
  }

  const data = (await response.json()) as {
    status: string;
    purchase_units?: Array<{
      custom_id?: string;
      payments?: { captures?: Array<{ id: string }> };
    }>;
  };

  const transactionId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id;

  return {
    success: data.status === "COMPLETED",
    transactionId,
    customId: data.purchase_units?.[0]?.custom_id,
  };
}

export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID?.trim() &&
      process.env.PAYPAL_CLIENT_SECRET?.trim(),
  );
}
