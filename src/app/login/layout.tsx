import type { Metadata } from "next";
import { buildSiteMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata({
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
