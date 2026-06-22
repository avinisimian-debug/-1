"use client";

import { Clock, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/shared/ui/button";

interface IntegrationsEmptyStateProps {
  onUpgrade: () => void;
}

export function IntegrationsEmptyState({ onUpgrade }: IntegrationsEmptyStateProps) {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-dashed border-accent/25 bg-gradient-to-br from-accent-muted/40 to-card p-6 sm:p-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {t.integEmptyTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t.integEmptyDesc}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
          <Clock className="h-3.5 w-3.5 text-accent" />
          {t.integEmptyStat}
        </div>
        <Button type="button" className="mt-5 w-full sm:w-auto" onClick={onUpgrade}>
          {t.integEmptyCta}
        </Button>
      </div>
    </div>
  );
}
