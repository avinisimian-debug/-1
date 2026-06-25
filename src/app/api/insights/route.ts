import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { generateAiInsights } from "@/features/insights/server/generate-insights.use-case";
import { BadRequestError, UnauthorizedError, withApiHandler } from "@/shared/api";
import { isFailure } from "@/shared/lib/result";

export const runtime = "nodejs";
export const maxDuration = 60;

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }

  const body = (await request.json()) as {
    transcriptText?: string;
    fileName?: string;
  };

  if (!body.transcriptText?.trim()) {
    throw new BadRequestError("transcriptText is required.");
  }

  const result = await generateAiInsights({
    transcriptText: body.transcriptText,
    fileName: body.fileName,
  });

  if (isFailure(result)) {
    throw result.error;
  }

  return result.data;
});
