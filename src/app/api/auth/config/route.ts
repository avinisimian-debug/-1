import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthMode, resolveGoogleClientId } from "@/lib/auth-oauth";

export const runtime = "nodejs";

/** Public auth capability flags for the login UI. */
export async function GET() {
  const mode = await getGoogleAuthMode();
  const clientId = await resolveGoogleClientId();

  return NextResponse.json({
    google: mode !== "none",
    mode,
    clientId: mode === "gis" ? clientId : undefined,
  });
}
