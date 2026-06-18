import { getRuntimeAuthConfig } from "@/lib/auth-config-store";

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

let resolvedClientId: string | null | undefined;
let resolvedAt = 0;

/** Resolve Google client ID from runtime store + env (cached per request burst). */
export async function resolveGoogleClientId(): Promise<string | null> {
  if (resolvedClientId !== undefined && Date.now() - resolvedAt < 3_000) {
    return resolvedClientId;
  }

  const runtime = await getRuntimeAuthConfig();
  const clientId =
    runtime.googleClientId ??
    process.env.GOOGLE_CLIENT_ID ??
    process.env.AUTH_GOOGLE_ID ??
    process.env.GOOGLE_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  resolvedClientId = clientId?.trim() || null;
  resolvedAt = Date.now();
  return resolvedClientId;
}

/** Sync read for module init — env only. Runtime store resolved via API routes. */
export function getGoogleClientIdFromEnv(): string | null {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ??
    process.env.AUTH_GOOGLE_ID ??
    process.env.GOOGLE_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return clientId?.trim() || null;
}

/** Full OAuth (redirect flow) — requires client ID and secret. */
export async function getGoogleOAuthConfig(): Promise<GoogleOAuthConfig | null> {
  const runtime = await getRuntimeAuthConfig();
  const clientId = await resolveGoogleClientId();
  const clientSecret =
    runtime.googleClientSecret ??
    process.env.GOOGLE_CLIENT_SECRET ??
    process.env.AUTH_GOOGLE_SECRET ??
    process.env.GOOGLE_SECRET;

  if (!clientId || !clientSecret?.trim()) {
    return null;
  }

  return {
    clientId,
    clientSecret: clientSecret.trim(),
  };
}

export type GoogleAuthMode = "oauth" | "gis" | "none";

export async function getGoogleAuthMode(): Promise<GoogleAuthMode> {
  if (await getGoogleOAuthConfig()) return "oauth";
  if (await resolveGoogleClientId()) return "gis";
  return "none";
}

export async function isGoogleAuthConfigured(): Promise<boolean> {
  return (await getGoogleAuthMode()) !== "none";
}
