import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { SeoPageJsonLd } from "@/components/seo/SeoPageJsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { SEO_PAGES } from "@/lib/seo-pages";

const page = SEO_PAGES["meeting-closeout"];

export const metadata: Metadata = buildPageMetadata(
  page.title,
  page.description,
  page.path,
  [...page.keywords],
);

export default function MeetingCloseoutPage() {
  return (
    <>
      <SeoPageJsonLd page={page} />
      <SeoLandingPage page={page} />
    </>
  );
}
