"use client";

import { Clock, Target, Zap } from "lucide-react";
import { CompanyLogos } from "@/components/trust/CompanyLogos";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function LandingTrustStrip({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "border-y border-border/60 bg-muted/30 py-8",
        className,
      )}
    >
      <CompanyLogos label={t.trustUsedBy} />
    </div>
  );
}

const BENEFIT_ICONS = [Clock, Target, Zap] as const;

export function LandingBenefits({ className }: { className?: string }) {
  const { t } = useLocale();

  const benefits = [
    {
      icon: BENEFIT_ICONS[0],
      title: t.landingBenefit1Title,
      desc: t.landingBenefit1Desc,
    },
    {
      icon: BENEFIT_ICONS[1],
      title: t.landingBenefit2Title,
      desc: t.landingBenefit2Desc,
    },
    {
      icon: BENEFIT_ICONS[2],
      title: t.landingBenefit3Title,
      desc: t.landingBenefit3Desc,
    },
  ];

  return (
    <section className={cn("px-4 py-16 sm:py-20", className)}>
      <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t.landingWhyTitle}
      </h2>
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="glass-card glass-card-hover rounded-2xl p-8 text-start"
          >
            <Icon className="mb-4 h-10 w-10 text-accent" strokeWidth={1.75} />
            <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
            <p className="leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
