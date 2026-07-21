/**
 * Next.js instrumentation — validates env schema on boot (when not skipped).
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./src/shared/config/env");
  }
}
