"use client";

import Script from "next/script";
import { useSession } from "next-auth/react";

/**
 * Google AdSense for marketing / ad traffic only.
 * Hidden for signed-in users so ads do not appear inside the product.
 */
export function AdSenseMarketing() {
  const { status } = useSession();

  if (status !== "unauthenticated") {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1517251000751283"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
