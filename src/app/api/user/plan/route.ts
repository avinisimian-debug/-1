import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isLaunchWeekActive } from "@/lib/constants";
import { getUserPlanDetails } from "@/lib/users-store";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const details = await getUserPlanDetails(session.user.email);

  return NextResponse.json({
    plan: details.plan,
    launchWeekActive: isLaunchWeekActive(),
    trialEndsAt: details.trialEndsAt,
    subscriptionStatus: details.subscriptionStatus,
    onIntroPricing: details.onIntroPricing,
    hasSubscription: details.hasSubscription,
    needsPayPalSetup: details.needsPayPalSetup,
    proLifetime: details.proLifetime,
  });
}
