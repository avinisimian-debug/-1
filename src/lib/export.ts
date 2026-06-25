import type { ActionItem, TranscriptionResult } from "./types";
import {
  applySpeakerLabelOverrides,
} from "@/features/transcription/lib/speaker-labels";
import { buildSrtFromResult, buildVttFromResult } from "./export-subtitles";

function sanitizeFileName(name: string): string {
  return name.replace(/\.[^/.]+$/, "").replace(/[^\w\s-]/g, "").trim() || "transcript";
}

export function buildTranscriptText(result: TranscriptionResult): string {
  const entries = applySpeakerLabelOverrides(
    result.transcript,
    result.speakerLabels,
  );
  const lines = [
    `TRANSCRIPT — ${result.fileName}`,
    `Duration: ${result.duration} | Processed: ${result.processedAt}`,
    "=".repeat(60),
    "",
  ];

  for (const entry of entries) {
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
  if (result.summary.markdown?.trim()) {
    return result.summary.markdown.trim();
  }

  const lines = [
    `MEETSCRIBE REPORT — ${result.fileName}`,
    `Duration: ${result.duration} | Processed: ${result.processedAt}`,
    "=".repeat(60),
    "",
  ];

  if (result.headline) {
    lines.push("HEADLINE", "-".repeat(40), result.headline, "");
  }
  if (result.topics?.length) {
    lines.push("TOPICS", "-".repeat(40), result.topics.join(", "), "");
  }
  if (result.decisions?.length) {
    lines.push("KEY DECISIONS", "-".repeat(40));
    for (const d of result.decisions) lines.push(`• ${d}`);
    lines.push("");
  }

  lines.push(
    "EXECUTIVE OVERVIEW",
    "-".repeat(40),
    result.summary.overview || "(No overview generated)",
    "",
    "EXECUTIVE SUMMARY",
    "-".repeat(40),
  );

  for (const point of result.summary.executive) {
    lines.push(`• ${point}`);
  }

  lines.push("", "KEY TAKEAWAYS", "-".repeat(40));
  for (const point of result.summary.keyTakeaways) {
    lines.push(`• ${point}`);
  }

  if (result.keyQuotes?.length) {
    lines.push("", "KEY QUOTES", "-".repeat(40));
    for (const q of result.keyQuotes) {
      lines.push(`"${q.quote}"`);
      lines.push(`  — ${q.context}`);
    }
  }

  if (result.risks?.length) {
    lines.push("", "RISKS & BLOCKERS", "-".repeat(40));
    for (const r of result.risks) {
      lines.push(`[${r.severity.toUpperCase()}] ${r.risk}`);
    }
  }

  if (result.followUpEmail) {
    lines.push("", "FOLLOW-UP EMAIL", "-".repeat(40));
    lines.push(`Subject: ${result.followUpEmail.subject}`, "", result.followUpEmail.body);
  }

  lines.push("", "ACTION ITEMS", "-".repeat(40));
  for (const item of actionItems) {
    const status = item.completed ? "[x]" : "[ ]";
    lines.push(`${status} ${item.task}`);
    lines.push(`    Owner: ${item.owner} | Deadline: ${item.deadline}`);
  }

  lines.push("", "FULL TRANSCRIPT", "-".repeat(40));
  const labeledTranscript = applySpeakerLabelOverrides(
    result.transcript,
    result.speakerLabels,
  );
  for (const entry of labeledTranscript) {
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

export function downloadSrt(result: TranscriptionResult): void {
  const base = sanitizeFileName(result.fileName);
  downloadTextFile(buildSrtFromResult(result), `${base}.srt`);
}

export function downloadVtt(result: TranscriptionResult): void {
  const base = sanitizeFileName(result.fileName);
  const content = buildVttFromResult(result);
  const blob = new Blob([content], { type: "text/vtt;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${base}.vtt`;
  anchor.click();
  URL.revokeObjectURL(url);
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
  if (result.summary.markdown?.trim()) {
    return result.summary.markdown.trim();
  }

  const lines: string[] = [];

  if (result.headline) {
    lines.push(result.headline, "");
  }
  if (result.topics?.length) {
    lines.push(`Topics: ${result.topics.join(", ")}`, "");
  }
  if (result.decisions?.length) {
    lines.push("KEY DECISIONS", result.decisions.map((d) => `• ${d}`).join("\n"), "");
  }
  if (result.summary.overview) {
    lines.push(result.summary.overview, "");
  }
  lines.push(
    result.summary.executive.map((p) => `• ${p}`).join("\n"),
    "",
    result.summary.keyTakeaways.map((p) => `• ${p}`).join("\n"),
  );
  return lines.filter(Boolean).join("\n");
}
