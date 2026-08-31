import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/login",
          "/ai-meeting-transcription",
          "/meeting-summary-hebrew",
          "/meeting-closeout",
          "/ads.txt",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/settings",
          "/history",
          "/live",
        ],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
