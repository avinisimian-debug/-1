import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import {
  getProPlanPriceLabel,
  getProPlanRegularPriceLabel,
  isLaunchWeekActive,
  PRO_PLAN_INTRO_PRICE_LABEL,
} from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  process.env.AUTH_URL?.replace(/\/$/, "") ??
  "https://1stazai.com";

export const SITE_TITLE = isLaunchWeekActive()
  ? `Staz AI — Launch Month · PRO ${PRO_PLAN_INTRO_PRICE_LABEL}`
  : "Staz AI — עוזר הסגירה של הפגישה";

export const SITE_DESCRIPTION = isLaunchWeekActive()
  ? `Staz AI Launch Month: PRO ב־${getProPlanPriceLabel()} (במקום ${getProPlanRegularPriceLabel()} לחודש ראשון). תמלול, סיכום, החלטות ומשימות מפגישות.`
  : "Staz הופך פגישות בעברית לתמצית מנהלים, החלטות ומשימות — ומחבר כל החלטה לרגע המדויק שבו היא נאמרה.";

export const SITE_KEYWORDS = [
  "סגירת פגישה",
  "תמצית מנהלים",
  "החלטות מפגישה",
  "משימות מפגישה",
  "תמלול בעברית",
  "עוזר סגירת פגישות",
  "Staz AI",
  "1stazai",
  "meeting closeout Hebrew",
];

const ogImage = `${SITE_URL}/marketing/staz-hero-cinema.webp`;
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
          width: 1920,
          height: 1080,
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
      "theme-color": "#05080a",
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
