import { put } from "@vercel/blob/client";
import type { PlanTier } from "@/lib/constants";
import { VERCEL_DIRECT_UPLOAD_BYTES } from "@/lib/constants";
import { buildTranscribeBlobPath } from "@/lib/blob-file";
import type { ApiResponse } from "@/shared/api";
import {
  failure,
  isFailure,
  isSuccess,
  success,
  type Result,
} from "@/shared/lib/result";
import {
  TRANSCRIPTION_API_PATH,
  TRANSCRIPTION_UPLOAD_PATH,
} from "../constants";
import type { TranscriptionResult } from "../types";

export interface UploadProgressInfo {
  /** 0–100 during file transfer */
  percent: number;
  loadedBytes: number;
  totalBytes: number;
  /** Estimated bytes per second (0 if unknown) */
  bytesPerSecond: number;
}

export interface UploadTranscriptionOptions {
  file: File;
  plan: PlanTier;
  userEmail?: string | null;
  language?: string;
  /** Prefer Blob multipart when available (large files / videos). */
  forceBlob?: boolean;
  signal?: AbortSignal;
  onUploadProgress?: (info: UploadProgressInfo) => void;
  onUploadComplete?: () => void;
  onHeadersReceived?: () => void;
}

const REQUEST_TIMEOUT_MS = 290_000;

function isVideoFile(file: File): boolean {
  return (
    file.type.startsWith("video/") ||
    /\.(mp4|m4v|mov|webm|mkv|avi)$/i.test(file.name)
  );
}

/** Use Blob for large payloads / video when we have a signed-in user. */
function shouldUseBlobUpload(
  file: File,
  userEmail?: string | null,
  forceBlob?: boolean,
): boolean {
  if (forceBlob) return Boolean(userEmail);
  if (!userEmail) return false;
  return isVideoFile(file) || file.size > VERCEL_DIRECT_UPLOAD_BYTES;
}

function parseErrorMessage(
  body:
    | ApiResponse<TranscriptionResult>
    | { error?: string | { message?: string; code?: string } },
  status: number,
): string {
  if ("error" in body && body.error) {
    if (typeof body.error === "string") return body.error;
    if (typeof body.error === "object" && body.error.message) {
      return body.error.message;
    }
  }

  if (status === 401) return "Sign in required to transcribe.";
  if (status === 413) {
    return "UPLOAD_PAYLOAD_TOO_LARGE";
  }
  if (status === 504 || status === 408) {
    return "Processing timed out. Try a shorter recording.";
  }

  return "Transcription failed. Please try again.";
}

function createProgressTracker(
  totalBytes: number,
  onUploadProgress?: (info: UploadProgressInfo) => void,
) {
  const startedAt = Date.now();
  let lastLoaded = 0;
  let lastAt = startedAt;

  return (loaded: number, total = totalBytes) => {
    const now = Date.now();
    const dt = Math.max(1, now - lastAt);
    const dl = Math.max(0, loaded - lastLoaded);
    const instantBps = (dl / dt) * 1000;
    const overallBps = (loaded / Math.max(1, now - startedAt)) * 1000;
    const bytesPerSecond = instantBps > 0 ? instantBps : overallBps;
    lastLoaded = loaded;
    lastAt = now;

    const safeTotal = total > 0 ? total : totalBytes;
    onUploadProgress?.({
      percent: safeTotal > 0 ? Math.min(100, Math.round((loaded / safeTotal) * 100)) : 0,
      loadedBytes: loaded,
      totalBytes: safeTotal,
      bytesPerSecond,
    });
  };
}

async function fetchBlobClientToken(
  pathname: string,
  multipart: boolean,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(TRANSCRIPTION_UPLOAD_PATH, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      type: "blob.generate-client-token",
      payload: {
        pathname,
        multipart,
        clientPayload: null,
      },
    }),
  });

  let body: { clientToken?: string; error?: string } = {};
  try {
    body = (await res.json()) as { clientToken?: string; error?: string };
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    const detail =
      typeof body.error === "string" && body.error.trim()
        ? body.error
        : `Upload authorization failed (${res.status}).`;

    // Only label true config/blob failures — not auth or validation errors.
    if (detail.includes("CONFIG_") || res.status === 503) {
      throw new Error(
        detail.includes("CONFIG_")
          ? detail
          : `CONFIG_BLOB_TOKEN: ${detail}`,
      );
    }
    if (res.status === 401) {
      throw new Error(detail || "Sign in required to upload large files.");
    }
    throw new Error(detail);
  }

  if (!body.clientToken) {
    throw new Error(
      "CONFIG_BLOB_TOKEN: Server did not return a Blob client token. Check BLOB_READ_WRITE_TOKEN in Vercel → Storage → Blob.",
    );
  }

  return body.clientToken;
}

function inferUploadContentType(file: File): string {
  if (file.type?.trim()) return file.type.trim();
  if (/\.mp4$/i.test(file.name) || /\.m4v$/i.test(file.name)) return "video/mp4";
  if (/\.webm$/i.test(file.name)) return "video/webm";
  if (/\.mov$/i.test(file.name)) return "video/quicktime";
  if (/\.mp3$/i.test(file.name)) return "audio/mpeg";
  if (/\.wav$/i.test(file.name)) return "audio/wav";
  if (/\.m4a$/i.test(file.name)) return "audio/mp4";
  return "application/octet-stream";
}

