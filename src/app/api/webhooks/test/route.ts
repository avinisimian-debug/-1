import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { buildTestWebhookPayload } from "@/features/webhooks/server/build-webhook-payload";
import { postWebhookJson } from "@/features/webhooks/server/post-webhook";
import { requireProPlan } from "@/features/webhooks/server/require-pro-plan";
import {
  getWebhookSettings,
  resolveUserId,
} from "@/features/webhooks/server/webhooks-store";
import { validateWebhookUrl } from "@/features/webhooks/server/validate-webhook-url";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/shared/api/errors";
import { withApiHandler } from "@/shared/api/withApiHandler";
import { getUserPlan } from "@/lib/users-store";

interface TestWebhookBody {
  url?: string;
  signingKey?: string;
}

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }

  await requireProPlan(session.user.email);

  const body = (await request.json().catch(() => ({}))) as TestWebhookBody;
  const userId = resolveUserId(session.user.email);
  const stored = await getWebhookSettings(userId);

  const url = body.url?.trim() || stored.url.trim();
  if (!url) {
    throw new BadRequestError("Enter a webhook URL before testing.");
  }

  const validation = validateWebhookUrl(url);
  if (!validation.ok) {
    throw new BadRequestError(validation.error);
  }

  const signingKey =
    body.signingKey !== undefined
      ? body.signingKey.trim() || undefined
      : stored.signingKey;

  const plan = await getUserPlan(session.user.email);
  const payload = buildTestWebhookPayload({
    userEmail: session.user.email,
    plan,
  });

  const result = await postWebhookJson(url, payload, signingKey);
  if (!result.ok) {
    throw new BadRequestError(
      result.error ?? `Webhook returned ${result.statusCode ?? "error"}`,
    );
  }

  return { ok: true, statusCode: result.statusCode };
});
