import type { Metadata } from "next";
import { buildSiteMetadata, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata({
  title: "Sign in — Start free AI transcription",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  openGraph: {
    url: `${SITE_URL}/login`,
    title: "Sign in — Staz AI",
    description: SITE_DESCRIPTION,
  },
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
