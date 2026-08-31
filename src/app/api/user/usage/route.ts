import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLAN_LIMITS } from "@/lib/constants";
import { getServerUsageCount } from "@/lib/usage-server";
import { syncUserPlanOnAccess } from "@/lib/users-store";

/** Authoritative monthly usage for the signed-in user (matches transcribe enforcement). */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = session.user.email;
  const plan = await syncUserPlanOnAccess(email, session.user.name ?? undefined);
  const count = await getServerUsageCount(email);
  const limits = PLAN_LIMITS[plan];

  return NextResponse.json({
    plan,
    count,
    limit: limits.transcriptionsPerMonth,
    maxFileSizeLabel: limits.maxFileSizeLabel,
    remaining: Math.max(0, limits.transcriptionsPerMonth - count),
  });
}
