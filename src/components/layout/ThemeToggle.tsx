"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/shared/lib/cn";

const THEME_OPTIONS: { value: Theme; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  const labels: Record<Theme, string> = {
    light: t.themeLight,
    dark: t.themeDark,
    system: t.themeSystem,
  };

  return (
    <div
      role="group"
      aria-label={t.themeLabel}
      className={cn(
        "flex items-center rounded-full border border-[var(--line-subtle)] bg-[var(--bg-subtle)] p-0.5",
        className,
      )}
    >
      {THEME_OPTIONS.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={labels[value]}
          aria-pressed={theme === value}
          title={labels[value]}
          className={cn(
            "rounded-full p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]",
            theme === value
              ? "bg-[var(--bg-elevated)] text-[var(--ink-primary)] shadow-xs"
              : "text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
