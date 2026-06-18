import { withApiHandler } from "@/shared/api";

export const runtime = "nodejs";

export const GET = withApiHandler(async () => ({
  commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  branch: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
  url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  builtAt: new Date().toISOString(),
}));
