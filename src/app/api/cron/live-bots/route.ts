import { NextRequest, NextResponse } from "next/server";
import { dispatchDueMeetings } from "@/features/live/server/bot-orchestrator";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Vercel Cron: dispatch meeting bots that are due to join.
 * Secure with Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (secret) {
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.VERCEL === "1") {
    // On Vercel, require CRON_SECRET when deployed
    const vercelCron = request.headers.get("x-vercel-cron");
    if (!vercelCron) {
      return NextResponse.json(
        { error: "CRON_SECRET or x-vercel-cron required" },
        { status: 401 },
      );
    }
  }

  const result = await dispatchDueMeetings(new Date());
  return NextResponse.json({
    ok: true,
    ...result,
    at: new Date().toISOString(),
  });
}
