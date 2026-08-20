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
  const candidates = [
    runtime.googleClientId,
    process.env.GOOGLE_CLIENT_ID,
    process.env.AUTH_GOOGLE_ID,
    process.env.GOOGLE_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  ];
  resolvedClientId = firstUsableGoogleClientId(candidates);
  resolvedAt = Date.now();
  return resolvedClientId;
}

export function inspectGoogleClientId(clientId: string | undefined | null): {
  usable: string | null;
  placeholderDetected: boolean;
} {
  const trimmed = clientId?.trim() || "";
  if (!trimmed) {
    return { usable: null, placeholderDetected: false };
  }
  const lower = trimmed.toLowerCase();
  const placeholderDetected =
    lower.includes("your-google") ||
    lower.includes("placeholder") ||
    lower === "changeme" ||
    !trimmed.includes(".apps.googleusercontent.com");
  if (placeholderDetected) {
    return { usable: null, placeholderDetected: true };
  }
  return { usable: trimmed, placeholderDetected: false };
}

function firstUsableGoogleClientId(
  candidates: Array<string | undefined | null>,
): string | null {
  for (const candidate of candidates) {
    const usable = inspectGoogleClientId(candidate).usable;
    if (usable) return usable;
  }
  return null;
}

export async function inspectGoogleAuthPublic(): Promise<{
  configured: boolean;
  placeholderDetected: boolean;
  ok: boolean;
}> {
  const runtime = await getRuntimeAuthConfig();
  const candidates = [
    runtime.googleClientId,
    process.env.GOOGLE_CLIENT_ID,
    process.env.AUTH_GOOGLE_ID,
    process.env.GOOGLE_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  ];
  const placeholderDetected = candidates.some(
    (candidate) => inspectGoogleClientId(candidate).placeholderDetected,
  );
  const clientId = firstUsableGoogleClientId(candidates);
  const secret = Boolean(
    (
      runtime.googleClientSecret ??
      process.env.GOOGLE_CLIENT_SECRET ??
      process.env.AUTH_GOOGLE_SECRET ??
      process.env.GOOGLE_SECRET
    )?.trim(),
  );
  const configured = Boolean(clientId && secret);
  return {
    configured,
    placeholderDetected,
    ok: configured && !placeholderDetected,
  };
}

/** Sync read for module init — env only. Runtime store resolved via API routes. */
export function getGoogleClientIdFromEnv(): string | null {
  return firstUsableGoogleClientId([
    process.env.GOOGLE_CLIENT_ID,
    process.env.AUTH_GOOGLE_ID,
    process.env.GOOGLE_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  ]);
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
