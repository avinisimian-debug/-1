import { NextResponse } from "next/server";
import {
  getGoogleAuthMode,
  inspectGoogleAuthPublic,
  resolveGoogleClientId,
} from "@/lib/auth-oauth";

export const runtime = "nodejs";

/** Public auth flags. Never returns secrets. Never returns placeholder client IDs. */
export async function GET() {
  const mode = await getGoogleAuthMode();
  const clientId = await resolveGoogleClientId();
  const inspect = await inspectGoogleAuthPublic();

  return NextResponse.json({
    google: mode !== "none" && inspect.ok,
    mode: inspect.ok ? mode : "none",
    placeholderDetected: inspect.placeholderDetected,
    clientId: inspect.ok ? (clientId ?? undefined) : undefined,
  });
}
