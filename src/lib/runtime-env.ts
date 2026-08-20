/**
 * Runtime flags — never treat Vercel production as local disk.
 */

export function isVercelProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** Preview or production on Vercel — local files will not survive. */
export function isHostedDeploy(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview"
  );
}

export function blobPersistenceAvailable(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function resendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim(),
  );
}

/** Extract domain from `Name <user@domain>` or bare `user@domain`. */
export function resendFromDomain(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "";
  const match = from.match(/@([^>\s]+)/i);
  return match?.[1]?.toLowerCase() ?? null;
}

/** resend.dev is test-only and cannot email arbitrary recipients. */
export function resendFromIsTestDomain(): boolean {
  const domain = resendFromDomain();
  return !domain || domain === "resend.dev" || domain.endsWith(".resend.dev");
}

export function resendReadyForProductionRecipients(): boolean {
  return resendConfigured() && !resendFromIsTestDomain();
}

export class CloudStorageUnavailableError extends Error {
  constructor() {
    super(
      "STORAGE: הספרייה בענן אינה מוגדרת. הפגישה לא תישמר במכשיר אחר. פנו לתמיכה.",
    );
    this.name = "CloudStorageUnavailableError";
  }
}

export function assertCloudPersistence(): void {
  if (isHostedDeploy() && !blobPersistenceAvailable()) {
    throw new CloudStorageUnavailableError();
  }
}
