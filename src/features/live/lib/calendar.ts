import type { LiveSession } from "../types";

/** Build a Google Calendar “Add event” URL for a live session. */
export function buildGoogleCalendarUrl(session: LiveSession): string {
  const start = new Date(session.startsAt);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: session.title,
    details: [
      session.description,
      "",
      `Join: ${session.meetingUrl}`,
      session.agenda.length
        ? `Agenda:\n${session.agenda.map((a) => `• ${a}`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    location: session.meetingUrl,
    dates: `${fmt(start)}/${fmt(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsDataUrl(session: LiveSession): string {
  const start = new Date(session.startsAt);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Staz AI//Live Hub//EN",
    "BEGIN:VEVENT",
    `UID:${session.id}@1stazai.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(session.title)}`,
    `DESCRIPTION:${escapeIcs(`${session.description}\nJoin: ${session.meetingUrl}`)}`,
    `LOCATION:${escapeIcs(session.meetingUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,");
}

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
};

export function getCountdown(
  startsAt: string,
  durationMinutes: number,
  now = Date.now(),
): CountdownParts {
  const start = new Date(startsAt).getTime();
  const end = start + durationMinutes * 60_000;
  const totalMs = start - now;

  if (now >= start && now <= end) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: true,
      isPast: false,
    };
  }

  if (now > end) {
    return {
      totalMs: totalMs,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: false,
      isPast: true,
    };
  }

  const abs = Math.max(0, totalMs);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isLive: false,
    isPast: false,
  };
}
