import { incrementDownloadsToday } from "@/lib/stats-store";
import { withApiHandler } from "@/shared/api";

export const runtime = "nodejs";

export const POST = withApiHandler(async () => {
  const downloadsToday = await incrementDownloadsToday();
  return { downloadsToday };
});