async function transcribeFromBlob({
  file,
  plan,
  userEmail,
  language = "auto",
  signal,
  onUploadProgress,
  onUploadComplete,
  onHeadersReceived,
}: UploadTranscriptionOptions): Promise<Result<TranscriptionResult, Error>> {
  if (!userEmail) {
    return failure(new Error("Sign in required to upload large files."));
  }

  const pathname = buildTranscribeBlobPath(userEmail, file.name);
  const track = createProgressTracker(file.size, onUploadProgress);
  const contentType = inferUploadContentType(file);

  try {
    // Fetch the token ourselves so real server errors surface (the Blob SDK
    // otherwise collapses every non-OK response into "Failed to retrieve the client token").
    const clientToken = await fetchBlobClientToken(pathname, true, signal);

    const blob = await put(pathname, file, {
      access: "private",
      token: clientToken,
      multipart: true,
      contentType,
      abortSignal: signal,
      onUploadProgress: (event) => {
        track(event.loaded, event.total || file.size);
      },
    });

    track(file.size, file.size);
    onUploadComplete?.();

    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort);
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(TRANSCRIPTION_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          blobUrl: blob.url,
          pathname: blob.pathname,
          fileName: file.name,
          contentType,
          ...(plan === "pro" && language !== "auto" ? { language } : {}),
        }),
      });

      onHeadersReceived?.();

      const body = (await response.json()) as ApiResponse<TranscriptionResult>;
      if (!response.ok || !body.data) {
        return failure(new Error(parseErrorMessage(body, response.status)));
      }

      return success(body.data);
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", onAbort);
    }
  } catch (error) {
    if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
      return failure(new Error("Upload cancelled."));
    }

    const message =
      error instanceof Error
        ? error.message
        : "Large file upload failed. Please try again.";

    if (
      message.toLowerCase().includes("failed to retrieve the client token") ||
      message.toLowerCase().includes("config_blob")
    ) {
      return failure(
        new Error(
          message.startsWith("CONFIG_")
            ? message
            : `CONFIG_BLOB_TOKEN: ${message}. In Vercel: Storage → Blob → Connect to this project, ensure BLOB_READ_WRITE_TOKEN is set, then Redeploy.`,
        ),
      );
    }

    return failure(new Error(message));
  }
}

/** XHR upload with real byte progress for small direct uploads. */
function transcribeDirectUpload({
  file,
  plan,
  language = "auto",
  signal,
  onUploadProgress,
  onUploadComplete,
  onHeadersReceived,
}: UploadTranscriptionOptions): Promise<Result<TranscriptionResult, Error>> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    if (plan === "pro" && language !== "auto") {
      formData.append("language", language);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", TRANSCRIPTION_API_PATH);
    xhr.withCredentials = true;
    xhr.timeout = REQUEST_TIMEOUT_MS;

    const track = createProgressTracker(file.size, onUploadProgress);

    const onAbort = () => {
      xhr.abort();
    };
    signal?.addEventListener("abort", onAbort);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      track(event.loaded, event.total);
    });

    xhr.upload.addEventListener("load", () => {
      track(file.size, file.size);
      onUploadComplete?.();
    });

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED && xhr.status === 200) {
        onHeadersReceived?.();
      }
    });

    xhr.addEventListener("load", () => {
      signal?.removeEventListener("abort", onAbort);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as ApiResponse<TranscriptionResult>;
          if (!body.data) {
            resolve(failure(new Error(parseErrorMessage(body, xhr.status))));
            return;
          }
          resolve(success(body.data));
        } catch {
          resolve(failure(new Error("Failed to parse the server response.")));
        }
        return;
      }

      try {
        const body = JSON.parse(xhr.responseText) as ApiResponse<TranscriptionResult>;
        resolve(failure(new Error(parseErrorMessage(body, xhr.status))));
      } catch {
        resolve(failure(new Error(parseErrorMessage({}, xhr.status))));
      }
    });

    xhr.addEventListener("error", () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(
        failure(new Error("Network error. Check your connection and try again.")),
      );
    });

    xhr.addEventListener("abort", () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(failure(new Error("Upload cancelled.")));
    });

    xhr.addEventListener("timeout", () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(
        failure(
          new Error("Processing timed out. Try a shorter recording or upgrade to Pro."),
        ),
      );
    });

    xhr.send(formData);
  });
}

/**
 * Upload + transcribe with Blob for video/large files, and safe fallbacks.
 */
export async function uploadTranscription(
  options: UploadTranscriptionOptions,
): Promise<Result<TranscriptionResult, Error>> {
  const preferBlob = shouldUseBlobUpload(
    options.file,
    options.userEmail,
    options.forceBlob,
  );

  if (preferBlob) {
    const blobResult = await transcribeFromBlob(options);
    if (isSuccess(blobResult)) return blobResult;

    // Small files can fall back to direct upload if Blob token route is broken.
    if (
      options.file.size <= VERCEL_DIRECT_UPLOAD_BYTES &&
      isBlobTokenFailure(blobResult)
    ) {
      console.warn(
        "[transcription] Blob token failed; falling back to direct upload",
        blobResult.error.message,
      );
      return transcribeDirectUpload(options);
    }

    return blobResult;
  }

  const direct = await transcribeDirectUpload(options);
  if (isFailureWithPayloadTooLarge(direct) && options.userEmail) {
    return transcribeFromBlob({ ...options, forceBlob: true });
  }

  return direct;
}

function isBlobTokenFailure(
  result: Result<TranscriptionResult, Error>,
): boolean {
  if (!isFailure(result)) return false;
  const msg = result.error.message.toLowerCase();
  return (
    msg.includes("failed to retrieve the client token") ||
    msg.includes("config_blob")
  );
}

function isFailureWithPayloadTooLarge(
  result: Result<TranscriptionResult, Error>,
): boolean {
  return (
    isFailure(result) &&
    (result.error.message.includes("UPLOAD_PAYLOAD_TOO_LARGE") ||
      result.error.message.toLowerCase().includes("too large"))
  );
}
