import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { chatWithTranscript } from "@/features/chat/server/chat-transcript.use-case";
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
    question?: string;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!body.transcriptText?.trim()) {
    throw new BadRequestError("transcriptText is required.");
  }
  if (!body.question?.trim()) {
    throw new BadRequestError("question is required.");
  }

  const result = await chatWithTranscript({
    transcriptText: body.transcriptText,
    fileName: body.fileName,
    question: body.question,
    history: body.history,
  });

  if (isFailure(result)) {
    throw result.error;
  }

  return result.data;
});
