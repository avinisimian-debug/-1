import { NextRequest } from "next/server";
import type { PlanTier } from "@/lib/constants";
import { transcribeAudio } from "@/features/transcription/server/transcribe.use-case";
import { BadRequestError, withApiHandler } from "@/shared/api";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 300;

export const POST = withApiHandler(async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const plan = (formData.get("plan") as PlanTier) || "free";
  const language = formData.get("language") as string | null;

  if (!file || !(file instanceof File)) {
    throw new BadRequestError("No audio file provided.");
  }

  const result = await transcribeAudio({ file, plan, language });
  if (isFailure(result)) {
    throw result.error;
  }

  return result.data;
});