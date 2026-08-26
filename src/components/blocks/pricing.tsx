"use client";

/**
 * Pricing block inspired by the Codehagen / 21st.dev public API
 * (plans + monthly/yearly toggle + popular highlight).
 *
 * Original Prism UI source is AGPL — this is an independent reimplementation
 * using Staz-friendly styling and the existing shared Switch/Button primitives.
 * Official install (when you have API_KEY_21ST):
 *   npx shadcn@latest add "https://21st.dev/r/Codehagen/pricing"
 */

import { useCallback, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export type PricingPlan = {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href?: string;
  isPopular?: boolean;
  onClick?: () => void;
  note?: string;
  badge?: string;
  /** Replaces the default $amount + period row (e.g. LaunchPriceStack). */
  priceNode?: ReactNode;
  disabled?: boolean;
};

export type PricingProps = {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  /** When false, hides monthly/yearly toggle (Staz is monthly-only). */
  showToggle?: boolean;
  className?: string;
  /** Dark glass look for the landing stage. */
  tone?: "default" | "stage";
};

function fireConfetti(anchor: HTMLElement | null) {
  if (!anchor || typeof document === "undefined") return;
  const rect = anchor.getBoundingClientRect();
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText =
    "pointer-events:none;position:fixed;inset:0;z-index:80;overflow:hidden";
  document.body.appendChild(root);

  const colors = ["#2dd4bf", "#5eead4", "#14b8a6", "#f4f7f6", "#38bdf8"];
  for (let i = 0; i < 28; i++) {
    const bit = document.createElement("span");
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 40;
    const y = rect.top + rect.height / 2;
    const dx = (Math.random() - 0.5) * 220;
    const dy = -80 - Math.random() * 160;
    const rot = Math.random() * 360;
    bit.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;width:6px;height:8px;
      background:${colors[i % colors.length]};border-radius:1px;
      transform:translate(0,0) rotate(${rot}deg);opacity:1;
      transition:transform 900ms cubic-bezier(0.16,1,0.3,1),opacity 900ms ease;
    `;
    root.appendChild(bit);
    requestAnimationFrame(() => {
      bit.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot + 120}deg)`;
      bit.style.opacity = "0";
    });
  }
  window.setTimeout(() => root.remove(), 1000);
}

function AnimatedAmount({ value }: { value: string }) {
  return (
    <span
      key={value}
      className="inline-block tabular-nums tracking-tight animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      ${value}
    </span>
  );
}

