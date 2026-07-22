import { randomUUID } from "crypto";
import type { LiveSession, LiveSessionInput, LiveSessionPublic } from "../types";
import {
  computeEndsAt,
  computeJoinAt,
  detectPlatform,
  getBotProvider,
  isValidMeetingUrl,
} from "./platform-resolver";
import {
  deleteMeeting,
  getMeetingById,
  listMeetingsForOwner,
  upsertMeeting,
} from "./meetings-store";
import { recallBotAdapter } from "./adapters/recall.adapter";
import {
  manualBotAdapter,
  simulatedBotAdapter,
} from "./adapters/manual.adapter";
import type { MeetingBotAdapter } from "./adapters/bot-adapter";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/shared/api";

function normalizeEmails(raw: string[] | undefined): string[] {
  if (!raw?.length) return [];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return [
    ...new Set(
      raw
        .map((e) => e.trim().toLowerCase())
        .filter((e) => emailRe.test(e)),
    ),
  ].slice(0, 40);
}

function resolveAdapter(): MeetingBotAdapter {
  if (simulatedBotAdapter.isAvailable()) return simulatedBotAdapter;
  if (recallBotAdapter.isAvailable()) return recallBotAdapter;
  return manualBotAdapter;
}

export function toPublicMeeting(session: LiveSession): LiveSessionPublic {
  return {
    ...session,
    joinAt: computeJoinAt(
      session.startsAt,
      session.bot.joinEarlyMinutes,
    ).toISOString(),
    endsAt: computeEndsAt(
      session.startsAt,
      session.durationMinutes,
    ).toISOString(),
  };
}

export async function createScheduledMeeting(
  ownerEmail: string,
  input: LiveSessionInput,
): Promise<LiveSessionPublic> {
  if (!input.title?.trim()) {
    throw new BadRequestError("Meeting title is required.");
  }
  if (!isValidMeetingUrl(input.meetingUrl)) {
    throw new BadRequestError(
      "Invalid meeting link. Use Zoom, Google Meet, Teams, RTMP, or WebRTC URL.",
    );
  }
  if (!input.startsAt || Number.isNaN(Date.parse(input.startsAt))) {
    throw new BadRequestError("Valid start date/time is required.");
  }

  const now = new Date().toISOString();
  const platform = input.platform || detectPlatform(input.meetingUrl);
  const botEnabled = input.bot?.enabled ?? true;

  const session: LiveSession = {
    id: randomUUID(),
    ownerEmail: ownerEmail.toLowerCase(),
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    platform,
    meetingUrl: input.meetingUrl.trim(),
    startsAt: new Date(input.startsAt).toISOString(),
    timezone: input.timezone?.trim() || "UTC",
    durationMinutes: Math.min(480, Math.max(15, input.durationMinutes ?? 60)),
    agenda: (input.agenda ?? []).map((a) => a.trim()).filter(Boolean),
    materials: (input.materials ?? [])
      .filter((m) => m.title.trim() && m.url.trim())
      .map((m) => ({
        id: randomUUID(),
        title: m.title.trim(),
        url: m.url.trim(),
      })),
    qa: [],
    hostName: input.hostName?.trim() || undefined,
    attendeeEmails: normalizeEmails(input.attendeeEmails),
    bot: {
      enabled: botEnabled,
      diarization: input.bot?.diarization ?? true,
      language: input.bot?.language ?? "auto",
      joinEarlyMinutes: input.bot?.joinEarlyMinutes ?? 2,
    },
    botStatus: "scheduled",
    botProvider: getBotProvider(),
    createdAt: now,
    updatedAt: now,
  };

  await upsertMeeting(session);
  return toPublicMeeting(session);
}

export async function getOwnedMeeting(
  id: string,
  ownerEmail: string,
): Promise<LiveSessionPublic> {
  const meeting = await getMeetingById(id);
  if (!meeting) throw new NotFoundError("Meeting not found.");
  if (meeting.ownerEmail !== ownerEmail.toLowerCase()) {
    throw new ForbiddenError("Not allowed to access this meeting.");
  }
  return toPublicMeeting(meeting);
}

export async function listOwnedMeetings(
  ownerEmail: string,
): Promise<LiveSessionPublic[]> {
  const list = await listMeetingsForOwner(ownerEmail);
  return list.map(toPublicMeeting);
}

export async function removeOwnedMeeting(
  id: string,
  ownerEmail: string,
): Promise<void> {
  const ok = await deleteMeeting(id, ownerEmail);
  if (!ok) throw new NotFoundError("Meeting not found.");
}

export async function addMeetingQa(
  id: string,
  ownerEmail: string,
  author: string,
  text: string,
): Promise<LiveSessionPublic> {
  const meeting = await getMeetingById(id);
  if (!meeting) throw new NotFoundError("Meeting not found.");
  if (meeting.ownerEmail !== ownerEmail.toLowerCase()) {
    throw new ForbiddenError("Not allowed.");
  }
  if (!text.trim()) throw new BadRequestError("Question text is required.");

  const updated: LiveSession = {
    ...meeting,
    updatedAt: new Date().toISOString(),
    qa: [
      ...meeting.qa,
      {
        id: randomUUID(),
        author: author.trim() || "Guest",
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    ],
  };
  await upsertMeeting(updated);
  return toPublicMeeting(updated);
}

/**
 * Dispatch bot for a single meeting (cron or manual trigger).
 */
export async function dispatchMeetingBot(
  session: LiveSession,
): Promise<LiveSession> {
  if (session.botStatus !== "scheduled") {
    return session;
  }

  const adapter = resolveAdapter();
  const dispatching: LiveSession = {
    ...session,
    botStatus: "dispatching",
    botProvider: adapter.id,
    updatedAt: new Date().toISOString(),
  };
  await upsertMeeting(dispatching);

  try {
    const result = await adapter.dispatch(dispatching);
    const next: LiveSession = {
      ...dispatching,
      botStatus: result.status,
      botProvider: result.provider,
      externalBotId: result.externalBotId,
      updatedAt: new Date().toISOString(),
      error: undefined,
    };
    await upsertMeeting(next);
    return next;
  } catch (error) {
    const failed: LiveSession = {
      ...dispatching,
      botStatus: "failed",
      error: error instanceof Error ? error.message : "Bot dispatch failed",
      updatedAt: new Date().toISOString(),
    };
    await upsertMeeting(failed);
    return failed;
  }
}

export async function dispatchDueMeetings(now = new Date()): Promise<{
  checked: number;
  dispatched: number;
  results: Array<{ id: string; status: string; error?: string }>;
}> {
  const { listDueMeetings } = await import("./meetings-store");
  const due = await listDueMeetings(now);
  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const meeting of due) {
    const updated = await dispatchMeetingBot(meeting);
    results.push({
      id: updated.id,
      status: updated.botStatus,
      ...(updated.error ? { error: updated.error } : {}),
    });
  }

  return {
    checked: due.length,
    dispatched: results.filter((r) => r.status !== "failed").length,
    results,
  };
}
