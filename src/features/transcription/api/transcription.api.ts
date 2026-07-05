import { upload } from "@vercel/blob/client";
import type { PlanTier } from "@/lib/constants";
import { VERCEL_DIRECT_UPLOAD_BYTES } from "@/lib/constants";
import { buildTranscribeBlobPath } from "@/lib/blob-file";
import type { ApiResponse } from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import {
  TRANSCRIPTION_API_PATH,
  TRANSCRIPTION_UPLOAD_PATH,
} from "../constants";
import type { TranscriptionResult } from "../types";

export interface UploadTranscriptionOptions {
  file: File;
  plan: PlanTier;
  userEmail?: string | null;
  language?: string;
  onUploadComplete?: () => void;
  onHeadersReceived?: () => void;
}

const REQUEST_TIMEOUT_MS = 290_000;

function isProductionHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "localhost" && !host.startsWith("127.");
}

function shouldUseBlobUpload(file: File): boolean {
  if (!isProductionHost()) return false;
  const isVideo =
    file.type.startsWith("video/") || /\.(mp4|m4v)$/i.test(file.name);
  return isVideo || file.size > VERCEL_DIRECT_UPLOAD_BYTES;
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
    return "UPLOAD_PAYLOAD_TOO_LARGE: File is too large for direct upload. Retry — large files are routed through secure upload.";
  }
  if (status === 504 || status === 408) {
    return "Processing timed out. Try a shorter recording.";
  }

  return "Transcription failed. Please try again.";
}

async function transcribeFromBlob({
  file,
  plan,
  userEmail,
  language = "auto",
  onUploadComplete,
  onHeadersReceived,
}: UploadTranscriptionOptions): Promise<Result<TranscriptionResult, Error>> {
  if (!userEmail) {
    return failure(
      new Error("Sign in required to upload large files."),
    );
  }

  const pathname = buildTranscribeBlobPath(userEmail, file.name);

  try {
    const blob = await upload(pathname, file, {
      access: "private",
      handleUploadUrl: TRANSCRIPTION_UPLOAD_PATH,
      multipart: true,
      contentType: file.type || undefined,
    });

    onUploadComplete?.();

    const controller = new AbortController();
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
          contentType: file.type || "application/octet-stream",
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
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return failure(
        new Error("Processing timed out. Try a shorter recording or upgrade to Pro."),
      );
    }

    return failure(
      new Error(
        error instanceof Error
          ? error.message
          : "Large file upload failed. Please try again.",
      ),
    );
  }
}

/** XHR upload preserves upload progress events for the processing UI. */
function transcribeDirectUpload({
  file,
  plan,
  language = "auto",
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

    xhr.upload.addEventListener("load", () => {
      onUploadComplete?.();
    });

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED && xhr.status === 200) {
        onHeadersReceived?.();
      }
    });

    xhr.addEventListener("load", () => {
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
        resolve(
          failure(new Error(parseErrorMessage({}, xhr.status))),
        );
      }
    });

    xhr.addEventListener("error", () => {
      resolve(
        failure(new Error("Network error. Check your connection and try again.")),
      );
    });

    xhr.addEventListener("timeout", () => {
      resolve(
        failure(
          new Error("Processing timed out. Try a shorter recording or upgrade to Pro."),
        ),
      );
    });

    xhr.send(formData);
  });
}

export function uploadTranscription(
  options: UploadTranscriptionOptions,
): Promise<Result<TranscriptionResult, Error>> {
  if (shouldUseBlobUpload(options.file)) {
    return transcribeFromBlob(options);
  }

  return transcribeDirectUpload(options);
}
