"use client";

import { LANDING } from "@/lib/landing-copy";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: "landing" | "sidebar";
  className?: string;
  onSignup?: () => void;
  onDemo?: () => void;
}

/**
 * Wires the glassmorphism-trust-hero design command into the landing.
 * Visuals stay in the locked HeroSection — do not restyle here.
 */
export function TrustSection({
  variant = "landing",
  className,
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
      className={cn("w-full overflow-hidden", className)}
      aria-labelledby="trust-heading"
      id="trust"
    >
      <h2 id="trust-heading" className="sr-only">
        {copy.headline} {copy.headlineAccent}
      </h2>
      <HeroSection />
    </section>
  );
}
