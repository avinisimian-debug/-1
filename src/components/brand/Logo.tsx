import Link from "next/link";
import type { CSSProperties } from "react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  /** Prefer mark+wordmark lockup. `wordmark` = text only (rare). */
  variant?: "lockup" | "mark" | "wordmark";
  /** dark = on black/teal stages; light = on canvas/app chrome */
  tone?: "dark" | "light";
  href?: string | null;
  /** Show only the seal (no wordmark). */
  markOnly?: boolean;
}

const SIZE = {
  sm: {
    mark: 28,
    word: "text-lg",
    track: "tracking-[0.26em]",
    tag: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    mark: 36,
    word: "text-xl",
    track: "tracking-[0.28em]",
    tag: "text-[11px]",
    gap: "gap-2.5",
  },
  lg: {
    mark: 44,
    word: "text-2xl",
    track: "tracking-[0.3em]",
    tag: "text-xs",
    gap: "gap-3",
  },
  xl: {
    mark: 56,
    word: "text-4xl",
    track: "tracking-[0.3em]",
    tag: "text-sm",
    gap: "gap-3.5",
  },
} as const;

/**
 * Geometric closeout seal — teal check in dark tile.
 * Solid colors (no gradient ids) so many instances can coexist on one page.
 */
export function StazMark({
  size = 32,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-[0_0_12px_rgba(45,212,191,0.25)]", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect
        x="2.5"
        y="2.5"
        width="59"
        height="59"
        rx="15"
        fill="#05080A"
        stroke="#2DD4BF"
        strokeWidth="1.75"
        strokeOpacity="0.85"
      />
      <path
        d="M17.5 33.5 L28.2 44.2 L48 20.5"
        stroke="#5EEAD4"
        strokeWidth="6.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M17.5 33.5 L28.2 44.2 L48 20.5"
        stroke="#99F6E4"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        opacity="0.55"
      />
    </svg>
  );
}

/** @deprecated Prefer StazMark — kept for existing imports. */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <StazMark size={size} className={className} />;
}

export function Logo({
  size = "md",
  showTagline = false,
  className,
  tagline,
  variant = "lockup",
  tone = "light",
  href = "/",
  markOnly = false,
}: LogoProps) {
  const s = SIZE[size];
  const displayTagline = tagline ?? (showTagline ? BRAND_TAGLINE : undefined);
  const ink = tone === "dark" ? "text-white" : "text-[var(--ink-primary)]";
  const muted = tone === "dark" ? "text-[#5eead4]" : "text-[var(--accent)]";
  const resolvedVariant = markOnly ? "mark" : variant;

  const word = (
    <span
      className={cn(
        "font-brand font-semibold leading-none",
        ink,
        s.word,
        s.track,
      )}
    >
      {BRAND_NAME}
    </span>
  );

  const inner =
    resolvedVariant === "mark" ? (
      <StazMark size={s.mark} title={BRAND_NAME} className={className} />
    ) : resolvedVariant === "wordmark" ? (
      <div className={cn("flex flex-col items-start gap-1", className)}>
        {word}
        {showTagline && displayTagline ? (
          <p className={cn("font-medium tracking-wide", muted, s.tag)}>
            {displayTagline}
          </p>
        ) : null}
      </div>
    ) : (
      <div className={cn("flex flex-col items-start gap-1", className)}>
        <div className={cn("flex items-center", s.gap)}>
          <StazMark size={s.mark} />
          {word}
        </div>
        {showTagline && displayTagline ? (
          <p
            className={cn("font-medium tracking-wide", muted, s.tag)}
            style={
              {
                paddingInlineStart: `calc(${s.mark}px + 0.625rem)`,
              } as CSSProperties
            }
          >
            {displayTagline}
          </p>
        ) : null}
      </div>
    );

  if (href === null) return inner;

  return (
    <Link
      href={href}
      className="inline-flex transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={BRAND_NAME}
    >
      {inner}
    </Link>
  );
}
