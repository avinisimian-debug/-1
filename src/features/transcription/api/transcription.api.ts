import type { PlanTier } from "@/lib/constants";
import type { ApiResponse } from "@/shared/api";
import { failure, success, type Result } from "@/shared/lib/result";
import { TRANSCRIPTION_API_PATH } from "../constants";
import type { TranscriptionResult } from "../types";

export interface UploadTranscriptionOptions {
  file: File;
  plan: PlanTier;
  language?: string;
  onUploadComplete?: () => void;
  onHeadersReceived?: () => void;
}

const REQUEST_TIMEOUT_MS = 290_000;

function parseErrorMessage(
  body: ApiResponse<TranscriptionResult> | { error?: string | { message?: string; code?: string } },
  status: number,
): string {
  if ("error" in body && body.error) {
    if (typeof body.error === "string") return body.error;
    if (typeof body.error === "object" && body.error.message) {
      return body.error.message;
    }
  }

  if (status === 401) return "Sign in required to transcribe.";
  if (status === 413) return "File too large for upload.";
  if (status === 504 || status === 408) {
    return "Processing timed out. Try a shorter recording.";
  }

  return "Transcription failed. Please try again.";
}

/** XHR upload preserves upload progress events for the processing UI. */
export function uploadTranscription({
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
