import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-sm", tag: "text-[10px]" },
  md: { icon: 36, text: "text-base", tag: "text-[11px]" },
  lg: { icon: 44, text: "text-xl", tag: "text-xs" },
};

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="40" height="40" rx="10" fill="#18181B" />
      <path
        d="M12 28V12h6.2c3.4 0 5.8 1.8 5.8 4.6 0 2-1.1 3.4-2.8 4l3.4 7.4h-3.6l-3-6.6H15.2V28H12zm3.2-9.2h2.8c1.8 0 2.8-.9 2.8-2.2s-1-2.2-2.8-2.2h-2.8v4.4z"
        fill="white"
      />
      <circle cx="30" cy="12" r="3" fill="#6366F1" />
    </svg>
  );
}

export function Logo({ size = "md", showTagline = false, className }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={s.icon} />
      <div className="min-w-0">
        <p className={cn("font-semibold tracking-tight text-zinc-900", s.text)}>
          {BRAND_NAME}
        </p>
        {showTagline && (
          <p className={cn("font-medium text-zinc-500", s.tag)}>{BRAND_TAGLINE}</p>
        )}
      </div>
    </div>
  );
}
