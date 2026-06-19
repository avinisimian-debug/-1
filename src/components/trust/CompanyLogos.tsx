"use client";

import { TRUST_COMPANIES } from "@/lib/trust-data";
import { cn } from "@/lib/utils";

interface CompanyLogosProps {
  label?: string;
  compact?: boolean;
  className?: string;
}

export function CompanyLogos({ label, compact, className }: CompanyLogosProps) {
  const companies = compact ? TRUST_COMPANIES.slice(0, 4) : TRUST_COMPANIES;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <p
          className={cn(
            "mb-3 font-semibold uppercase tracking-[0.2em] text-muted-foreground",
            compact ? "text-center text-[9px]" : "text-center text-[10px]",
          )}
        >
          {label}
        </p>
      )}
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-8 gap-y-3",
          compact && "gap-x-3 gap-y-2",
        )}
      >
        {companies.map((company) => (
          <span
            key={company.id}
            className={cn(
              "select-none font-semibold tracking-tight text-muted-foreground grayscale transition-opacity hover:opacity-80",
              compact ? "text-[11px] opacity-50" : "text-sm opacity-60",
            )}
          >
            {company.name}
          </span>
        ))}
      </div>
    </div>
  );
}
