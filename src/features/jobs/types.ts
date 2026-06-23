export type JobStatus =
  | "queued"
  | "processing"
  | "transcribing"
  | "analyzing"
  | "completed"
  | "failed";

export interface TranscriptionJob {
  id: string;
  ownerEmail: string;
  status: JobStatus;
  fileName: string;
  fileSize: number;
  plan: "free" | "pro";
  language: string;
  /** Vercel Blob URL for uploaded audio */
  audioBlobUrl?: string;
  result?: unknown;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface EnqueueTranscriptionInput {
  ownerEmail: string;
  fileName: string;
  fileSize: number;
  plan: "free" | "pro";
  language: string;
  audioBlobUrl: string;
}
