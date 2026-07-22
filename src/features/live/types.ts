/**
 * Meeting bot & scheduler domain types.
 * Platforms: Zoom, Google Meet, Microsoft Teams, custom RTMP/WebRTC.
 */

export type LivePlatform =
  | "zoom"
  | "google_meet"
  | "microsoft_teams"
  | "rtmp"
  | "webrtc"
  | "other";

export type BotStatus =
  | "scheduled"
  | "dispatching"
  | "joining"
  | "recording"
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "ready"
  | "failed"
  | "cancelled"
  | "awaiting_recording";

export type BotProvider = "recall" | "manual" | "simulated";

export interface LiveMaterial {
  id: string;
  title: string;
  url: string;
}

export interface LiveQaItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface LiveBotOptions {
  /** Auto-dispatch meeting bot before start */
  enabled: boolean;
  /** Speaker diarization in post-meeting STT */
  diarization: boolean;
  /** Whisper/AssemblyAI language code or "auto" */
  language: string;
  /** Minutes before startsAt to join (default 2) */
  joinEarlyMinutes: number;
}

export interface LiveSession {
  id: string;
  ownerEmail: string;
  title: string;
  description: string;
  platform: LivePlatform;
  meetingUrl: string;
  /** ISO start time (UTC) */
  startsAt: string;
  /** IANA timezone for display (e.g. Asia/Jerusalem) */
  timezone: string;
  durationMinutes: number;
  agenda: string[];
  materials: LiveMaterial[];
  qa: LiveQaItem[];
  hostName?: string;
  /** Optional attendee emails for post-meeting digest delivery */
  attendeeEmails?: string[];
  bot: LiveBotOptions;
  botStatus: BotStatus;
  botProvider?: BotProvider;
  externalBotId?: string;
  recordingBlobUrl?: string;
  recordingPathname?: string;
  recordingContentType?: string;
  transcriptionJobId?: string;
  /** Serialized TranscriptionResult when pipeline completes */
  digest?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSessionInput {
  title: string;
  description?: string;
  platform?: LivePlatform;
  meetingUrl: string;
  startsAt: string;
  timezone?: string;
  durationMinutes?: number;
  agenda?: string[];
  materials?: Array<{ title: string; url: string }>;
  hostName?: string;
  attendeeEmails?: string[];
  bot?: Partial<LiveBotOptions>;
}

export interface LiveSessionPublic extends LiveSession {
  joinAt: string;
  endsAt: string;
}
