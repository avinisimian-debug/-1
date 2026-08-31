"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Crown } from "lucide-react";
import { consumeProWelcomePending } from "@/lib/plan-events";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "staz-pro-welcome-dismissed";

export function ProWelcomeBanner({ className }: { className?: string }) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    if (consumeProWelcomePending()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-xl border border-teal-400/25 bg-gradient-to-r from-teal-500/10 via-teal-400/5 to-transparent px-4 py-3.5",
        className,
      )}
      role="status"
    >
      <div className="flex items-start gap-3 pe-8">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/15">
          <Crown className="h-4 w-4 text-teal-600 dark:text-teal-300" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--ink-primary)]">
            {t.proWelcomeTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
            {t.proWelcomeBody}
          </p>
          <Link
            href="/history"
            className="mt-2 inline-block text-xs font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
          >
            {t.proWelcomeLibraryCta}
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute end-2 top-2 rounded-lg p-1.5 text-[var(--ink-tertiary)] hover:bg-black/5 hover:text-[var(--ink-primary)]"
        aria-label={t.proWelcomeDismiss}
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}
