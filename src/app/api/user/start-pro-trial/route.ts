import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isLaunchWeekActive } from "@/lib/constants";
import { getUserPlanDetails, startProTrial } from "@/lib/users-store";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!isLaunchWeekActive()) {
      return NextResponse.json(
        { error: "Launch week trial is no longer available." },
        { status: 400 },
      );
    }

    const details = await startProTrial(session.user.email);

    return NextResponse.json({
      success: true,
      ...details,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start trial.";
    const status = message.includes("already") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const details = await getUserPlanDetails(session.user.email);

  return NextResponse.json({
    launchWeekActive: isLaunchWeekActive(),
    ...details,
  });
}
