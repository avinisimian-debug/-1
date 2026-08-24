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
        "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:active:scale-100",
        "rounded-full will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080a]",
        "active:scale-[0.98]",
        size === "md" && "min-h-12 px-6 text-sm",
        size === "sm" && "min-h-9 px-4 text-xs",
        variant === "primary" &&
          "bg-[linear-gradient(180deg,#5eead4_0%,#14b8a6_100%)] text-[#04110e] shadow-[0_0_0_1px_rgba(45,212,191,0.35),0_12px_40px_-12px_rgba(45,212,191,0.55)] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_0_0_1px_rgba(94,234,212,0.45),0_16px_44px_-12px_rgba(45,212,191,0.6)]",
        variant === "secondary" &&
          "border border-white/15 bg-white/[0.04] text-[var(--staz-ink)] backdrop-blur-md hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09]",
        variant === "onDark" &&
          "bg-[linear-gradient(180deg,#fff_0%,#e8eeec_100%)] text-[#04110e] shadow-[0_12px_36px_-16px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" &&
          "border border-white/15 bg-transparent text-[var(--staz-on-dark)] hover:bg-white/6 hover:border-white/25",
        className,
      )}
      {...props}
    />
  );
}
