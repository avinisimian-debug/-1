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

const ADSENSE_CLIENT = "ca-pub-1517251000751283";
const ADSENSE_SCRIPT_ID = "staz-adsense-script";

function ensureAdSenseScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.adsbygoogle) {
      resolve(true);
      return;
    }

    const existing = document.getElementById(ADSENSE_SCRIPT_ID);
    if (existing) {
      const started = Date.now();
      const id = window.setInterval(() => {
        if (window.adsbygoogle) {
          window.clearInterval(id);
          resolve(true);
          return;
        }
        if (Date.now() - started >= 8000) {
          window.clearInterval(id);
          resolve(false);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.onload = () => resolve(Boolean(window.adsbygoogle));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Display ad unit. Requires an approved AdSense site + ad slot ID.
 * Script loads only when a unit mounts — never globally on the landing page
 * (global Auto ads inject content and cause scroll/layout jumps).
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
    let cancelled = false;

    void (async () => {
      const ready = await ensureAdSenseScript();
      if (cancelled || !ready || pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (error) {
        console.warn("[AdSense] push failed:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedSlot]);

  if (!resolvedSlot) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border/40 bg-muted/20",
        // Reserve space so late ad fill does not shove the page
        "min-h-[100px]",
        className,
      )}
      aria-hidden
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
