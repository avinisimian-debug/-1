"use client";

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "center",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "start";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-[13px] font-medium tracking-[0.08em]",
            tone === "light"
              ? "text-[var(--staz-primary)]"
              : "text-[color-mix(in_srgb,var(--staz-sage)_85%,white)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "mt-3 text-balance font-brand text-2xl leading-[1.2] tracking-tight sm:text-3xl md:text-[2.2rem]",
          tone === "light" ? "text-[var(--staz-ink)]" : "text-[var(--staz-on-dark)]",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-pretty text-sm leading-relaxed sm:text-base",
            tone === "light"
              ? "text-[var(--staz-muted)]"
              : "text-[var(--staz-on-dark-muted)]",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
