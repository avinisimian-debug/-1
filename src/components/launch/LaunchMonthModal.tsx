"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  getLaunchCampaignSnapshot,
  trackLaunchEvent,
} from "@/lib/launch-campaign";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "staz-launch-modal-dismissed-v1";

type LaunchMonthModalProps = {
  open: boolean;
  onClose: () => void;
  source?: string;
};

export function LaunchMonthModal({
  open,
  onClose,
  source = "manual",
}: LaunchMonthModalProps) {
  const router = useRouter();
  const titleId = useId();
  const snap = useMemo(() => getLaunchCampaignSnapshot(), []);

  useEffect(() => {
    if (!open || !snap.active) return;
    trackLaunchEvent("launch_modal_open", { source });
  }, [open, snap.active, source]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !snap.active) return null;

  const upgrade = () => {
    trackLaunchEvent("pro_upgrade_click", { source: "launch_modal" });
    onClose();
    router.push(SETTINGS_UPGRADE_PATH);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="סגירה"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-t-2xl border border-white/10 bg-[#080c0b] shadow-[0_0_80px_-20px_rgba(45,212,191,0.35)] sm:rounded-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        <div className="relative overflow-hidden px-6 py-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.18),transparent_60%)]"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#5eead4]">
                LAUNCH MONTH
              </p>
              <h2
                id={titleId}
                className="mt-2 font-brand text-2xl tracking-tight text-white"
              >
                PRO ב־{snap.launchPriceLabel}
              </h2>
              <p className="mt-2 text-sm text-white/55">
                <span className="line-through opacity-60">{snap.originalPriceLabel}</span>
                {" → "}
                <span className="font-semibold text-white">
                  {snap.launchPriceLabel}/חודש
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="סגירה"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/8 px-6 py-5 text-start">
          <ul className="space-y-2.5 text-sm text-white/65">
            {[
              "תמצית מנהלים והחלטות",
              "משימות עם בעלים",
              "ספריית פגישות בענן",
              "PDF מקצועי וגישה מכל מכשיר",
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <span className="text-[#5eead4]" aria-hidden>
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-white/40">{snap.billingNoteHe}</p>

          <button
            type="button"
            onClick={upgrade}
            className="staz-btn-primary mt-5 w-full"
          >
            קבלו PRO ב־{snap.launchPriceLabel}
          </button>
          <p className="mt-3 text-center text-[11px] text-white/35">
            מחיר השקה במהלך חודש ההשקה · ביטול דרך PayPal בכל עת
          </p>
        </div>
      </div>
    </div>
  );
}

/** Auto-open once per browser (not annoying). */
export function useLaunchMonthAutoModal(enabled: boolean) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled || !getLaunchCampaignSnapshot().active) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(t);
  }, [enabled]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  return { open, setOpen, close };
}
