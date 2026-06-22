"use client";

import { ChevronDown, Lock } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { IntegrationProviderMeta } from "../providers/registry";
import type { UserIntegrationsConfig } from "../types";

interface IntegrationProviderCardProps {
  provider: IntegrationProviderMeta;
  config: UserIntegrationsConfig;
  expanded: boolean;
  locked: boolean;
  onToggle: () => void;
  onUpgrade?: () => void;
  children?: React.ReactNode;
}

export function IntegrationProviderCard({
  provider,
  config,
  expanded,
  locked,
  onToggle,
  onUpgrade,
  children,
}: IntegrationProviderCardProps) {
  const { t } = useLocale();
  const Icon = provider.icon;
  const name = t[provider.nameKey];
  const description = t[provider.descKey];

  const isConnected =
    provider.id === "webhook"
      ? Boolean(config.webhook?.enabled && config.webhook.url)
      : provider.id === "slack"
        ? Boolean(config.slack?.enabled && config.slack.webhookUrl)
        : false;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-shadow",
        expanded ? "border-accent/30 shadow-sm" : "border-border",
        locked && "opacity-90",
      )}
    >
      <button
        type="button"
        onClick={() => {
          if (locked) {
            onUpgrade?.();
            return;
          }
          if (provider.available) onToggle();
        }}
        className="flex w-full items-start gap-3 p-4 text-start sm:p-5"
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isConnected ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
            {isConnected && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                {t.integConnected}
              </span>
            )}
            {!provider.available && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t.integComingSoon}
              </span>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                <Lock className="h-3 w-3" />
                Pro
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {provider.available && !locked && (
          <ChevronDown
            className={cn(
              "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {expanded && !locked && children && (
        <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {children}
        </div>
      )}
    </div>
  );
}
