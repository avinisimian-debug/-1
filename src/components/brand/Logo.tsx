import Image from "next/image";
import { BRAND_ICON_PATH, BRAND_LOGO_PATH, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

const sizes = {
  sm: { height: 32, tag: "text-[10px]" },
  md: { height: 40, tag: "text-[11px]" },
  lg: { height: 52, tag: "text-xs" },
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

export function Logo({ size = "md", showTagline = false, className, tagline }: LogoProps) {
  const s = sizes[size];
  const width = Math.round(s.height * 3.6);
  const displayTagline = tagline ?? (showTagline ? BRAND_TAGLINE : undefined);

  return (
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
      {showTagline && displayTagline && (
        <p className={cn("font-medium text-zinc-500", s.tag)}>{displayTagline}</p>
      )}
    </div>
  );
}
