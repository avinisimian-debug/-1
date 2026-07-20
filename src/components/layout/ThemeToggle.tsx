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
        "flex items-center rounded-lg border border-border bg-muted/40 p-0.5",
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
            "rounded-md p-1.5 transition-colors",
            theme === value
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