function PricingCard({
  plan,
  isYearly,
  index,
  total,
  isDesktop,
  tone,
}: {
  plan: PricingPlan;
  isYearly: boolean;
  index: number;
  total: number;
  isDesktop: boolean;
  tone: "default" | "stage";
}) {
  const mid = (total - 1) / 2;
  const offset = index - mid;
  const fanRotate = isDesktop && total > 1 ? offset * -4 : 0;
  const stage = tone === "stage";

  const amount = isYearly ? plan.yearlyPrice : plan.price;

  const handleAction = () => {
    if (plan.onClick) {
      plan.onClick();
      return;
    }
    if (plan.href) {
      window.location.assign(plan.href);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 sm:p-7",
        "will-change-transform hover:-translate-y-1",
        stage
          ? "border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-white/18 hover:bg-white/[0.05]"
          : "border-border bg-card shadow-sm hover:shadow-md",
        plan.isPopular &&
          (stage
            ? "border-teal-400/30 shadow-[0_0_60px_-24px_rgba(45,212,191,0.5)]"
            : "border-accent/40 ring-1 ring-accent/20"),
      )}
      style={{
        transform: isDesktop
          ? `perspective(1200px) rotateY(${fanRotate}deg)`
          : undefined,
        animationDelay: `${index * 70}ms`,
      }}
    >
      {(plan.isPopular || plan.badge) && (
        <span
          className={cn(
            "absolute end-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide",
            stage
              ? "border border-teal-400/30 bg-teal-400/10 text-[#5eead4]"
              : "bg-accent/15 text-accent",
          )}
        >
          {plan.badge ?? "Most Popular"}
        </span>
      )}

      <div className="mb-5">
        <p
          className={cn(
            "text-xs font-semibold tracking-wide uppercase",
            stage ? "text-[#5eead4]" : "text-accent",
          )}
        >
          {plan.name}
        </p>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            stage ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {plan.description}
        </p>
      </div>

      {plan.priceNode ? (
        <div className="mb-6">{plan.priceNode}</div>
      ) : (
        <div className="mb-6 flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              "text-4xl font-bold",
              stage ? "text-white" : "text-foreground",
            )}
          >
            <AnimatedAmount value={amount} />
          </span>
          <span
            className={cn(
              "text-sm",
              stage ? "text-white/50" : "text-muted-foreground",
            )}
          >
            {plan.period}
          </span>
        </div>
      )}

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-3 text-sm leading-relaxed",
              stage ? "text-white/70" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                stage
                  ? "bg-teal-400/10 text-[#5eead4]"
                  : "bg-accent/10 text-accent",
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={plan.isPopular ? "default" : "outline"}
        size="lg"
        disabled={plan.disabled}
        className={cn(
          "w-full",
          plan.isPopular &&
            stage &&
            "border-transparent bg-[linear-gradient(180deg,#fff_0%,#e8eeec_100%)] text-[#04110e] hover:bg-white",
          !plan.isPopular &&
            stage &&
            "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.09]",
        )}
        onClick={handleAction}
      >
        {plan.buttonText}
      </Button>
      {plan.note ? (
        <p
          className={cn(
            "mt-3 text-center text-xs",
            stage ? "text-white/45" : "text-muted-foreground",
          )}
        >
          {plan.note}
        </p>
      ) : null}
    </div>
  );
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you.\nAll plans include access to our platform and dedicated support.",
  showToggle = true,
  className,
  tone = "default",
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const stage = tone === "stage";

  const onToggle = useCallback(
    (checked: boolean) => {
      setIsYearly(checked);
      if (checked) fireConfetti(toggleRef.current);
    },
    [],
  );

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          className={cn(
            "text-balance text-2xl font-semibold tracking-tight sm:text-3xl",
            stage ? "font-brand text-[var(--staz-ink)]" : "text-foreground",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-3 whitespace-pre-line text-pretty text-sm sm:text-base",
            stage ? "text-[var(--staz-muted)]" : "text-muted-foreground",
          )}
        >
          {description}
        </p>

        {showToggle ? (
          <div
            ref={toggleRef}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Label
              htmlFor="pricing-billing"
              className={cn(
                "text-sm",
                !isYearly
                  ? stage
                    ? "text-white"
                    : "text-foreground"
                  : stage
                    ? "text-white/45"
                    : "text-muted-foreground",
              )}
            >
              Monthly
            </Label>
            <Switch
              id="pricing-billing"
              checked={isYearly}
              onCheckedChange={onToggle}
              aria-label="Toggle yearly billing"
            />
            <Label
              htmlFor="pricing-billing"
              className={cn(
                "text-sm",
                isYearly
                  ? stage
                    ? "text-white"
                    : "text-foreground"
                  : stage
                    ? "text-white/45"
                    : "text-muted-foreground",
              )}
            >
              Yearly
              <span
                className={cn(
                  "ms-1.5 text-xs font-medium",
                  stage ? "text-[#5eead4]" : "text-accent",
                )}
              >
                Save ~20%
              </span>
            </Label>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "mx-auto grid max-w-5xl gap-5 md:items-stretch md:gap-4",
          plans.length === 1 && "max-w-md",
          plans.length === 2 && "md:grid-cols-2",
          plans.length >= 3 && "md:grid-cols-3",
        )}
      >
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            isYearly={isYearly}
            index={index}
            total={plans.length}
            isDesktop={isDesktop}
            tone={tone}
          />
        ))}
      </div>
    </section>
  );
}
