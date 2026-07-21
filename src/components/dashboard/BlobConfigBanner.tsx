"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { TRANSCRIPTION_STATUS_PATH } from "@/features/transcription/constants";
import { cn } from "@/lib/utils";

/**
 * Warns admins/users when production is missing Blob storage —
 * the #1 cause of video / Zoom upload failures on Vercel.
 */
export function BlobConfigBanner({ className }: { className?: string }) {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(TRANSCRIPTION_STATUS_PATH, {
          cache: "no-store",
        });
        const data = (await res.json()) as { blob?: boolean };
        if (!cancelled && data.blob === false) {
          setShow(true);
        }
      } catch {
        /* ignore probe failures */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-start sm:flex-row sm:items-start sm:gap-3",
        className,
      )}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {t.blobBannerTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{t.blobBannerBody}</p>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {t.blobBannerCta}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
