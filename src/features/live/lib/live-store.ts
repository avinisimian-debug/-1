import type { LivePlatform, LiveSession, LiveSessionInput } from "../types";

const STORAGE_PREFIX = "staz-live-sessions:";

function storageKey(email: string): string {
  return `${STORAGE_PREFIX}${email.toLowerCase()}`;
}

function safeParse(raw: string | null): LiveSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LiveSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listLiveSessions(email: string): LiveSession[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(storageKey(email))).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function saveLiveSessions(email: string, sessions: LiveSession[]): void {
  localStorage.setItem(storageKey(email), JSON.stringify(sessions));
}

export function detectPlatform(url: string): LivePlatform {
  const lower = url.toLowerCase();
  if (lower.includes("zoom.us") || lower.includes("zoom.com")) return "zoom";
  if (lower.includes("meet.google.com")) return "google_meet";
  return "other";
}

export function isValidMeetingUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host.includes("zoom.us") ||
      host.includes("zoom.com") ||
      host.includes("meet.google.com") ||
      host.includes("teams.microsoft.com") ||
      host.includes("webex.com")
    );
  } catch {
    return false;
  }
}

export function createLiveSession(
  email: string,
  input: LiveSessionInput,
): LiveSession {
  const now = new Date().toISOString();
  const session: LiveSession = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    platform: input.platform || detectPlatform(input.meetingUrl),
    meetingUrl: input.meetingUrl.trim(),
    startsAt: input.startsAt,
    durationMinutes: input.durationMinutes ?? 60,
    agenda: (input.agenda ?? []).map((a) => a.trim()).filter(Boolean),
    materials: (input.materials ?? [])
      .filter((m) => m.title.trim() && m.url.trim())
      .map((m) => ({
        id: crypto.randomUUID(),
        title: m.title.trim(),
        url: m.url.trim(),
      })),
    qa: [],
    hostName: input.hostName?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const next = [...listLiveSessions(email), session];
  saveLiveSessions(email, next);
  return session;
}

export function deleteLiveSession(email: string, id: string): void {
  saveLiveSessions(
    email,
    listLiveSessions(email).filter((s) => s.id !== id),
  );
}

export function addLiveQa(
  email: string,
  sessionId: string,
  author: string,
  text: string,
): LiveSession | null {
  const sessions = listLiveSessions(email);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx < 0) return null;

  const updated: LiveSession = {
    ...sessions[idx],
    updatedAt: new Date().toISOString(),
    qa: [
      ...sessions[idx].qa,
      {
        id: crypto.randomUUID(),
        author: author.trim() || "Guest",
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    ],
  };
  sessions[idx] = updated;
  saveLiveSessions(email, sessions);
  return updated;
}

export function seedDemoSessions(email: string): LiveSession[] {
  const existing = listLiveSessions(email);
  if (existing.length > 0) return existing;

  const inTwoHours = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const tomorrow = new Date(Date.now() + 26 * 60 * 60 * 1000);

  createLiveSession(email, {
    title: "Weekly product lecture",
    description: "Deep dive into AI transcription workflows for teams.",
    platform: "zoom",
    meetingUrl: "https://zoom.us/j/1234567890",
    startsAt: inTwoHours.toISOString(),
    durationMinutes: 60,
    agenda: [
      "Welcome & goals",
      "Live Zoom recording tips",
      "Q&A",
    ],
    materials: [
      {
        title: "Lecture slides (PDF)",
        url: "https://1stazai.com/",
      },
    ],
    hostName: "Staz AI",
  });

  createLiveSession(email, {
    title: "Hebrew office hours",
    description: "Open Q&A for Hebrew transcription best practices.",
    platform: "google_meet",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    startsAt: tomorrow.toISOString(),
    durationMinutes: 45,
    agenda: ["Intro", "Demos", "Open floor"],
    hostName: "Staz AI",
  });

  return listLiveSessions(email);
}
