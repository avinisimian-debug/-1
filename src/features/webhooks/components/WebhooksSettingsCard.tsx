"use client";

import Link from "next/link";
import { ChevronRight, Webhook } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function WebhooksSettingsCard() {
  const { t } = useLocale();

  return (
    <Link
      href="/settings/webhooks"
      className={cn(
        "group glass-card flex items-center gap-4 rounded-xl p-5 sm:p-6",
        "transition-all hover:border-accent/30 hover:shadow-md",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-amber-500/15 ring-1 ring-accent/15">
          <Webhook className="h-5 w-5 text-accent" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">
            {t.webhooksSettingsCardTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t.webhooksSettingsCardDesc}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent",
          "transition-colors group-hover:text-accent/80",
        )}
      >
        {t.webhooksSettingsCardCta}
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
