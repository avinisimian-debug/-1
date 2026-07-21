import type { LivePlatform } from "../types";

const PLATFORM_HOSTS: Array<{
  platform: LivePlatform;
  match: (host: string, url: string) => boolean;
}> = [
  {
    platform: "zoom",
    match: (host) => host.includes("zoom.us") || host.includes("zoom.com"),
  },
  {
    platform: "google_meet",
    match: (host) => host.includes("meet.google.com"),
  },
  {
    platform: "microsoft_teams",
    match: (host) =>
      host.includes("teams.microsoft.com") ||
      host.includes("teams.live.com") ||
      host.includes("teams.office.com"),
  },
  {
    platform: "rtmp",
    match: (_host, url) =>
      url.startsWith("rtmp://") ||
      url.startsWith("rtmps://") ||
      url.startsWith("srt://"),
  },
  {
    platform: "webrtc",
    match: (host, url) =>
      url.startsWith("webrtc:") ||
      host.includes("livekit") ||
      host.includes("whereby.com") ||
      host.includes("daily.co"),
  },
];

export function detectPlatform(url: string): LivePlatform {
  try {
    const lower = url.trim().toLowerCase();
    if (
      lower.startsWith("rtmp://") ||
      lower.startsWith("rtmps://") ||
      lower.startsWith("srt://")
    ) {
      return "rtmp";
    }
    if (lower.startsWith("webrtc:")) return "webrtc";

    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    for (const entry of PLATFORM_HOSTS) {
      if (entry.match(host, lower)) return entry.platform;
    }
    return "other";
  } catch {
    return "other";
  }
}

export function isValidMeetingUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (
    trimmed.startsWith("rtmp://") ||
    trimmed.startsWith("rtmps://") ||
    trimmed.startsWith("srt://") ||
    trimmed.startsWith("webrtc:")
  ) {
    return trimmed.length > 10;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return detectPlatform(trimmed) !== "other" || parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export function computeJoinAt(startsAtIso: string, joinEarlyMinutes: number): Date {
  const starts = new Date(startsAtIso);
  const early = Math.max(0, joinEarlyMinutes);
  return new Date(starts.getTime() - early * 60_000);
}

export function computeEndsAt(startsAtIso: string, durationMinutes: number): Date {
  const starts = new Date(startsAtIso);
  return new Date(starts.getTime() + Math.max(1, durationMinutes) * 60_000);
}

export function isDueForBotDispatch(
  session: {
    startsAt: string;
    durationMinutes: number;
    bot: { enabled: boolean; joinEarlyMinutes: number };
    botStatus: string;
  },
  now = new Date(),
): boolean {
  if (!session.bot.enabled) return false;
  if (session.botStatus !== "scheduled") return false;

  const joinAt = computeJoinAt(session.startsAt, session.bot.joinEarlyMinutes);
  const endsAt = computeEndsAt(session.startsAt, session.durationMinutes);
  return now >= joinAt && now < endsAt;
}

export function getBotProvider(): "recall" | "manual" {
  return process.env.RECALL_AI_API_KEY?.trim() ? "recall" : "manual";
}
