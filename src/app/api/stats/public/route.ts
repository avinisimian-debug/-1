import { isProSaleActive } from "@/lib/constants";
import { getTranscriptionsToday } from "@/lib/stats-store";
import { getUserCount } from "@/lib/users-store";
import { withApiHandler } from "@/shared/api";

export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const [transcriptionsToday, totalUsers] = await Promise.all([
    getTranscriptionsToday(),
    getUserCount(),
  ]);

  return {
    transcriptionsToday,
    totalUsers,
    saleActive: isProSaleActive(),
  };
});
