import { isProSaleActive } from "@/lib/constants";
import { getDisplayedPublicStats } from "@/lib/social-proof-stats";
import { getTranscriptionsToday } from "@/lib/stats-store";
import { getUserCount } from "@/lib/users-store";
import { withApiHandler } from "@/shared/api";

export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const [transcriptionsToday, totalUsers] = await Promise.all([
    getTranscriptionsToday(),
    getUserCount(),
  ]);

  const displayed = getDisplayedPublicStats({
    transcriptionsToday,
    totalUsers,
  });

  return {
    transcriptionsToday: displayed.transcriptionsToday,
    totalUsers: displayed.totalUsers,
    saleActive: isProSaleActive(),
  };
});
