import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { requireProPlan } from "@/features/webhooks/server/require-pro-plan";
import {
  getWebhookSettings,
  resolveUserId,
  updateWebhookSettings,
} from "@/features/webhooks/server/webhooks-store";
import { validateWebhookUrl } from "@/features/webhooks/server/validate-webhook-url";
import type { WebhookSettingsPatch } from "@/features/webhooks/types";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/shared/api/errors";
import { withApiHandler } from "@/shared/api/withApiHandler";

function validateSettingsPatch(patch: WebhookSettingsPatch): void {
  if (patch.url !== undefined && patch.url.trim()) {
    const result = validateWebhookUrl(patch.url);
    if (!result.ok) {
      throw new BadRequestError(result.error);
    }
  }

  if (patch.isActive && (!patch.url?.trim())) {
    throw new BadRequestError(
      "A valid HTTPS webhook URL is required when isActive is true.",
    );
  }
}

export const GET = withApiHandler(async () => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }

  const userId = resolveUserId(session.user.email);
  const settings = await getWebhookSettings(userId);

  return {
    settings: {
      url: settings.url,
      signingKey: settings.signingKey ?? "",
      isActive: settings.isActive,
      updatedAt: settings.updatedAt,
    },
  };
});

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError("Sign in required.");
  }

  await requireProPlan(session.user.email);

  const body = (await request.json()) as WebhookSettingsPatch;
  validateSettingsPatch(body);

  const userId = resolveUserId(session.user.email);
  const current = await getWebhookSettings(userId);

  const patch: WebhookSettingsPatch = {
    url: body.url !== undefined ? body.url : current.url,
    isActive: body.isActive !== undefined ? body.isActive : current.isActive,
    signingKey:
      body.signingKey !== undefined ? body.signingKey : current.signingKey,
  };

  if (patch.isActive) {
    const urlToValidate = patch.url ?? "";
    const validation = validateWebhookUrl(urlToValidate);
    if (!validation.ok) {
      throw new BadRequestError(validation.error);
    }
  }

  const settings = await updateWebhookSettings(userId, patch);

  return {
    settings: {
      url: settings.url,
      signingKey: settings.signingKey ?? "",
      isActive: settings.isActive,
      updatedAt: settings.updatedAt,
    },
  };
});
