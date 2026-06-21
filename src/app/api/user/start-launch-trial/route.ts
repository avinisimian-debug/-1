import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { startLaunchTrial } from "@/lib/users-store";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const result = await startLaunchTrial(session.user.email);

  if (!result.ok) {
    const status =
      result.error === "user_not_found"
        ? 404
        : result.error === "launch_ended"
          ? 400
          : 409;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true, plan: "pro" });
}
