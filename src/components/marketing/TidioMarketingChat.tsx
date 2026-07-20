"use client";

import Script from "next/script";
import { useSession } from "next-auth/react";

/**
 * Tidio chat for marketing / ad traffic only.
 * Hidden for signed-in users so it does not clutter the product UI.
 */
export function TidioMarketingChat() {
  const { status } = useSession();

  if (status === "authenticated") {
    return null;
  }

  // Wait until session is known so we don't flash the widget for logged-in users
  if (status === "loading") {
    return null;
  }

  return (
    <Script
      src="https://code.tidio.co/rxthk18hhvew8n55ixhfsgutafyhwwyc.js"
      strategy="afterInteractive"
    />
  );
}
