"use client";

import { Crown, Lock, Sparkles, Webhook, Zap } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/shared/ui/button";

interface WebhooksLockedStateProps {
  onUpgrade: () => void;
}

export function WebhooksLockedState({ onUpgrade }: WebhooksLockedStateProps) {
  const { t } = useLocale();

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-card to-amber-50/50 dark:from-violet-950/20 dark:via-card dark:to-amber-950/10">
      <div className="border-b border-border/50 bg-card/60 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
            <Crown className="h-3 w-3" />
            Pro
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            {t.webhooksLockedBadge}
          </span>
        </div>
      </div>

      <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-amber-500 shadow-lg shadow-violet-500/20">
          <Webhook className="h-7 w-7 text-white" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          {t.webhooksLockedTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t.webhooksLockedDesc}
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-start text-sm text-muted-foreground">
          {[
            t.webhooksLockedFeature1,
            t.webhooksLockedFeature2,
            t.webhooksLockedFeature3,
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          size="lg"
          onClick={onUpgrade}
          className="mt-8 gap-2 px-8 shadow-md"
        >
          <Zap className="h-4 w-4" />
          {t.webhooksLockedCta}
        </Button>
      </div>
    </div>
  );
}
