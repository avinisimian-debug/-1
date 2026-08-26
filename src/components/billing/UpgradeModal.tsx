"use client";

/**
 * Upgrade gate as animated height drawer (same pattern as 21st animated-drawer).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import { motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { LaunchPriceStack } from "@/components/launch/LaunchPriceStack";
import { Button } from "@/shared/ui/button";
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
  const [elementRef, bounds] = useMeasure();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const meta = feature ? getFeatureGateMeta(feature) : null;

  if (!mounted || !open || !feature || !meta) return null;

  const Icon = meta.icon;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Content
          asChild
          className={cn(
            "fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-md overflow-hidden rounded-[28px]",
            "bg-white outline-none dark:bg-neutral-900",
            "shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)]",
          )}
        >
          <motion.div
            animate={{
              height: bounds.height > 0 ? bounds.height : "auto",
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            <div className="p-5 text-start sm:p-6" ref={elementRef}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <LogoMark size={28} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      {snap.active ? "חודש השקה · Staz Pro" : "Staz AI Pro"}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.gateEyebrow}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={onClose}
                  aria-label={t.gateNotNow}
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
                <Icon className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {t[meta.titleKey] as string}
              </h2>

              <div className="mt-3 space-y-2">
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {t[meta.line1Key] as string}
                </p>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {t[meta.line2Key] as string}
                </p>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {locale === "he"
                    ? "רוצים לשמור את כל הפגישות במקום אחד, לחזור אליהן מכל מכשיר ולבנות ספרייה שאפשר לחפש בה?"
                    : "Want every meeting saved in one place, searchable across devices?"}
                </p>
              </div>

              {snap.active ? (
                <div className="mt-5 rounded-xl border border-teal-500/20 bg-teal-500/10 p-3">
                  <LaunchPriceStack size="sm" />
                </div>
              ) : (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 py-2">
                  <Crown className="h-3.5 w-3.5 text-teal-600 dark:text-teal-300" />
                  <p className="text-xs text-neutral-800 dark:text-neutral-200">
                    {t.gatePriceHint.replace("{price}", getProPlanPriceLabel())}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="h-11 flex-1 rounded-full bg-teal-600 text-white hover:bg-teal-500"
                  onClick={() => {
                    trackLaunchEvent("pro_upgrade_click", {
                      source: "feature_gate",
                    });
                    onClose();
                    router.push(SETTINGS_UPGRADE_PATH);
                  }}
                >
                  {snap.active
                    ? `Pro · ${snap.launchPriceLabel}`
                    : t.gateStartTrial}
                </Button>
                <Button
                  variant="secondary"
                  className="h-11 flex-1 rounded-full"
                  onClick={onClose}
                >
                  {t.gateNotNow}
                </Button>
              </div>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
