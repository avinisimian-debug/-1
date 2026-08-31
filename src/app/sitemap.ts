import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency:
      path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : path.startsWith("/meeting") || path.includes("ai-") ? 0.85 : 0.8,
  }));
}
