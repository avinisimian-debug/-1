import { BRAND_NAME } from "@/lib/brand";
import type { SeoPageConfig } from "@/lib/seo-pages";
import { seoPageUrl } from "@/lib/seo-pages";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export function SeoPageJsonLd({ page }: { page: SeoPageConfig }) {
  const pageUrl = seoPageUrl(page.slug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND_NAME,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: pageUrl,
      },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: pageUrl,
    inLanguage: "he-IL",
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "SoftwareApplication",
      name: BRAND_NAME,
      applicationCategory: "BusinessApplication",
      description: SITE_DESCRIPTION,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/marketing/staz-hero-cinema.webp`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  );
}
