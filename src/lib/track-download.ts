/** Fire-and-forget daily download counter for public stats. */
export function trackFileDownload(): void {
  if (typeof window === "undefined") return;
  void fetch("/api/stats/download", { method: "POST" }).catch(() => {});
}
