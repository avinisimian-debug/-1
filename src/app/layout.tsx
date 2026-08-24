import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Heebo,
  IBM_Plex_Mono,
  Manrope,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { auth } from "@/auth";
import { AppProviders } from "@/components/providers/AppProviders";
import { buildSiteMetadata } from "@/lib/seo";
import { I18N_BOOTSTRAP_SCRIPT } from "@/lib/i18n/bootstrap-script";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildSiteMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1a16" },
  ],
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
      className={`${fraunces.variable} ${manrope.variable} ${heebo.variable} ${ibmPlexMono.variable} h-full antialiased font-ui`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: I18N_BOOTSTRAP_SCRIPT }}
        />
        {showMarketingChrome ? (
          <>
            <meta
              name="google-adsense-account"
              content="ca-pub-1517251000751283"
            />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1517251000751283"
              crossOrigin="anonymous"
            />
          </>
        ) : null}
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        {/* Chat widget removed from public landing — competed with demo/CTA conversion. */}
      </body>
    </html>
  );
}
