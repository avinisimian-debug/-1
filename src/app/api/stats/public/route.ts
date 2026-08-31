import { isProSaleActive } from "@/lib/constants";
import { getDisplayedPublicStats } from "@/lib/social-proof-stats";
import { getDownloadsToday, getTranscriptionsToday } from "@/lib/stats-store";
import { getUserCount } from "@/lib/users-store";
import { withApiHandler } from "@/shared/api";

export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const [transcriptionsToday, downloadsToday, totalUsers] = await Promise.all([
    getTranscriptionsToday(),
    getDownloadsToday(),
    getUserCount(),
  ]);

  const displayed = getDisplayedPublicStats({
    transcriptionsToday,
    downloadsToday,
    totalUsers,
  });

  return {
    transcriptionsToday: displayed.transcriptionsToday,
    downloadsToday: displayed.downloadsToday,
    totalUsers: displayed.totalUsers,
    saleActive: isProSaleActive(),
  };
});
