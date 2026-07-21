import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  addMeetingQa,
  getOwnedMeeting,
  removeOwnedMeeting,
} from "@/features/live/server/bot-orchestrator";
import { normalizeApiError } from "@/shared/api";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

function jsonError(error: unknown) {
  const normalized = normalizeApiError(error);
  return NextResponse.json(
    {
      data: null,
      error: { code: normalized.code, message: normalized.message },
    },
    { status: normalized.status },
  );
}

export async function GET(_request: NextRequest, context: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Sign in required." },
        },
        { status: 401 },
      );
    }
    const { id } = await context.params;
    const data = await getOwnedMeeting(id, session.user.email);
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Sign in required." },
        },
        { status: 401 },
      );
    }
    const { id } = await context.params;
    await removeOwnedMeeting(id, session.user.email);
    return NextResponse.json({ data: { ok: true }, error: null });
  } catch (error) {
    return jsonError(error);
  }
}

const QaSchema = z.object({
  text: z.string().min(1).max(2000),
  author: z.string().max(120).optional(),
});

export async function POST(request: NextRequest, context: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Sign in required." },
        },
        { status: 401 },
      );
    }
    const { id } = await context.params;
    const raw = await request.json();
    const parsed = QaSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "BAD_REQUEST", message: "Question text is required." },
        },
        { status: 400 },
      );
    }
    const data = await addMeetingQa(
      id,
      session.user.email,
      parsed.data.author ?? session.user.name ?? "Guest",
      parsed.data.text,
    );
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return jsonError(error);
  }
}
