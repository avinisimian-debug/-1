import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  process.env.AUTH_URL?.replace(/\/$/, "") ??
  "https://1stazai.com";

export const SITE_TITLE =
  "Staz AI — תמלול וסיכום פגישות ב-AI | עברית ואנגלית";

export const SITE_DESCRIPTION =
  "תמלול מדויק לפגישות Zoom, Teams ו-Google Meet. סיכומי מנהלים, משימות ותובנות תוך דקות — בעברית ובאנגלית. ניסיון חינם בשבוע ההשקה.";

export const SITE_KEYWORDS = [
  "תמלול פגישות",
  "תמלול בעברית",
  "סיכום פגישות",
  "תמלול AI",
  "תמלול Zoom",
  "תמלול Teams",
  "meeting transcription",
  "AI transcription Hebrew",
  "Staz AI",
  "1stazai",
];

const ogImage = `${SITE_URL}/icon-512.png`;

export function buildSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: BRAND_NAME,
    title: {
      default: SITE_TITLE,
      template: `%s · ${BRAND_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: BRAND_NAME, url: SITE_URL }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "technology",
    alternates: {
      canonical: SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "he_IL",
      alternateLocale: ["en_US"],
      url: SITE_URL,
      siteName: BRAND_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: SITE_TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
    ...overrides,
  };
}

export const privatePageRobots: Metadata = {
  robots: { index: false, follow: false },
};

/** Public routes included in sitemap.xml */
export const PUBLIC_ROUTES = ["/", "/login"] as const;
