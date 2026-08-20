import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAuthSetupOrigins,
  getRuntimeAuthConfig,
  saveRuntimeAuthConfig,
} from "@/lib/auth-config-store";
import { getGoogleAuthMode, inspectGoogleClientId } from "@/lib/auth-oauth";

export const runtime = "nodejs";

function isAdmin(session: { user?: { email?: string | null; isAdmin?: boolean } } | null) {
  return Boolean(session?.user?.isAdmin);
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const config = await getRuntimeAuthConfig();
  const mode = await getGoogleAuthMode();
  const origins = getAuthSetupOrigins(request.headers.get("origin"));

  return NextResponse.json({
    configured: mode !== "none",
    mode,
    hasClientId: Boolean(inspectGoogleClientId(config.googleClientId).usable),
    hasClientSecret: Boolean(config.googleClientSecret),
    googleClientIdPreview: inspectGoogleClientId(config.googleClientId).usable
      ? `${config.googleClientId!.slice(0, 12)}...`
      : null,
    origins,
    consoleUrl:
      "https://console.cloud.google.com/apis/credentials/oauthclient",
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    googleClientId?: string;
    googleClientSecret?: string;
  };

  if (!inspectGoogleClientId(body.googleClientId).usable) {
    return NextResponse.json(
      { error: "Google Client ID is invalid (placeholder values are not accepted)." },
      { status: 400 },
    );
  }

  const saved = await saveRuntimeAuthConfig({
    googleClientId: body.googleClientId,
    googleClientSecret: body.googleClientSecret,
  });

  const mode = await getGoogleAuthMode();

  return NextResponse.json({
    success: true,
    configured: mode !== "none",
    mode,
    googleClientIdPreview: `${saved.googleClientId!.slice(0, 12)}...`,
  });
}
