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
  TRANSCRIPTION_FROM_URL_PATH,
  TRANSCRIPTION_JOBS_PATH,
  TRANSCRIPTION_STATUS_PATH,
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

export type JobProgressStage =
  | "queued"
  | "transcribing"
  | "analyzing"
  | "completed";

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
  /** Async job progress: queued → transcribing → analyzing → completed. */
  onJobStage?: (stage: JobProgressStage) => void;
}

const REQUEST_TIMEOUT_MS = 290_000;
const JOB_POLL_INTERVAL_MS = 2_500;
/** Allow long AssemblyAI + GPT pipelines (webhook + poll). */
const JOB_POLL_MAX_MS = 900_000;
const RETRY_ATTEMPTS = 3;

function mapJobStatusToStage(status: string): JobProgressStage | null {
  switch (status) {
    case "queued":
    case "processing":
      return "queued";
    case "transcribing":
      return "transcribing";
    case "analyzing":
      return "analyzing";
    case "completed":
      return "completed";
    default:
      return null;
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    signal?: AbortSignal;
    label?: string;
  } = {},
): Promise<T> {
  const attempts = options.attempts ?? RETRY_ATTEMPTS;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (options.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.name === "AbortError") throw error;
      const retryableFlag = (error as Error & { retryable?: boolean }).retryable;
      if (retryableFlag === false) throw error;
      const message = error instanceof Error ? error.message : "";
      if (message.startsWith("CONFIG_") || message.includes("Sign in required")) {
        throw error;
      }
      if (attempt >= attempts - 1) break;
      const delay = 500 * 2 ** attempt;
      console.warn(
        `[transcription] ${options.label ?? "request"} failed (attempt ${attempt + 1}/${attempts}), retrying in ${delay}ms`,
        message || error,
      );
      await sleep(delay, options.signal);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Request failed after retries.");
}

/**
 * Use Blob only when the payload exceeds Vercel's serverless body limit.
 */
function shouldUseBlobUpload(
  file: File,
  userEmail?: string | null,
  forceBlob?: boolean,
): boolean {
  if (forceBlob) return Boolean(userEmail);
  if (!userEmail) return false;
  return file.size > VERCEL_DIRECT_UPLOAD_BYTES;
}

async function fetchUploadReadiness(): Promise<{
  blob: boolean;
  openai: boolean;
  assemblyai: boolean;
  hint: string;
}> {
  try {
    const res = await fetch(TRANSCRIPTION_STATUS_PATH, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    const body = (await res.json()) as {
      blob?: boolean;
      openai?: boolean;
      assemblyai?: boolean;
      hint?: string;
    };
    return {
      blob: Boolean(body.blob),
      openai: Boolean(body.openai),
      assemblyai: Boolean(body.assemblyai),
      hint:
        typeof body.hint === "string"
          ? body.hint
          : "Check Vercel environment variables.",
    };
  } catch {
    return {
      blob: false,
      openai: true,
      assemblyai: false,
      hint: "Could not reach upload readiness probe.",
    };
  }
}

const BLOB_MISSING_ERROR =
  "CONFIG_BLOB_MISSING: Large video/meeting uploads require Vercel Blob. In Vercel Dashboard: Storage → Create/Connect Blob → ensure BLOB_READ_WRITE_TOKEN is set for Production → Redeploy. Files under ~4 MB can still upload without Blob.";

function parseErrorMessage(
  body: {
    error?: string | { message?: string; code?: string } | null;
  },
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
  return withRetry(
    async () => {
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
        if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
          const err = new Error(detail) as Error & { retryable?: boolean };
          err.retryable = false;
          throw err;
        }
        throw new Error(detail);
      }

      if (!body.clientToken) {
        throw new Error(
          "CONFIG_BLOB_TOKEN: Server did not return a Blob client token. Check BLOB_READ_WRITE_TOKEN in Vercel → Storage → Blob.",
        );
      }

      return body.clientToken;
    },
    { signal, label: "blob-token", attempts: RETRY_ATTEMPTS },
  );
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

