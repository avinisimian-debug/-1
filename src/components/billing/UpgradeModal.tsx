"use client";

import { useRouter } from "next/navigation";
import { Crown, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import { getFeatureGateMeta } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/plan-features";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  feature: FeatureKey | null;
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ feature, open, onClose }: UpgradeModalProps) {
  const { t } = useLocale();
  const router = useRouter();

  if (!open || !feature) return null;

  const meta = getFeatureGateMeta(feature);
  if (!meta) return null;

  const Icon = meta.icon;

  const handleTrial = () => {
    onClose();
    router.push(SETTINGS_UPGRADE_PATH);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.gateNotNow}
        className="absolute inset-0 bg-foreground/15 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
        )}
      >
        <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-start">
              <LogoMark size={28} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Staz AI Pro
                </p>
                <p className="text-sm font-semibold text-foreground">{t.gateEyebrow}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={t.gateNotNow}
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 text-start">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-muted">
            <Icon className="h-5 w-5 text-accent" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t[meta.titleKey] as string}
          </h2>

          <div className="mt-3 space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t[meta.line1Key] as string}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground/80">
              {t[meta.line2Key] as string}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent-muted/50 px-3 py-2">
            <Crown className="h-3.5 w-3.5 text-accent" />
            <p className="text-xs text-foreground">
              {t.gatePriceHint.replace("{price}", getProPlanPriceLabel())}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleTrial}
              className="btn-cinema flex-1 px-4 py-2.5 text-sm font-medium"
            >
              {t.gateStartTrial}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {t.gateNotNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
