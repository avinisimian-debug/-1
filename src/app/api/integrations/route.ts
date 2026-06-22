import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getUserIntegrations,
  updateUserIntegrations,
} from "@/features/integrations/server/integrations-store";
import type { IntegrationConfigPatch } from "@/features/integrations/types";
import { UnauthorizedError } from "@/shared/api/errors";
import { withApiHandler } from "@/shared/api/withApiHandler";

export const GET = withApiHandler(async () => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }

  const config = await getUserIntegrations(session.user.email);
  return { config };
});

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }

  const body = (await request.json()) as IntegrationConfigPatch;
  const config = await updateUserIntegrations(session.user.email, body);
  return { config };
});
