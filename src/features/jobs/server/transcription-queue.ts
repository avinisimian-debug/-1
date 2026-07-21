import { randomUUID } from "crypto";
import { get, put } from "@vercel/blob";
import type { EnqueueTranscriptionInput, TranscriptionJob } from "../types";

/**
 * Job queue — in-memory + Vercel Blob when BLOB_READ_WRITE_TOKEN is set
 * so polling works across serverless instances.
 *
 * Flow:
 *   POST /api/transcribe/jobs → enqueue → waitUntil(process) → 202 { jobId }
 *   Client polls GET /api/transcribe/jobs/:id every 2s
 */

export interface JobQueue {
  enqueue(job: TranscriptionJob): Promise<void>;
  get(jobId: string): Promise<TranscriptionJob | null>;
  update(job: TranscriptionJob): Promise<void>;
}

const memory = new Map<string, TranscriptionJob>();

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function jobBlobPath(jobId: string): string {
  return `meetscribe/jobs/${jobId}.json`;
}

async function persistJob(job: TranscriptionJob): Promise<void> {
  memory.set(job.id, job);
  if (!useBlobStorage()) return;

  await put(jobBlobPath(job.id), JSON.stringify(job), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function loadJob(jobId: string): Promise<TranscriptionJob | null> {
  const cached = memory.get(jobId);
  if (cached) return cached;

  if (!useBlobStorage()) return null;

  try {
    const result = await get(jobBlobPath(jobId), { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    const raw = await new Response(result.stream).text();
    const job = JSON.parse(raw) as TranscriptionJob;
    memory.set(job.id, job);
    return job;
  } catch {
    return null;
  }
}

export class PersistentJobQueue implements JobQueue {
  async enqueue(job: TranscriptionJob): Promise<void> {
    await persistJob(job);
  }

  async get(jobId: string): Promise<TranscriptionJob | null> {
    return loadJob(jobId);
  }

  async update(job: TranscriptionJob): Promise<void> {
    await persistJob({ ...job, updatedAt: new Date().toISOString() });
  }
}

export const jobQueue = new PersistentJobQueue();

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 5_000, 15_000];

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
    pathname: input.pathname,
    contentType: input.contentType,
    meetingId: input.meetingId,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: now,
    updatedAt: now,
  };

  await jobQueue.enqueue(job);
  return job;
}

export function getRetryDelayMs(attempt: number): number {
  return RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
}

export async function markJobFailed(
  job: TranscriptionJob,
  error: string,
): Promise<TranscriptionJob> {
  const attempts = job.attempts + 1;
  const next: TranscriptionJob = {
    ...job,
    attempts,
    error,
    updatedAt: new Date().toISOString(),
    status: attempts >= job.maxAttempts ? "failed" : "queued",
  };
  await jobQueue.update(next);
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
