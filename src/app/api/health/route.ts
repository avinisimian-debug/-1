import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runSystemHealthCheck } from "@/lib/system-health-check";

export const runtime = "nodejs";

/**
 * GET /api/health
 * Public summary (no secrets). Full per-check detail when `?verbose=1` and admin session.
 * GET /api/health?probe=0 — skip outbound webhook self-probe (faster).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const probeWebhook = searchParams.get("probe") !== "0";
  const verbose = searchParams.get("verbose") === "1";

  const session = verbose ? await auth() : null;
  const isAdmin = Boolean(session?.user?.isAdmin);

  const report = await runSystemHealthCheck({ probeWebhook });

  const publicChecks = report.checks.map((check) => ({
    name: check.name,
    status: check.status,
    latencyMs: check.latencyMs,
    message: isAdmin || check.name !== "openai" ? check.message : summarize(check.message),
  }));

  return NextResponse.json(
    {
      ok: report.status === "healthy",
      status: report.status,
      checkedAt: report.checkedAt,
      checks: isAdmin
        ? report.checks
        : publicChecks,
    },
    { status: report.status === "unhealthy" ? 503 : 200 },
  );
}

function summarize(message: string): string {
  if (message.toLowerCase().includes("valid")) return "API key OK.";
  if (message.toLowerCase().includes("not configured")) return "Not configured.";
  return message.slice(0, 120);
}
