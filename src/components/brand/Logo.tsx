import Image from "next/image";
import Link from "next/link";
import {
  BRAND_ICON_PATH,
  BRAND_LOGO_PATH,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  /** Text lockup matching landing — preferred in-app. */
  variant?: "image" | "wordmark";
  href?: string;
}

const sizes = {
  sm: { height: 32, tag: "text-[10px]", word: "text-lg", track: "tracking-[0.26em]" },
  md: { height: 40, tag: "text-[11px]", word: "text-xl", track: "tracking-[0.28em]" },
  lg: { height: 52, tag: "text-xs", word: "text-2xl", track: "tracking-[0.3em]" },
};

/** Square crop of the shield emblem from the full lockup. */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={BRAND_ICON_PATH}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-md", className)}
      style={{ width: size, height: size }}
      draggable={false}
      aria-hidden
    />
  );
}

export function Logo({
  size = "md",
  showTagline = false,
  className,
  tagline,
  variant = "wordmark",
  href = "/",
}: LogoProps) {
  const s = sizes[size];
  const width = Math.round(s.height * 3.6);
  const displayTagline = tagline ?? (showTagline ? BRAND_TAGLINE : undefined);

  const inner =
    variant === "image" ? (
      <div className={cn("flex flex-col items-start gap-1", className)}>
        <Image
          src={BRAND_LOGO_PATH}
          alt={BRAND_NAME}
          width={width}
          height={s.height}
          className="h-auto w-auto max-w-none"
          style={{ height: s.height, width: "auto" }}
          priority={size === "lg"}
          draggable={false}
        />
        {showTagline && displayTagline ? (
          <p className={cn("font-medium text-[var(--ink-tertiary)]", s.tag)}>
            {displayTagline}
          </p>
        ) : null}
      </div>
    ) : (
      <div className={cn("flex flex-col items-start gap-1", className)}>
        <span
          className={cn(
            "font-brand font-semibold text-[var(--ink-primary)]",
            s.word,
            s.track,
          )}
        >
          {BRAND_NAME}
        </span>
        {showTagline && displayTagline ? (
          <p
            className={cn(
              "font-medium tracking-wide text-[var(--accent)]",
              s.tag,
            )}
          >
            {displayTagline}
          </p>
        ) : null}
      </div>
    );

  if (!href) return inner;

  return (
    <Link href={href} className="block transition-opacity hover:opacity-90">
      {inner}
    </Link>
  );
}
