import { NextResponse } from "next/server";

type CacheVisibility = "public" | "private";

interface CacheOptions {
  /** Max age in seconds for CDN / shared caches */
  sMaxAge?: number;
  /** Max age in seconds for browser cache */
  maxAge?: number;
  /** Serve stale content while revalidating (seconds) */
  staleWhileRevalidate?: number;
  visibility?: CacheVisibility;
}

/**
 * Builds Cache-Control headers for API routes.
 *
 * Usage guide:
 * - Public static data (pricing, feature flags): public + long s-maxage
 * - Per-user data (plan, profile): private + short max-age
 * - Mutations / auth: no-store (use noCacheResponse)
 */
export function cacheHeaders(options: CacheOptions = {}): HeadersInit {
  const {
    sMaxAge = 0,
    maxAge = 0,
    staleWhileRevalidate,
    visibility = "private",
  } = options;

  const parts: string[] = [visibility];

  if (sMaxAge > 0) parts.push(`s-maxage=${sMaxAge}`);
  if (maxAge > 0) parts.push(`max-age=${maxAge}`);
  if (staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }

  return { "Cache-Control": parts.join(", ") };
}

export function noCacheResponse(): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
  };
}

export function jsonWithCache<T>(
  data: T,
  options: CacheOptions & { status?: number } = {},
): NextResponse<T> {
  const { status = 200, ...cache } = options;
  return NextResponse.json(data, {
    status,
    headers: cacheHeaders(cache),
  });
}