async function pollTranscriptionJob(
  jobId: string,
  signal?: AbortSignal,
  onHeadersReceived?: () => void,
  onJobStage?: (stage: JobProgressStage) => void,
): Promise<Result<TranscriptionResult, Error>> {
  const started = Date.now();
  let notified = false;
  let lastStage: JobProgressStage | null = null;

  while (Date.now() - started < JOB_POLL_MAX_MS) {
    if (signal?.aborted) {
      return failure(new Error("Upload cancelled."));
    }

    const response = await fetch(`${TRANSCRIPTION_JOBS_PATH}/${jobId}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    });

    const body = (await response.json()) as ApiResponse<{
      id: string;
      status: string;
      error?: string;
      result?: TranscriptionResult;
    }>;

    if (!response.ok || !body.data) {
      return failure(new Error(parseErrorMessage(body, response.status)));
    }

    const job = body.data;
    const mapped = mapJobStatusToStage(job.status);
    if (mapped && mapped !== lastStage) {
      lastStage = mapped;
      onJobStage?.(mapped);
      if (mapped === "transcribing" || mapped === "analyzing") {
        if (!notified) {
          onHeadersReceived?.();
          notified = true;
        }
      }
    }

    if (job.status === "completed" && job.result) {
      onJobStage?.("completed");
      return success(job.result);
    }

    if (job.status === "failed") {
      return failure(
        new Error(job.error || "Transcription job failed. Please try again."),
      );
    }

    await sleep(JOB_POLL_INTERVAL_MS, signal);
  }

  return failure(
    new Error("Processing timed out. Try a shorter recording or upgrade to Pro."),
  );
}

async function transcribeFromBlob({
  file,
  userEmail,
  language = "auto",
  signal,
  onUploadProgress,
  onUploadComplete,
  onHeadersReceived,
  onJobStage,
}: UploadTranscriptionOptions): Promise<Result<TranscriptionResult, Error>> {
  if (!userEmail) {
    return failure(new Error("Sign in required to upload large files."));
  }

  const pathname = buildTranscribeBlobPath(userEmail, file.name);
  const track = createProgressTracker(file.size, onUploadProgress);
  const contentType = inferUploadContentType(file);

  try {
    const clientToken = await fetchBlobClientToken(pathname, true, signal);

    const blob = await withRetry(
      () =>
        put(pathname, file, {
          access: "private",
          token: clientToken,
          multipart: true,
          contentType,
          abortSignal: signal,
          onUploadProgress: (event) => {
            track(event.loaded, event.total || file.size);
          },
        }),
      { signal, label: "blob-put", attempts: 2 },
    );

    track(file.size, file.size);
    onUploadComplete?.();
    onJobStage?.("queued");

    // Async job path avoids gateway timeouts on long STT + GPT analysis.
    const enqueue = await withRetry(
      async () => {
        const response = await fetch(TRANSCRIPTION_JOBS_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal,
          body: JSON.stringify({
            blobUrl: blob.url,
            pathname: blob.pathname,
            fileName: file.name,
            contentType,
            fileSize: file.size,
            ...(language !== "auto" ? { language } : {}),
          }),
        });

        const body = (await response.json()) as ApiResponse<{ id: string }>;
        if ((!response.ok && response.status !== 202) || !body.data?.id) {
          throw new Error(parseErrorMessage(body, response.status));
        }
        return body.data.id;
      },
      { signal, label: "enqueue-job", attempts: 2 },
    );

    return pollTranscriptionJob(enqueue, signal, onHeadersReceived, onJobStage);
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
  language = "auto",
  signal,
  onUploadProgress,
  onUploadComplete,
  onHeadersReceived,
}: UploadTranscriptionOptions): Promise<Result<TranscriptionResult, Error>> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    if (language !== "auto") {
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
 * Upload + transcribe. Uses direct upload under ~4 MB; Blob + async job for larger files.
 */
export async function uploadTranscription(
  options: UploadTranscriptionOptions,
): Promise<Result<TranscriptionResult, Error>> {
  const needsBlob =
    options.forceBlob ||
    options.file.size > VERCEL_DIRECT_UPLOAD_BYTES;

  if (needsBlob) {
    const readiness = await fetchUploadReadiness();
    if (!readiness.openai) {
      return failure(
        new Error(
          "CONFIG_OPENAI_MISSING: Transcription is not configured (OPENAI_API_KEY). Set it in Vercel → Environment Variables, then Redeploy.",
        ),
      );
    }
    if (!readiness.blob) {
      if (options.file.size <= VERCEL_DIRECT_UPLOAD_BYTES) {
        return transcribeDirectUpload(options);
      }
      return failure(new Error(`${BLOB_MISSING_ERROR} ${readiness.hint}`));
    }
  }

  const preferBlob = shouldUseBlobUpload(
    options.file,
    options.userEmail,
    options.forceBlob,
  );

  if (preferBlob) {
    const blobResult = await transcribeFromBlob(options);
    if (isSuccess(blobResult)) return blobResult;

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

    if (isBlobTokenFailure(blobResult)) {
      return failure(
        new Error(
          blobResult.error.message.includes("CONFIG_")
            ? blobResult.error.message
            : `${BLOB_MISSING_ERROR} (${blobResult.error.message})`,
        ),
      );
    }

    return blobResult;
  }

  const direct = await transcribeDirectUpload(options);
  if (isFailureWithPayloadTooLarge(direct) && options.userEmail) {
    const readiness = await fetchUploadReadiness();
    if (!readiness.blob) {
      return failure(new Error(BLOB_MISSING_ERROR));
    }
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

export interface TranscribeFromUrlOptions {
  url: string;
  plan: PlanTier;
  language?: string;
  signal?: AbortSignal;
  onUploadProgress?: (info: UploadProgressInfo) => void;
  onUploadComplete?: () => void;
  onHeadersReceived?: () => void;
}

/** Transcribe a public media / platform URL. */
export async function transcribeFromUrl({
  url,
  plan,
  language = "auto",
  signal,
  onUploadProgress,
  onUploadComplete,
  onHeadersReceived,
}: TranscribeFromUrlOptions): Promise<Result<TranscriptionResult, Error>> {
  const track = createProgressTracker(100, onUploadProgress);
  track(10, 100);

  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    track(35, 100);
    const response = await fetch(TRANSCRIPTION_FROM_URL_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify({
        url,
        ...(language !== "auto" ? { language } : {}),
        plan,
      }),
    });

    track(90, 100);
    onUploadComplete?.();
    onHeadersReceived?.();

    const body = (await response.json()) as ApiResponse<TranscriptionResult>;
    if (!response.ok || !body.data) {
      return failure(new Error(parseErrorMessage(body, response.status)));
    }

    track(100, 100);
    return success(body.data);
  } catch (error) {
    if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
      return failure(new Error("Upload cancelled."));
    }
    return failure(
      new Error(
        error instanceof Error
          ? error.message
          : "Link transcription failed. Please try again.",
      ),
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
  }
}
