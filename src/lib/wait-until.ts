import { after } from "next/server";
import { waitUntil as vercelWaitUntil } from "@vercel/functions";

type BackgroundTask = Promise<unknown> | (() => Promise<unknown>);

function toPromise(task: BackgroundTask): Promise<unknown> {
  if (typeof task !== "function") {
    return task;
  }

  try {
    return Promise.resolve(task());
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Schedules background work to continue after the HTTP response is sent.
 *
 * - **Vercel / production:** uses `@vercel/functions` `waitUntil` when a request
 *   context is available (extends serverless function lifetime).
 * - **Local / fallback:** uses Next.js `after()` so tasks still run without
 *   blocking the response.
 *
 * Never blocks the caller — returns immediately after scheduling.
 */
export function waitUntil(task: BackgroundTask): void {
  const promise = toPromise(task).catch((error) => {
    console.error(
      "[waitUntil] background task failed:",
      error instanceof Error ? error.message : error,
    );
  });

  const scheduled = vercelWaitUntil(promise);
  if (scheduled === undefined) {
    after(promise);
  }
}
