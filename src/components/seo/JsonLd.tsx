import {
  getProLifetimePrice,
  PRO_LIFETIME_PRICE,
} from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/brand";

export function JsonLd() {
  const proPrice = getProLifetimePrice();

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
    applicationSubCategory: "Meeting Transcription",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/icon-512.png`,
    featureList: [
      "AI meeting transcription",
      "Hebrew and English support",
      "Action items and summaries",
      "Speaker insights",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "Trial plan with monthly transcription quota",
        url: `${SITE_URL}/#pricing`,
      },
      {
        "@type": "Offer",
        name: "Pro Lifetime",
        price: proPrice,
        priceCurrency: "USD",
        description: SITE_TITLE,
        url: `${SITE_URL}/#pricing`,
        priceValidUntil: "2027-12-31",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "האם Staz AI תומך בתמלול בעברית?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן. Staz AI מתמחה בתמלול וסיכום פגישות בעברית ובאנגלית, כולל Zoom, Teams ו-Google Meet.",
        },
      },
      {
        "@type": "Question",
        name: "כמה עולה תוכנית Pro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `תוכנית Pro זמינה כרכישה חד־פעמית החל מ־$${proPrice} בשבוע ההשקה (או $${PRO_LIFETIME_PRICE} לאחר מכן).`,
        },
      },
      {
        "@type": "Question",
        name: "מה גודל הקובץ המקסימלי?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "בתוכנית החינמית יש מגבלת גודל נמוכה יותר. ב-Pro ניתן להעלות קבצים עד 500 MB והקלטות של 3 שעות ומעלה.",
        },
      },
    ],
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
