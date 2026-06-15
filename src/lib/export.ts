import type { ActionItem, TranscriptionResult } from "./types";

function sanitizeFileName(name: string): string {
  return name.replace(/\.[^/.]+$/, "").replace(/[^\w\s-]/g, "").trim() || "transcript";
}

export function buildTranscriptText(result: TranscriptionResult): string {
  const lines = [
    `TRANSCRIPT — ${result.fileName}`,
    `Duration: ${result.duration} | Processed: ${result.processedAt}`,
    "=".repeat(60),
    "",
  ];

  for (const entry of result.transcript) {
    lines.push(`[${entry.timestamp}] ${entry.speaker}`);
    lines.push(entry.text);
    lines.push("");
  }

  return lines.join("\n");
}

export function buildFullReportText(
  result: TranscriptionResult,
  actionItems: ActionItem[],
): string {
  const lines = [
    `MEETSCRIBE REPORT — ${result.fileName}`,
    `Duration: ${result.duration} | Processed: ${result.processedAt}`,
    "=".repeat(60),
    "",
    "EXECUTIVE OVERVIEW",
    "-".repeat(40),
    result.summary.overview || "(No overview generated)",
    "",
    "EXECUTIVE SUMMARY",
    "-".repeat(40),
  ];

  for (const point of result.summary.executive) {
    lines.push(`• ${point}`);
  }

  lines.push("", "KEY TAKEAWAYS", "-".repeat(40));
  for (const point of result.summary.keyTakeaways) {
    lines.push(`• ${point}`);
  }

  lines.push("", "ACTION ITEMS", "-".repeat(40));
  for (const item of actionItems) {
    const status = item.completed ? "[x]" : "[ ]";
    lines.push(`${status} ${item.task}`);
    lines.push(`    Owner: ${item.owner} | Deadline: ${item.deadline}`);
  }

  lines.push("", "FULL TRANSCRIPT", "-".repeat(40));
  for (const entry of result.transcript) {
    lines.push(`[${entry.timestamp}] ${entry.speaker}: ${entry.text}`);
  }

  return lines.join("\n");
}

export function downloadTextFile(
  content: string,
  fileName: string,
): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadTranscript(
  result: TranscriptionResult,
): void {
  const base = sanitizeFileName(result.fileName);
  downloadTextFile(buildTranscriptText(result), `${base}-transcript.txt`);
}

export function downloadFullReport(
  result: TranscriptionResult,
  actionItems: ActionItem[],
): void {
  const base = sanitizeFileName(result.fileName);
  downloadTextFile(
    buildFullReportText(result, actionItems),
    `${base}-full-report.txt`,
  );
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function buildSummaryText(result: TranscriptionResult): string {
  const lines = [
    result.summary.overview ?? "",
    "",
    result.summary.executive.map((p) => `• ${p}`).join("\n"),
    "",
    result.summary.keyTakeaways.map((p) => `• ${p}`).join("\n"),
  ];
  return lines.filter(Boolean).join("\n");
}
