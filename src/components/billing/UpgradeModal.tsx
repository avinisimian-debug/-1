"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crown, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { useLocale } from "@/context/LocaleContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import { getFeatureGateMeta } from "@/lib/feature-gate";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import type { FeatureKey } from "@/lib/plan-features";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  feature: FeatureKey | null;
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ feature, open, onClose }: UpgradeModalProps) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const snap = getLaunchCampaignSnapshot();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !feature) return null;

  const meta = getFeatureGateMeta(feature);
  if (!meta) return null;

  const Icon = meta.icon;

  const handleTrial = () => {
    trackLaunchEvent("pro_upgrade_click", { source: "feature_gate" });
    onClose();
    router.push(SETTINGS_UPGRADE_PATH);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.gateNotNow}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink-primary)_28%,transparent)] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-premium)]",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        <div className="border-b border-[var(--line-subtle)] bg-[var(--bg-subtle)]/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-start">
              <LogoMark size={28} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                  {snap.active ? "Launch Month · Staz Pro" : "Staz AI Pro"}
                </p>
                <p className="text-sm font-semibold text-[var(--ink-primary)]">
                  {t.gateEyebrow}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label={t.gateNotNow}
              onClick={onClose}
              className="rounded-xl p-1.5 text-[var(--ink-tertiary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 text-start">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Icon className="h-5 w-5 text-[var(--accent)]" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-[var(--ink-primary)]">
            {t[meta.titleKey] as string}
          </h2>

          <div className="mt-3 space-y-2">
            <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
              {t[meta.line1Key] as string}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink-tertiary)]">
              {t[meta.line2Key] as string}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
              {locale === "he"
                ? "רוצים לשמור את כל הפגישות במקום אחד, לחזור אליהן מכל מכשיר ולבנות ספרייה שאפשר לחפש בה?"
                : "Want every meeting saved in one place, searchable across devices?"}
            </p>
          </div>

          {snap.active ? (
            <div className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--accent-soft)]/50 p-3">
              <LaunchPriceStack size="sm" />
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--accent-soft)]/50 px-3 py-2">
              <Crown className="h-3.5 w-3.5 text-[var(--accent)]" />
              <p className="text-xs text-[var(--ink-primary)]">
                {t.gatePriceHint.replace("{price}", getProPlanPriceLabel())}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleTrial}
              className="lat-btn-primary flex-1"
            >
              {snap.active
                ? `Pro · ${snap.launchPriceLabel}`
                : t.gateStartTrial}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="lat-btn-ghost flex-1"
            >
              {t.gateNotNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
