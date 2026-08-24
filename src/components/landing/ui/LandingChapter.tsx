"use client";

import { cn } from "@/lib/utils";

export type LandingChapterTone =
  | "warm"
  | "cool"
  | "forest"
  | "product"
  | "quiet"
  | "sand";

type LandingChapterProps = {
  tone?: LandingChapterTone;
  id?: string;
  className?: string;
  innerClassName?: string;
  fullBleed?: boolean;
  children: React.ReactNode;
};

export function LandingChapter({
  tone = "warm",
  id,
  className,
  innerClassName,
  fullBleed = false,
  children,
}: LandingChapterProps) {
  return (
    <section
      id={id}
      className={cn(
        "landing-chapter",
        `landing-chapter--${tone}`,
        "py-16 sm:py-20 md:py-24",
        className,
      )}
    >
      <div
        className={cn(
          fullBleed ? "w-full px-0" : "landing-chapter-inner",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
