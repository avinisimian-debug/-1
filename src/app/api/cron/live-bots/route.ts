import { NextRequest, NextResponse } from "next/server";
import { dispatchDueMeetings } from "@/features/live/server/bot-orchestrator";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Vercel Cron: dispatch meeting bots that are due to join.
 * Schedule: every minute (Pro). On Hobby, Vercel may only fire once/day —
 * Live Hub also heartbeats POST /api/live/dispatch every 30s as backup.
 * Secure with Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const vercelCron = request.headers.get("x-vercel-cron");

  if (secret) {
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (vercelCron && process.env.VERCEL === "1") {
    // Vercel invokes cron with x-vercel-cron when CRON_SECRET is unset.
  } else {
    // Fail closed: never open dispatch without a secret outside verified cron.
    return NextResponse.json(
      { error: "CRON_SECRET required" },
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
