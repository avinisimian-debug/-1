import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLivePipelineStatus } from "@/features/live/server/pipeline-status";

export const runtime = "nodejs";

/**
 * Authenticated readiness for Live Hub (no secrets leaked).
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
      { status: 401 },
    );
  }

  return NextResponse.json({
    data: getLivePipelineStatus(),
  });
}
