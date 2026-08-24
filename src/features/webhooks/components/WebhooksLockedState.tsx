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
    <div className="staz-surface-card staz-surface-card--static overflow-hidden">
      <div className="border-b border-[var(--line-subtle)] bg-[var(--bg-subtle)]/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
            <Crown className="h-3 w-3" />
            Pro
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--ink-tertiary)]">
            <Lock className="h-3 w-3" />
            {t.webhooksLockedBadge}
          </span>
        </div>
      </div>

      <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--accent)_55%,transparent)]">
          <Webhook className="h-7 w-7 text-white" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-[var(--ink-primary)]">
          {t.webhooksLockedTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-secondary)]">
          {t.webhooksLockedDesc}
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-start text-sm text-[var(--ink-secondary)]">
          {[
            t.webhooksLockedFeature1,
            t.webhooksLockedFeature2,
            t.webhooksLockedFeature3,
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
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
