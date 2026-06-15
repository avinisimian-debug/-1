"use client";

import { useRouter } from "next/navigation";
import { Crown, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import { getFeatureGateMeta } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/plan-features";
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
    router.push("/settings#upgrade");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.gateNotNow}
        className="absolute inset-0 bg-zinc-900/15 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl",
        )}
      >
        <div className="border-b border-zinc-100 bg-zinc-50/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoMark size={28} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Staz AI Pro
                </p>
                <p className="text-sm font-semibold text-zinc-900">{t.gateEyebrow}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label={t.gateNotNow}
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-indigo-50">
            <Icon className="h-5 w-5 text-indigo-600" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            {t[meta.titleKey] as string}
          </h2>

          <div className="mt-3 space-y-2">
            <p className="text-sm leading-relaxed text-zinc-600">
              {t[meta.line1Key] as string}
            </p>
            <p className="text-sm leading-relaxed text-zinc-500">
              {t[meta.line2Key] as string}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-md border border-indigo-100 bg-indigo-50/60 px-3 py-2">
            <Crown className="h-3.5 w-3.5 text-indigo-600" />
            <p className="text-xs text-indigo-900">
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
              className="btn-secondary flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600"
            >
              {t.gateNotNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
