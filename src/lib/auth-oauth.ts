export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

/** Public Google client ID — safe to expose to the browser. */
export function getGoogleClientId(): string | null {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ??
    process.env.AUTH_GOOGLE_ID ??
    process.env.GOOGLE_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return clientId?.trim() || null;
}

/** Full OAuth (redirect flow) — requires client ID and secret. */
export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = getGoogleClientId();
  const clientSecret =
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

export function getGoogleAuthMode(): GoogleAuthMode {
  if (getGoogleOAuthConfig()) return "oauth";
  if (getGoogleClientId()) return "gis";
  return "none";
}

export function isGoogleAuthConfigured(): boolean {
  return getGoogleAuthMode() !== "none";
}
