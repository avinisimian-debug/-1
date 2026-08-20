"use client";

import { Check } from "lucide-react";
import { LANDING } from "@/lib/landing-copy";
import { getProPlanPriceLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingPricingProps {
  onFreeSignup: () => void;
  onProSignup?: () => void;
  className?: string;
  variant?: "default" | "landing";
}

export function LandingPricing({
  onFreeSignup,
  onProSignup,
  className,
  variant = "default",
}: LandingPricingProps) {
  const copy = LANDING.pricing;
  const proPrice = getProPlanPriceLabel();
  const handlePro = onProSignup ?? onFreeSignup;
  const isLanding = variant === "landing";

  return (
    <section
      id="pricing"
      className={cn(
        "relative scroll-mt-24 overflow-hidden px-4 py-12 sm:px-6 sm:py-14",
        isLanding ? "staz-panel" : "rounded-3xl border border-black/5 bg-[var(--bg-canvas)]",
        className,
      )}
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2
            className={cn(
              "text-balance tracking-tight",
              isLanding
                ? "font-brand text-2xl text-[var(--staz-text)] sm:text-3xl"
                : "text-2xl font-bold text-foreground sm:text-3xl",
            )}
          >
            {copy.headline}
          </h2>
          <p
            className={cn(
              "mt-3 text-pretty text-sm sm:text-base",
              isLanding ? "text-[var(--staz-muted)]" : "text-muted-foreground",
            )}
          >
            {copy.subhead(proPrice)}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:items-stretch md:gap-6">
          <div
            className={cn(
              "flex flex-col p-7 text-start sm:p-8",
              isLanding
                ? "rounded-xl border border-[var(--staz-border)] bg-black/20"
                : "rounded-2xl border border-border bg-card",
            )}
          >
            <div className="mb-6">
              <p
                className={cn(
                  "text-xs font-medium",
                  isLanding ? "text-[var(--staz-muted)]" : "text-muted-foreground",
                )}
              >
                {copy.freeTag}
              </p>
              <h3
                className={cn(
                  "mt-2 text-lg font-semibold",
                  isLanding ? "text-[var(--staz-text)]" : "text-foreground",
                )}
              >
                {copy.freeTitle}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-4xl font-bold tracking-tight",
                    isLanding ? "text-[var(--staz-text)]" : "text-foreground",
                  )}
                >
                  $0
                </span>
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {copy.freeBullets.map((line) => (
                <li
                  key={line}
                  className={cn(
                    "flex items-start gap-3 text-sm leading-relaxed",
                    isLanding ? "text-[var(--staz-muted)]" : "text-foreground/90",
                  )}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--staz-green)_35%,transparent)] text-[var(--staz-green-soft)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onFreeSignup}
              className={cn(
                "w-full px-4 py-3 text-sm font-semibold",
                isLanding ? "staz-btn-secondary" : "rounded-xl border border-border bg-background",
              )}
            >
              {copy.freeCta}
            </button>
            <p
              className={cn(
                "mt-3 text-center text-xs",
                isLanding ? "text-[var(--staz-muted)]" : "text-muted-foreground",
              )}
            >
              {copy.freeNote}
            </p>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--staz-green)_45%,transparent)] bg-[#0e1512] p-7 text-start sm:p-8">
            <div className="relative mb-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--staz-green-soft)]">
                PRO
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--staz-text)]">
                {copy.proTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--staz-muted)]">{copy.proValue}</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-[var(--staz-text)]">
                  {proPrice}
                </span>
                <span className="text-sm text-[var(--staz-muted)]">{copy.perMonth}</span>
              </p>
            </div>

            <ul className="relative mb-8 flex-1 space-y-3">
              {copy.proBullets.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--staz-text)_88%,var(--staz-muted))]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--staz-green)_40%,transparent)] text-[var(--staz-green-soft)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handlePro}
              className="staz-btn-primary relative w-full"
            >
              {copy.proCta}
            </button>
            <p className="mt-3 text-center text-xs text-[var(--staz-muted)]">
              {copy.proNote(proPrice)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
