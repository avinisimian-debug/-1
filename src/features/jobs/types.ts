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
  pathname?: string;
  contentType?: string;
  /** Public YouTube (or media) URL when ingesting from link */
  sourceUrl?: string;
  sourceKind?: "youtube" | "url";
  /** AssemblyAI transcript id when using webhook async STT */
  assemblyaiTranscriptId?: string;
  /** Linked Live Hub meeting id (post-meeting pipeline) */
  meetingId?: string;
  /** Prefer speaker diarization when plan allows */
  forceDiarization?: boolean;
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
  audioBlobUrl?: string;
  pathname?: string;
  contentType?: string;
  sourceUrl?: string;
  sourceKind?: "youtube" | "url";
  meetingId?: string;
  /** Prefer speaker diarization when plan allows */
  forceDiarization?: boolean;
}

export interface TranscriptionJobPublic {
  id: string;
  status: JobStatus;
  fileName: string;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: unknown;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function toPublicJob(job: TranscriptionJob): TranscriptionJobPublic {
  return {
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    attempts: job.attempts,
    maxAttempts: job.maxAttempts,
    ...(job.error ? { error: job.error } : {}),
    ...(job.result !== undefined ? { result: job.result } : {}),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    ...(job.completedAt ? { completedAt: job.completedAt } : {}),
  };
}
