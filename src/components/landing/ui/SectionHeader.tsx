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
        "max-w-3xl landing-reveal",
        align === "center" ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-[12px] font-semibold uppercase tracking-[0.18em]",
            tone === "light"
              ? "text-[var(--staz-primary)]"
              : "text-[#5eead4]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "mt-3 text-balance font-brand text-[1.75rem] leading-[1.18] tracking-tight sm:text-3xl md:text-[2.35rem] md:leading-[1.12]",
          tone === "light" ? "text-[var(--staz-ink)]" : "text-white",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-pretty text-[0.95rem] leading-[1.7] sm:text-base",
            tone === "light"
              ? "text-[var(--staz-muted)]"
              : "text-white/55",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
