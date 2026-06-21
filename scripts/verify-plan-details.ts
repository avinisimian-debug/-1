import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { getUserPlanDetails } from "../src/lib/users-store";

async function main() {
  mkdirSync("data", { recursive: true });
  const file = join("data", "users.json");
  const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  writeFileSync(
    file,
    JSON.stringify([
      {
        id: "trial@test.com",
        name: "Trial",
        email: "trial@test.com",
        provider: "email",
        plan: "pro",
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        proTrialEndsAt: future,
        proTrialUsed: true,
      },
      {
        id: "sub@test.com",
        name: "Sub",
        email: "sub@test.com",
        provider: "email",
        plan: "pro",
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        paypalSubscriptionId: "I-TEST123",
        proSubscriptionStatus: "trialing",
      },
    ]),
  );

  const trial = await getUserPlanDetails("trial@test.com");
  if (trial.plan !== "pro" || !trial.needsPayPalSetup || trial.hasSubscription) {
    throw new Error("trial user should need PayPal setup");
  }
  console.log("✓ trial-without-subscription → needsPayPalSetup");

  const sub = await getUserPlanDetails("sub@test.com");
  if (sub.plan !== "pro" || !sub.hasSubscription || sub.needsPayPalSetup) {
    throw new Error("subscriber should have active billing");
  }
  console.log("✓ paypal-subscriber → hasSubscription, auto-billing ready");
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
