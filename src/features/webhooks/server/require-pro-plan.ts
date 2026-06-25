import { getUserPlan } from "@/lib/users-store";
import { hasFeature } from "@/lib/plan-features";
import { ForbiddenError } from "@/shared/api/errors";

/**
 * Ensures the authenticated user has an active Pro subscription.
 * Replace `hasFeature` with your billing provider check if needed.
 */
export async function requireProPlan(email: string): Promise<"pro"> {
  const plan = await getUserPlan(email);
  if (!hasFeature(plan, "transcriptionWebhooks")) {
    throw new ForbiddenError("Webhooks require a Pro plan.");
  }
  return "pro";
}

export function formatPlanLabel(plan: string): string {
  return plan === "pro" ? "Pro" : plan;
}
