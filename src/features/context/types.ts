import type { TranscriptionResult } from "@/features/transcription/types";

/** A business client (e.g. "Acme Corp") — groups projects and meetings. */
export interface Client {
  id: string;
  ownerEmail: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** A project or engagement under a client (e.g. "Q2 Product Launch"). */
export interface Project {
  id: string;
  ownerEmail: string;
  clientId?: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Links a processed meeting to global context for cross-meeting AI queries. */
export interface MeetingRecord {
  id: string;
  ownerEmail: string;
  projectId: string;
  clientId?: string;
  /** Reference to history entry or server job result */
  historyEntryId?: string;
  fileName: string;
  duration: string;
  processedAt: string;
  headline?: string;
  summaryOverview?: string;
  executiveSummary: string[];
  topics?: string[];
  decisions?: string[];
  actionItemCount: number;
  createdAt: string;
}

/** Denormalized view for AI context windows across a project. */
export interface ProjectMeetingContext {
  project: Project;
  client?: Client;
  meetings: MeetingRecord[];
  combinedTopics: string[];
  combinedDecisions: string[];
}

export interface LinkMeetingInput {
  ownerEmail: string;
  projectId: string;
  result: TranscriptionResult;
  historyEntryId?: string;
}
