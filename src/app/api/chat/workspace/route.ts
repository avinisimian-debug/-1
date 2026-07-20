import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { chatWithWorkspaceCorpus } from "@/features/chat/server/chat-transcript.use-case";
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
    corpusText?: string;
    question?: string;
  };

  if (!body.corpusText?.trim()) {
    throw new BadRequestError("corpusText is required.");
  }
  if (!body.question?.trim()) {
    throw new BadRequestError("question is required.");
  }

  const result = await chatWithWorkspaceCorpus({
    corpusText: body.corpusText,
    question: body.question,
  });

  if (isFailure(result)) {
    throw result.error;
  }

  return result.data;
});
