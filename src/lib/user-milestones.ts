/**
 * Client milestone: first real (non-demo) file successfully processed.
 */

export const HAS_PROCESSED_FIRST_FILE_KEY = "staz_has_processed_first_file";

export function hasProcessedFirstFile(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(HAS_PROCESSED_FIRST_FILE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markProcessedFirstFile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HAS_PROCESSED_FIRST_FILE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
