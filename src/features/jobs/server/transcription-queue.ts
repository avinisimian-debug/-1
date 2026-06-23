import { randomUUID } from "crypto";
import type { EnqueueTranscriptionInput, TranscriptionJob } from "../types";

/**
 * Job queue abstraction — swap `InMemoryJobQueue` for Upstash QStash / Inngest in production.
 *
 * Pseudocode flow:
 *   POST /api/transcribe → store blob → enqueue(jobId) → 202 { jobId }
 *   QStash POST /api/jobs/process?jobId=… → transcribeAudio(blob) → save result
 *   Client polls GET /api/jobs/:id every 2s
 */

export interface JobQueue {
  enqueue(job: TranscriptionJob): Promise<void>;
  get(jobId: string): Promise<TranscriptionJob | null>;
  update(job: TranscriptionJob): Promise<void>;
}

const store = new Map<string, TranscriptionJob>();

export class InMemoryJobQueue implements JobQueue {
  async enqueue(job: TranscriptionJob): Promise<void> {
    store.set(job.id, job);
  }

  async get(jobId: string): Promise<TranscriptionJob | null> {
    return store.get(jobId) ?? null;
  }

  async update(job: TranscriptionJob): Promise<void> {
    store.set(job.id, job);
  }
}

export const jobQueue = new InMemoryJobQueue();

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 30_000, 120_000];

export async function enqueueTranscriptionJob(
  input: EnqueueTranscriptionInput,
): Promise<TranscriptionJob> {
  const now = new Date().toISOString();
  const job: TranscriptionJob = {
    id: randomUUID(),
    ownerEmail: input.ownerEmail,
    status: "queued",
    fileName: input.fileName,
    fileSize: input.fileSize,
    plan: input.plan,
    language: input.language,
    audioBlobUrl: input.audioBlobUrl,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: now,
    updatedAt: now,
  };

  await jobQueue.enqueue(job);

  /*
   * Production (QStash pseudocode):
   *
   * await qstash.publishJSON({
   *   url: `${APP_URL}/api/jobs/process`,
   *   body: { jobId: job.id },
   *   retries: MAX_ATTEMPTS - 1,
   *   delay: 0,
   * });
   */

  return job;
}

export function getRetryDelayMs(attempt: number): number {
  return RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
}

export async function markJobFailed(
  job: TranscriptionJob,
  error: string,
): Promise<TranscriptionJob> {
  const next: TranscriptionJob = {
    ...job,
    attempts: job.attempts + 1,
    error,
    updatedAt: new Date().toISOString(),
    status: job.attempts + 1 >= job.maxAttempts ? "failed" : "queued",
  };
  await jobQueue.update(next);

  /*
   * If status === "queued" after failure, re-enqueue with backoff:
   *
   * await qstash.publishJSON({
   *   url: `${APP_URL}/api/jobs/process`,
   *   body: { jobId: job.id },
   *   delay: getRetryDelayMs(next.attempts),
   * });
   */

  return next;
}

export async function processJobWithRetry(
  jobId: string,
  processor: (job: TranscriptionJob) => Promise<unknown>,
): Promise<TranscriptionJob> {
  const job = await jobQueue.get(jobId);
  if (!job) throw new Error("Job not found");

  const running: TranscriptionJob = {
    ...job,
    status: "processing",
    attempts: job.attempts + 1,
    updatedAt: new Date().toISOString(),
  };
  await jobQueue.update(running);

  try {
    const result = await processor(running);
    const completed: TranscriptionJob = {
      ...running,
      status: "completed",
      result,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      error: undefined,
    };
    await jobQueue.update(completed);
    return completed;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    return await markJobFailed(running, message);
  }
}
