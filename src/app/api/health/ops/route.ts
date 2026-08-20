import { NextResponse } from "next/server";
import { checkPersistenceLayer } from "@/lib/system-health-check";
import { resendConfigured } from "@/lib/runtime-env";
import { inspectGoogleAuthPublic } from "@/lib/auth-oauth";

/** Non-secret ops flags for launch configuration. */
export async function GET() {
  const persistence = await checkPersistenceLayer();
  const google = await inspectGoogleAuthPublic();
  const resend = resendConfigured();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const blobReachable =
    persistence.status === "healthy" && blobConfigured;
  const blobOk = blobReachable;

  return NextResponse.json({
    resend: {
      configured: resend,
      ok: resend,
    },
    blob: {
      configured: blobConfigured,
      reachable: blobReachable,
      ok: blobOk,
    },
    google: {
      configured: google.configured,
      placeholderDetected: google.placeholderDetected,
      ok: google.ok,
    },
  });
}
