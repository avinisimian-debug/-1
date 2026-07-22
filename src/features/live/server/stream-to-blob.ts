import { put } from "@vercel/blob";

const MAX_REMOTE_RECORDING_BYTES = 500 * 1024 * 1024;

/**
 * Stream a remote recording URL into Vercel Blob without buffering the full file
 * in memory (avoids OOM on large meeting recordings).
 */
export async function streamRemoteUrlToBlob(input: {
  sourceUrl: string;
  pathname: string;
  contentType?: string;
}): Promise<{ url: string; pathname: string; size: number; contentType: string }> {
  const res = await fetch(input.sourceUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(240_000),
  });

  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }

  const contentType =
    input.contentType ||
    res.headers.get("content-type") ||
    "video/mp4";

  const lengthHeader = res.headers.get("content-length");
  const declaredSize = lengthHeader ? Number(lengthHeader) : NaN;
  if (Number.isFinite(declaredSize) && declaredSize > MAX_REMOTE_RECORDING_BYTES) {
    throw new Error(
      `Recording exceeds ${Math.round(MAX_REMOTE_RECORDING_BYTES / (1024 * 1024))} MB limit.`,
    );
  }

  if (!res.body) {
    throw new Error("Remote recording has no response body.");
  }

  const blob = await put(input.pathname, res.body, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    multipart: true,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    size: Number.isFinite(declaredSize) ? declaredSize : 0,
    contentType,
  };
}
