import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getUserIntegrations } from "@/features/integrations/server/integrations-store";
import { pushActionItemsToIntegrations } from "@/features/integrations/server/push-action-items.use-case";
import type {
  ActionItemsPushPayload,
  IntegrationProviderId,
} from "@/features/integrations/types";
import { hasFeature } from "@/lib/plan-features";
import { getUserPlan } from "@/lib/users-store";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "@/shared/api/errors";
import { withApiHandler } from "@/shared/api/withApiHandler";

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }

  const plan = await getUserPlan(session.user.email);
  if (!hasFeature(plan, "integrationsPush")) {
    throw new ForbiddenError("Integrations require Pro");
  }

  const body = (await request.json()) as {
    payload?: ActionItemsPushPayload;
    providers?: IntegrationProviderId[];
  };

  if (!body.payload?.fileName || !Array.isArray(body.payload.actionItems)) {
    throw new BadRequestError("Invalid push payload");
  }

  const config = await getUserIntegrations(session.user.email);
  const results = await pushActionItemsToIntegrations(
    config,
    {
      source: "staz-ai",
      fileName: body.payload.fileName,
      processedAt: body.payload.processedAt,
      headline: body.payload.headline,
      overview: body.payload.overview,
      actionItems: body.payload.actionItems,
    },
    body.providers,
  );

  return {
    results,
    pushedAt: new Date().toISOString(),
  };
});
