"use client";

import { cn } from "@/lib/utils";

type StazButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "onDark" | "ghost";
  size?: "md" | "sm";
};

export function StazButton({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: StazButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-160 disabled:cursor-not-allowed disabled:opacity-60",
        "rounded-[var(--staz-radius-sm)]",
        size === "md" && "min-h-12 px-5 text-sm",
        size === "sm" && "min-h-9 px-3 text-xs",
        variant === "primary" &&
          "bg-[var(--staz-primary)] text-white shadow-[0_10px_28px_-14px_rgba(31,107,92,0.65)] hover:-translate-y-px hover:bg-[var(--staz-primary-hover)]",
        variant === "secondary" &&
          "border border-[var(--staz-border)] bg-[var(--staz-surface)]/90 text-[var(--staz-ink)] hover:bg-[var(--staz-surface)]",
        variant === "onDark" &&
          "bg-[var(--staz-on-dark)] text-[var(--staz-forest)] hover:bg-white",
        variant === "ghost" &&
          "border border-white/15 bg-transparent text-[var(--staz-on-dark)] hover:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}
