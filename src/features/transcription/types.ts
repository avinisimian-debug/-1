import type { AiInsights } from "@/features/insights/types";

export type ProcessingStage =
  | "uploading"
  | "queued"
  | "transcribing"
  | "analyzing"
  | "completed";

export type TranscriptionStatus =
  | "idle"
  | "processing"
  | "complete"
  | "error";

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
}

export interface MeetingChapter {
  timestamp: string;
  title: string;
}

export interface SentimentAnalysis {
  overall: "positive" | "neutral" | "mixed" | "negative";
  label: string;
  description: string;
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  /** Stable id for rename UI — e.g. "1", "2" */
  speakerId?: string;
  text: string;
  /** Word-level sync data for interactive player */
  words?: TimedWord[];
}

/** Standard JSON word timing — used by the interactive media player. */
export interface TimedWord {
  word: string;
  start_time: number;
  end_time: number;
  speaker?: string;
  speakerId?: string;
}

export interface TranscriptionResult {
  fileName: string;
  duration: string;
  processedAt: string;
  headline?: string;
  topics?: string[];
  decisions?: string[];
  summary: {
    overview?: string;
    executive: string[];
    keyTakeaways: string[];
    /** Full GPT-generated Markdown brief */
    markdown?: string;
  };
  actionItems: ActionItem[];
  transcript: TranscriptEntry[];
  chapters?: MeetingChapter[];
  sentiment?: SentimentAnalysis;
  keyQuotes?: Array<{ quote: string; context: string }>;
  risks?: Array<{ risk: string; severity: "high" | "medium" | "low" }>;
  followUpEmail?: { subject: string; body: string };
  /** User-renamed speaker labels keyed by speakerId */
  speakerLabels?: Record<string, string>;
  /** True when multi-speaker diarization was applied */
  diarizationEnabled?: boolean;
  /** Flat word-level timing list (word, start_time, end_time) */
  timedWords?: TimedWord[];
  /** GPT-4o-mini generated insights (summary, actions, topics) */
  aiInsights?: AiInsights;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}
