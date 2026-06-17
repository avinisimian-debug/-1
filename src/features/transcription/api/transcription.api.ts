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

function parseErrorMessage(
  body: ApiResponse<TranscriptionResult> | { error?: string | { message?: string } },
): string {
  if ("error" in body && body.error) {
    if (typeof body.error === "string") return body.error;
    if (typeof body.error === "object" && body.error.message) {
      return body.error.message;
    }
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
    formData.append("plan", plan);
    if (plan === "pro" && language !== "auto") {
      formData.append("language", language);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", TRANSCRIPTION_API_PATH);

    xhr.upload.addEventListener("load", () => {
      onUploadComplete?.();
    });

    xhr.addEventListener("readystatechange", () => {
      if (
        xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED &&
        xhr.status === 200
      ) {
        onHeadersReceived?.();
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as ApiResponse<TranscriptionResult>;
          if (!body.data) {
            resolve(failure(new Error(parseErrorMessage(body))));
            return;
          }
          resolve(success(body.data));
        } catch {
          resolve(failure(new Error("Failed to parse the server response.")));
        }
        return;
      }

      try {
        const body = JSON.parse(xhr.responseText) as
          | ApiResponse<TranscriptionResult>
          | { error?: string };
        resolve(failure(new Error(parseErrorMessage(body))));
      } catch {
        resolve(failure(new Error("Transcription failed. Please try again.")));
      }
    });

    xhr.addEventListener("error", () => {
      resolve(
        failure(new Error("Network error. Check your connection and try again.")),
      );
    });

    xhr.send(formData);
  });
}
