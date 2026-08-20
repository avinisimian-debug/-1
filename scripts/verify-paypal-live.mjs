/**
 * Local ops check — verifies Live PayPal credentials from .env.paypal.paste
 * without printing secrets. Does not mutate production.
 *
 * Usage: node scripts/verify-paypal-live.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function loadPaste() {
  const path = join(process.cwd(), ".env.paypal.paste");
  if (!existsSync(path)) {
    console.error("Missing .env.paypal.paste");
    process.exit(1);
  }
  const env = Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      }),
  );
  return env;
}

const env = loadPaste();
const id = env.PAYPAL_CLIENT_ID?.trim();
const secret = env.PAYPAL_CLIENT_SECRET?.trim();
const plan = (env.PAYPAL_REGULAR_PLAN_ID || env.PAYPAL_PLAN_ID)?.trim();

if (!id || !secret || !plan) {
  console.error("FAIL: need CLIENT_ID, CLIENT_SECRET, and plan id in paste file");
  process.exit(1);
}
if (id === secret) {
  console.error("FAIL: CLIENT_SECRET must not equal CLIENT_ID");
  process.exit(1);
}

const auth = Buffer.from(`${id}:${secret}`).toString("base64");
const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

if (!tokenRes.ok) {
  console.error("FAIL: Live OAuth authOk=false (status", tokenRes.status + ")");
  process.exit(1);
}

const { access_token } = await tokenRes.json();
const planRes = await fetch(`https://api-m.paypal.com/v1/billing/plans/${plan}`, {
  headers: { Authorization: `Bearer ${access_token}` },
});
if (!planRes.ok) {
  console.error("FAIL: plan lookup", planRes.status);
  process.exit(1);
}

const planJson = await planRes.json();
const cycles = planJson.billing_cycles || [];
const regular =
  [...cycles].reverse().find((c) => c.tenure_type === "REGULAR") || cycles[0];
const price = regular?.pricing_scheme?.fixed_price;
const amount = price?.value ?? null;
const currency = price?.currency_code ?? null;
const matches =
  currency === "USD" &&
  Number.parseFloat(amount) === 24.9 &&
  regular?.frequency?.interval_unit === "MONTH" &&
  regular?.frequency?.interval_count === 1;

console.log(
  JSON.stringify(
    {
      authOk: true,
      planId: planJson.id,
      status: planJson.status,
      billedAmount: amount,
      currency,
      cycle: `${regular?.frequency?.interval_unit}/${regular?.frequency?.interval_count}`,
      priceMatchesUi: matches,
    },
    null,
    2,
  ),
);

if (!matches) {
  console.error("FAIL: live price does not match UI $24.90 USD/month");
  process.exit(1);
}

console.log("PASS: Live PayPal credentials and $24.90 plan OK");
