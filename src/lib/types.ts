export type ProcessingStage = "uploading" | "transcribing" | "analyzing";

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
  text: string;
}

export interface TranscriptionResult {
  fileName: string;
  duration: string;
  processedAt: string;
  summary: {
    overview?: string;
    executive: string[];
    keyTakeaways: string[];
  };
  actionItems: ActionItem[];
  transcript: TranscriptEntry[];
  chapters?: MeetingChapter[];
  sentiment?: SentimentAnalysis;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}
