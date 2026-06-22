/** Parse MM:SS or H:MM:SS to seconds. */
export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.trim().split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

export function secondsToTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Find the transcript line index active at `currentSeconds`. */
export function findActiveLineIndex(
  timestamps: string[],
  currentSeconds: number,
): number {
  if (timestamps.length === 0) return -1;

  let active = 0;
  for (let i = 0; i < timestamps.length; i++) {
    const sec = timestampToSeconds(timestamps[i]);
    if (sec <= currentSeconds) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}

export function estimateTimeSavedMinutes(durationLabel: string): number {
  const seconds = timestampToSeconds(
    durationLabel.includes(":") ? durationLabel : `0:${durationLabel}`,
  );
  const minutes = seconds / 60;
  return Math.max(5, Math.round(minutes * 0.85));
}
