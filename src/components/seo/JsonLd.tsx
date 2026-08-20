import {
  getProPlanPrice,
  PRO_PLAN_REGULAR_PRICE,
} from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/brand";
import { LANDING } from "@/lib/landing-copy";

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
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Meeting Closeout",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/icon-512.png`,
    featureList: [
      "תמצית מנהלים בעברית",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
