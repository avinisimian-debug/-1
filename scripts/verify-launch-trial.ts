import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { startLaunchTrial, getUserPlanDetails } from "../src/lib/users-store";

async function main() {
  mkdirSync("data", { recursive: true });
  writeFileSync(
    join("data", "users.json"),
    JSON.stringify([
      {
        id: "verify@test.com",
        name: "Verify",
        email: "verify@test.com",
        provider: "email",
        plan: "free",
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    ]),
  );

  const result = await startLaunchTrial("verify@test.com");
  if (!result.ok) {
    throw new Error(`startLaunchTrial failed: ${result.error}`);
  }

  const plan = await getUserPlanDetails("verify@test.com");
  if (plan.plan !== "pro") {
    throw new Error(`expected pro, got ${plan.plan}`);
  }

  console.log("✓ launch trial grants pro");
  console.log(`✓ trialEndsAt=${plan.trialEndsAt}`);
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
