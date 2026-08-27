"use client";

import { LANDING } from "@/lib/landing-copy";
import { StazGlassTrustHero } from "@/components/ui/glassmorphism-trust-hero";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: "landing" | "sidebar";
  className?: string;
  onSignup?: () => void;
  onDemo?: () => void;
}

/**
 * Glassmorphism trust block wired with Staz copy and CTAs —
 * product section, not a portfolio demo paste.
 */
export function TrustSection({
  variant = "landing",
  className,
  onSignup,
  onDemo,
}: TrustSectionProps) {
  const copy = LANDING.trust;

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-3 px-1", className)}>
        <p className="text-xs font-medium text-muted-foreground">
          {copy.headline} {copy.headlineAccent}
        </p>
        <ul className="space-y-2">
          {copy.items.map((item) => (
            <li key={item.title} className="text-xs leading-relaxed text-foreground/80">
              <span className="font-medium text-foreground">{item.title}</span>
              {" — "}
              {item.body}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "w-full overflow-hidden bg-[#05080a] px-4 py-14 sm:px-6 sm:py-20",
        className,
      )}
      aria-labelledby="trust-heading"
      id="trust"
    >
      <h2 id="trust-heading" className="sr-only">
        {copy.headline} {copy.headlineAccent}
      </h2>
      <StazGlassTrustHero onPrimary={onSignup} onSecondary={onDemo} />
    </section>
  );
}
