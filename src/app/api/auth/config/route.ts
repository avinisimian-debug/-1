import { NextResponse } from "next/server";
import { getGoogleAuthMode, getGoogleClientId } from "@/lib/auth-oauth";

export const runtime = "nodejs";

/** Public auth capability flags for the login UI. */
export async function GET() {
  const mode = getGoogleAuthMode();
  const clientId = getGoogleClientId();

  return NextResponse.json({
    google: mode !== "none",
    mode,
    clientId: mode === "gis" ? clientId : undefined,
  });
}
