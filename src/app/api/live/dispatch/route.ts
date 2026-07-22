import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dispatchDueMeetings } from "@/features/live/server/bot-orchestrator";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Authenticated heartbeat for Live Hub.
 * Compensates for Vercel Hobby cron (once/day) by letting open hub tabs
 * dispatch due bots every ~60s.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
      { status: 401 },
    );
  }

  const result = await dispatchDueMeetings(new Date());
  return NextResponse.json({
    ok: true,
    ...result,
    at: new Date().toISOString(),
  });
}
