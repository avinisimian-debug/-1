import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  createScheduledMeeting,
  listOwnedMeetings,
} from "@/features/live/server/bot-orchestrator";
import {
  BadRequestError,
  UnauthorizedError,
  withApiHandler,
} from "@/shared/api";

export const runtime = "nodejs";

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  meetingUrl: z.string().min(1).max(2048),
  startsAt: z.string().min(1),
  timezone: z.string().max(64).optional(),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  agenda: z.array(z.string().max(500)).max(40).optional(),
  materials: z
    .array(
      z.object({
        title: z.string().max(200),
        url: z.string().max(2048),
      }),
    )
    .max(20)
    .optional(),
  hostName: z.string().max(120).optional(),
  bot: z
    .object({
      enabled: z.boolean().optional(),
      diarization: z.boolean().optional(),
      language: z.string().max(16).optional(),
      joinEarlyMinutes: z.number().int().min(0).max(30).optional(),
    })
    .optional(),
});

export const GET = withApiHandler(async () => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }
  return listOwnedMeetings(session.user.email);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON body.");
  }

  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    throw new BadRequestError(
      parsed.error.issues[0]?.message ?? "Invalid meeting payload.",
    );
  }

  return createScheduledMeeting(session.user.email, {
    ...parsed.data,
    hostName: parsed.data.hostName ?? session.user.name ?? undefined,
  });
});
