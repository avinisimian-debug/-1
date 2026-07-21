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
  "סיכום פגישות AI",
  "תמלול אוטומטי",
  "speech to text Hebrew",
];

const ogImage = `${SITE_URL}/icon-512.png`;
const ogLogo = `${SITE_URL}/logo.png`;

export function buildSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  const base: Metadata = {
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
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "he-IL": SITE_URL,
        "en-US": SITE_URL,
        "x-default": SITE_URL,
      },
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
        {
          url: ogLogo,
          width: 512,
          height: 512,
          alt: BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    other: {
      "theme-color": "#09090b",
    },
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
  };

  return deepMergeMetadata(base, overrides);
}

function deepMergeMetadata(
  base: Metadata,
  overrides?: Partial<Metadata>,
): Metadata {
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    title: overrides.title ?? base.title,
    openGraph: {
      ...base.openGraph,
      ...overrides.openGraph,
      images: overrides.openGraph?.images ?? base.openGraph?.images,
    },
    twitter: {
      ...base.twitter,
      ...overrides.twitter,
      images: overrides.twitter?.images ?? base.twitter?.images,
    },
    robots: overrides.robots ?? base.robots,
    alternates: {
      ...base.alternates,
      ...overrides.alternates,
    },
  };
}

export function buildPrivatePageMetadata(
  title: string,
  description?: string,
): Metadata {
  return {
    title,
    description: description ?? `${title} — ${BRAND_NAME}`,
    robots: { index: false, follow: false },
  };
}

export const privatePageRobots: Metadata = {
  robots: { index: false, follow: false },
};

/** Public routes included in sitemap.xml */
export const PUBLIC_ROUTES = ["/", "/login"] as const;
