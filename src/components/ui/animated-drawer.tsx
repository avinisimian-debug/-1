"use client";

/**
 * Staz account quick-actions drawer — same height-animated Vaul pattern
 * as Spectrum UI / 21st animated-drawer, adapted for product navigation.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import { motion } from "motion/react";
import {
  Crown,
  History,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/context/LocaleContext";
import { usePlan } from "@/context/PlanContext";
import { getProPlanPriceLabel } from "@/lib/constants";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

type View = "default" | "upgrade" | "signout";

export function StazAccountDrawer({
  open,
  onOpenChange,
  userName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string | null;
}) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const { isPro } = usePlan();
  const snap = getLaunchCampaignSnapshot();
  const [view, setView] = useState<View>("default");
  const [elementRef, bounds] = useMeasure();
  const he = locale === "he";

  useEffect(() => {
    if (!open) setView("default");
  }, [open]);

  const go = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const content = useMemo(() => {
    switch (view) {
      case "upgrade":
        return (
          <div className="space-y-4 text-start">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
                <Crown className="h-5 w-5" />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label={he ? "סגירה" : "Close"}
              >
                <X size={18} />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {he ? "שדרוג ל־Staz Pro" : "Upgrade to Staz Pro"}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {he
                ? "ספריית פגישות בענן, PDF מקצועי, וגישה מכל מכשיר."
                : "Cloud meeting library, professional PDF, and access from any device."}
            </p>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {snap.active
                ? he
                  ? `חודש השקה · ${snap.launchPriceLabel}`
                  : `Launch month · ${snap.launchPriceLabel}`
                : he
                  ? `${getProPlanPriceLabel()} לחודש`
                  : `${getProPlanPriceLabel()}/month`}
            </p>
            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                className="h-11 flex-1 rounded-full"
                onClick={() => setView("default")}
              >
                {he ? "חזרה" : "Back"}
              </Button>
              <Button
                className="h-11 flex-1 rounded-full bg-teal-600 text-white hover:bg-teal-500"
                onClick={() => {
                  trackLaunchEvent("pro_upgrade_click", {
                    source: "account_drawer",
                  });
                  go(SETTINGS_UPGRADE_PATH);
                }}
              >
                {he ? "להמשיך" : "Continue"}
              </Button>
            </div>
          </div>
        );
      case "signout":
        return (
          <div className="space-y-4 text-start">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                <LogOut className="h-5 w-5" />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label={he ? "סגירה" : "Close"}
              >
                <X size={18} />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {he ? "להתנתק?" : "Sign out?"}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {he
                ? "תוכלו להתחבר שוב בכל עת עם אותו אימייל."
                : "You can sign back in anytime with the same email."}
            </p>
            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                className="h-11 flex-1 rounded-full"
                onClick={() => setView("default")}
              >
                {he ? "ביטול" : "Cancel"}
              </Button>
              <Button
                className="h-11 flex-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  onOpenChange(false);
                  void signOut({ callbackUrl: "/login" });
                }}
              >
                {he ? "התנתקות" : "Sign out"}
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-start">
            <div className="flex w-full items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
                  Staz
                </p>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {userName?.trim() || (he ? "החשבון שלי" : "My account")}
                </h2>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label={he ? "סגירה" : "Close"}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => go("/settings")}
                className="flex w-full items-center gap-3 rounded-2xl bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <Settings className="h-4 w-4 shrink-0 opacity-70" />
                {t.settingsTitle ?? (he ? "הגדרות" : "Settings")}
              </button>
              <button
                type="button"
                onClick={() => go("/history")}
                className="flex w-full items-center gap-3 rounded-2xl bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <History className="h-4 w-4 shrink-0 opacity-70" />
                {he ? "היסטוריית פגישות" : "Meeting history"}
              </button>
              {!isPro ? (
                <button
                  type="button"
                  onClick={() => setView("upgrade")}
                  className="flex w-full items-center gap-3 rounded-2xl bg-teal-50 px-4 py-3.5 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100 dark:bg-teal-900/25 dark:text-teal-200 dark:hover:bg-teal-900/40"
                >
                  <Crown className="h-4 w-4 shrink-0" />
                  {he ? "שדרוג ל־Pro" : "Upgrade to Pro"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setView("signout")}
                className="flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {he ? "התנתקות" : "Sign out"}
              </button>
            </div>
          </div>
        );
    }
  }, [view, he, userName, isPro, snap, t, onOpenChange]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[70] bg-black/40" />
        <Drawer.Content
          asChild
          className={cn(
            "fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-[361px] overflow-hidden rounded-[28px]",
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
            <div className="p-5 sm:p-6" ref={elementRef}>
              {content}
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export { AnimatedDrawer } from "@/components/spectrumui/animateddrawer";
