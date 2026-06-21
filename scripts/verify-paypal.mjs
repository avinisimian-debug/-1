/**
 * Server-side PayPal verification (no buyer account required).
 * Checks auth, plan shape, subscription creation, and env consistency.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function loadEnv() {
  const files = [
    join(process.cwd(), ".env.vercel.production"),
    join(process.cwd(), ".env.vercel"),
    join(process.cwd(), ".env.local"),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const baseUrl =
  mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const results = [];

function pass(name, detail) {
  results.push({ ok: true, name, detail });
  console.log(`✓ ${name}${detail ? `: ${detail}` : ""}`);
}

function fail(name, detail) {
  results.push({ ok: false, name, detail });
  console.error(`✗ ${name}${detail ? `: ${detail}` : ""}`);
}

async function getToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Auth failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function paypalFetch(token, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json, text };
}

async function main() {
  console.log(`\nPayPal verification (${mode})\n${"─".repeat(40)}`);

  if (!clientId || !clientSecret) {
    fail("credentials", "PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET missing");
    process.exit(1);
  }
  pass("credentials", "server keys present");

  if (!publicClientId) {
    fail("public client id", "NEXT_PUBLIC_PAYPAL_CLIENT_ID missing");
  } else if (publicClientId !== clientId) {
    fail(
      "client id match",
      "NEXT_PUBLIC_PAYPAL_CLIENT_ID differs from PAYPAL_CLIENT_ID (sandbox/live mismatch?)",
    );
  } else {
    pass("client id match", "browser and server use same client id");
  }

  let token;
  try {
    token = await getToken();
    pass("oauth", "access token obtained");
  } catch (err) {
    fail("oauth", err.message);
    process.exit(1);
  }

  const launchEnd = new Date("2026-06-27T23:59:59");
  const launchActive = Date.now() < launchEnd.getTime();
  pass("launch week", launchActive ? "active" : "ended");

  const productRes = await paypalFetch(token, "/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: "Staz AI Pro Verify",
      description: "Verification product — safe to ignore",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  if (!productRes.ok) {
    fail("create product", productRes.text.slice(0, 200));
    process.exit(1);
  }
  const productId = productRes.json.id;
  pass("create product", productId);

  const startTime = new Date(launchEnd);
  startTime.setHours(startTime.getHours() + 1);
  const startIso =
    startTime.getTime() > Date.now() + 60_000
      ? startTime.toISOString()
      : new Date(Date.now() + 5 * 60_000).toISOString();

  const planBody = {
    product_id: productId,
    name: "Staz AI Pro — Verify Launch Plan",
    description: "Verification plan — safe to ignore",
    billing_cycles: [
      {
        frequency: { interval_unit: "MONTH", interval_count: 1 },
        tenure_type: "TRIAL",
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: { value: "14.90", currency_code: "USD" },
        },
      },
      {
        frequency: { interval_unit: "MONTH", interval_count: 1 },
        tenure_type: "REGULAR",
        sequence: 2,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: { value: "29.90", currency_code: "USD" },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 3,
    },
  };

  const planRes = await paypalFetch(token, "/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify(planBody),
  });

  if (!planRes.ok) {
    fail("create plan", planRes.text.slice(0, 300));
    process.exit(1);
  }

  const planId = planRes.json.id;
  pass("create plan", `${planId} (2 cycles: $14.90 trial + $29.90 regular)`);

  const activateRes = await paypalFetch(
    token,
    `/v1/billing/plans/${planId}/activate`,
    { method: "POST" },
  );
  if (!activateRes.ok && activateRes.status !== 204) {
    fail("activate plan", activateRes.text.slice(0, 200));
  } else {
    pass("activate plan", "ACTIVE");
  }

  const subBody = {
    plan_id: planId,
    start_time: launchActive ? startIso : undefined,
    application_context: {
      brand_name: "Staz AI",
      locale: "en-US",
      shipping_preference: "NO_SHIPPING",
      user_action: "SUBSCRIBE_NOW",
      return_url: "https://1stazai.com/settings?subscription=success",
      cancel_url: "https://1stazai.com/settings?subscription=cancel",
    },
  };
  if (!launchActive) delete subBody.start_time;

  const subRes = await paypalFetch(token, "/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify(subBody),
  });

  if (!subRes.ok) {
    fail("create subscription", subRes.text.slice(0, 400));
    process.exit(1);
  }

  const subId = subRes.json.id;
  const subStatus = subRes.json.status;
  const approveLink = subRes.json.links?.find((l) => l.rel === "approve")?.href;
  pass("create subscription", `${subId} (${subStatus})`);
  if (approveLink) {
    pass("approval link", "generated (buyer would open this in PayPal)");
  } else {
    fail("approval link", "missing from subscription response");
  }

  if (launchActive && subRes.json.start_time) {
    pass("delayed start_time", subRes.json.start_time);
  } else if (launchActive) {
    pass("delayed start_time", `requested ${startIso}`);
  }

  const getSub = await paypalFetch(token, `/v1/billing/subscriptions/${subId}`);
  if (getSub.ok) {
    pass("fetch subscription", `status=${getSub.json.status}`);
  } else {
    fail("fetch subscription", getSub.text.slice(0, 200));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${"─".repeat(40)}`);
  console.log(
    failed.length === 0
      ? `All ${results.length} checks passed.`
      : `${failed.length} check(s) failed.`,
  );
  console.log(
    "\nNote: buyer approval on PayPal.com requires a PayPal account — not tested here.",
  );
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
