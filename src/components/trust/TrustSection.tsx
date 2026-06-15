"use client";

import { CompanyLogos } from "@/components/trust/CompanyLogos";
import { TestimonialsCarousel } from "@/components/dashboard/TestimonialsCarousel";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: "landing" | "sidebar";
  className?: string;
}

export function TrustSection({ variant = "landing", className }: TrustSectionProps) {
  const { t } = useLocale();

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-4 px-1", className)}>
        <CompanyLogos label={t.trustUsedBy} compact />
        <TestimonialsCarousel variant="compact" />
      </div>
    );
  }

  return (
    <section className={cn("w-full space-y-8", className)}>
      <div className="rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-sm sm:px-10">
        <CompanyLogos label={t.trustUsedBy} />
      </div>
      <TestimonialsCarousel variant="premium" />
    </section>
  );
}
