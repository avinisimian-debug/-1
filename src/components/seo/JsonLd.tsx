import {
  getProPlanPrice,
  PRO_PLAN_REGULAR_PRICE,
} from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_URL } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING } from "@/lib/landing-copy";
import { SEO_PAGE_LIST } from "@/lib/seo-pages";

export function JsonLd() {
  const proPrice = getProPlanPrice();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: "sales@staz.ai",
    sameAs: [SITE_URL],
    contactPoint: {
      "@type": "ContactPoint",
      email: "sales@staz.ai",
      contactType: "sales",
      availableLanguage: ["Hebrew", "English"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: ["he", "en"],
    keywords: SITE_KEYWORDS.slice(0, 20).join(", "),
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "תמלול וסיכום פגישות בעברית עם AI",
    serviceType: "AI meeting transcription and closeout",
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    availableLanguage: ["Hebrew", "English"],
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Meeting transcription and closeout",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "he",
    image: `${SITE_URL}/icon-512.png`,
    keywords: SITE_KEYWORDS.slice(0, 25).join(", "),
    featureList: [
      "תמלול פגישות בעברית",
      "סיכום פגישות אוטומטי",
      "תמצית מנהלים",
      "החלטות ומשימות",
      "קפיצה לרגע בתמלול",
      "ספריית פגישות בענן",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "התחלה חינם — תמצית, החלטות ומשימות",
        url: `${SITE_URL}/#pricing`,
      },
      {
        "@type": "Offer",
        name: "Pro monthly",
        price: proPrice,
        priceCurrency: "USD",
        description: `Staz Pro — $${PRO_PLAN_REGULAR_PRICE} לחודש`,
        url: `${SITE_URL}/#pricing`,
        priceValidUntil: "2027-12-31",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LANDING.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Staz AI guides",
    itemListElement: SEO_PAGE_LIST.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.title,
      url: `${SITE_URL}${page.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigation) }}
      />
    </>
  );
}
