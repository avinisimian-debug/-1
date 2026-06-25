import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import {
  resolveUserId,
  triggerWebhook,
} from "@/features/webhooks/server/trigger-webhook";
import { incrementTranscriptionsToday } from "@/lib/stats-store";
import { waitUntil } from "@/lib/wait-until";
import { getUserPlan } from "@/lib/users-store";
import { BadRequestError, UnauthorizedError, withApiHandler } from "@/shared/api";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 300;

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required to transcribe.");
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const language = formData.get("language") as string | null;
  const plan = await getUserPlan(session.user.email);

  if (!file || !(file instanceof File)) {
    throw new BadRequestError("No audio file provided.");
  }

  const result = await transcribeAudio({ file, plan, language });
  if (isFailure(result)) {
    throw result.error;
  }

  await incrementTranscriptionsToday();

  const userId = resolveUserId(session.user.email);
  waitUntil(
    triggerWebhook(userId, {
      userEmail: session.user.email,
      plan,
      result: result.data,
    }),
  );

  return result.data;
});
