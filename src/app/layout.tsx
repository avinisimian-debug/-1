import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Rubik } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { auth } from "@/auth";
import { AppProviders } from "@/components/providers/AppProviders";
import { buildSiteMetadata } from "@/lib/seo";
import { I18N_BOOTSTRAP_SCRIPT } from "@/lib/i18n/bootstrap-script";
import "./globals.css";

/**
 * Rubik — modern geometric sans with full Hebrew + Latin.
 * Single family keeps hierarchy via weight/size/tracking (not mixed faces).
 */
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/** Monospace for timestamps / technical chips only (Latin numerals). */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = buildSiteMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#05080a" },
    { media: "(prefers-color-scheme: dark)", color: "#05080a" },
  ],
  // Stable mobile viewport — avoid interactive/resizing viewport units
  // fighting Safari chrome. safe-area env() works with cover.
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const showMarketingChrome = !session?.user;

  return (
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={`${rubik.variable} ${ibmPlexMono.variable} h-full antialiased font-ui`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: I18N_BOOTSTRAP_SCRIPT }}
        />
        {showMarketingChrome ? (
          <meta
            name="google-adsense-account"
            content="ca-pub-1517251000751283"
          />
        ) : null}
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
