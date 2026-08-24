/**
 * Ensures a Live PayPal Launch Month plan exists (TRIAL $9.99 → REGULAR $24.90)
 * and prints the plan id to pin as PAYPAL_LAUNCH_PLAN_ID.
 *
 * Usage: node --import tsx scripts/ensure-launch-plan.mjs
 * Loads .env.local then .env.paypal.paste (gitignored).
 */
import { readFileSync, existsSync, appendFileSync } from "fs";
import { join } from "path";

function loadEnvFile(file) {
  if (!existsSync(file)) return;
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

loadEnvFile(join(process.cwd(), ".env.local"));
loadEnvFile(join(process.cwd(), ".env.paypal.paste"));

const { getSubscriptionPlanId, checkPayPalBillingSetup } = await import(
  "../src/lib/paypal-subscriptions.ts"
);
const { isLaunchWeekActive } = await import("../src/lib/constants.ts");

if (!isLaunchWeekActive()) {
  console.error("Launch campaign is not active — refusing to create launch plan.");
  process.exit(1);
}

const planId = await getSubscriptionPlanId();
const check = await checkPayPalBillingSetup();

console.log("Launch plan id:", planId);
console.log("Billing check:", {
  planOk: check.planOk,
  launchWeekActive: check.launchWeekActive,
  billedAmount: check.billedAmount,
  tenureType: check.tenureType,
  priceMatchesUi: check.priceMatchesUi,
  planSource: check.planSource,
  error: check.error,
});

const paste = join(process.cwd(), ".env.paypal.paste");
if (existsSync(paste)) {
  const raw = readFileSync(paste, "utf8");
  if (!raw.includes("PAYPAL_LAUNCH_PLAN_ID=")) {
    appendFileSync(
      paste,
      `\n# Auto-pinned by scripts/ensure-launch-plan.mjs\nPAYPAL_LAUNCH_PLAN_ID=${planId}\n`,
    );
    console.log("Appended PAYPAL_LAUNCH_PLAN_ID to .env.paypal.paste (gitignored).");
  } else if (!raw.includes(`PAYPAL_LAUNCH_PLAN_ID=${planId}`)) {
    console.log(
      "Update Vercel + .env.paypal.paste manually:\nPAYPAL_LAUNCH_PLAN_ID=" +
        planId,
    );
  }
}

console.log("\nSet in Vercel Production:\nPAYPAL_LAUNCH_PLAN_ID=" + planId);
