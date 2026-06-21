"use client";

import { CheckCircle } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SETTINGS_UPGRADE_PATH } from "@/lib/upgrade-navigation";
import { cn } from "@/lib/utils";

interface LandingPricingProps {
  onFreeSignup: () => void;
  className?: string;
}

export function LandingPricing({
  onFreeSignup,
  className,
}: LandingPricingProps) {
  const { t } = useLocale();

  return (
    <section
      id="pricing"
      className={cn(
        "bg-foreground px-4 py-16 text-background sm:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          {t.landingPricingTitle}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-8 text-start">
            <h3 className="mb-5 text-xl font-bold">{t.landingPricingFreeTitle}</h3>
            <ul className="mb-6 space-y-3">
              {[t.landingPricingFree1, t.landingPricingFree2].map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onFreeSignup}
              className="w-full rounded-lg border border-background/20 bg-background/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-background/20"
            >
              {t.authSubmit}
            </button>
          </div>

          <div className="rounded-2xl bg-accent p-8 text-start text-accent-foreground shadow-lg shadow-accent/20">
            <h3 className="mb-5 text-xl font-bold">{t.landingPricingProTitle}</h3>
            <ul className="mb-6 space-y-3">
              {[
                t.landingPricingPro1,
                t.landingPricingPro2,
                t.landingPricingPro3,
              ].map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="h-5 w-5 shrink-0 opacity-90" />
                  {line}
                </li>
              ))}
            </ul>
            <a
              href={SETTINGS_UPGRADE_PATH}
              className="btn-cinema flex w-full items-center justify-center rounded-lg bg-background px-4 py-2.5 text-sm font-medium text-foreground"
            >
              {t.planUpgrade}
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-background/60">
          {t.landingPricingEnterprise}{" "}
          <a
            href="mailto:sales@staz.ai?subject=Enterprise%20Plan"
            className="underline underline-offset-2 hover:text-background"
          >
            sales@staz.ai
          </a>
        </p>
      </div>
    </section>
  );
}
