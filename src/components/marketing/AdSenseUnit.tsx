"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSenseUnitProps {
  /** AdSense ad slot ID from AdSense → Ads → Ad units */
  slot?: string;
  className?: string;
  format?: "auto" | "horizontal" | "rectangle";
}

/**
 * Display ad unit. Requires an approved AdSense site + ad slot ID
 * (or Auto ads enabled in the AdSense dashboard).
 */
export function AdSenseUnit({
  slot,
  className,
  format = "auto",
}: AdSenseUnitProps) {
  const pushed = useRef(false);
  const resolvedSlot =
    slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";

  useEffect(() => {
    if (!resolvedSlot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (error) {
      console.warn("[AdSense] push failed:", error);
    }
  }, [resolvedSlot]);

  if (!resolvedSlot) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border/40 bg-muted/20",
        className,
      )}
      aria-hidden
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1517251000751283"
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
