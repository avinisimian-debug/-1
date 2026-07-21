export type LivePlatform = "zoom" | "google_meet" | "other";

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

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  platform: LivePlatform;
  meetingUrl: string;
  startsAt: string; // ISO
  durationMinutes: number;
  agenda: string[];
  materials: LiveMaterial[];
  qa: LiveQaItem[];
  hostName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSessionInput {
  title: string;
  description?: string;
  platform: LivePlatform;
  meetingUrl: string;
  startsAt: string;
  durationMinutes?: number;
  agenda?: string[];
  materials?: Array<{ title: string; url: string }>;
  hostName?: string;
}
