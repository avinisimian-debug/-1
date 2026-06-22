"use client";

import { useState } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { WebhookIntegrationConfig } from "../types";

interface WebhookConfigFormProps {
  value?: WebhookIntegrationConfig;
  saving: boolean;
  onSave: (config: WebhookIntegrationConfig) => Promise<void>;
}

export function WebhookConfigForm({
  value,
  saving,
  onSave,
}: WebhookConfigFormProps) {
  const { t } = useLocale();
  const [url, setUrl] = useState(value?.url ?? "");
  const [secret, setSecret] = useState(value?.secret ?? "");
  const [enabled, setEnabled] = useState(value?.enabled ?? false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enabled && !url.trim()) {
      setError(t.integWebhookUrlRequired);
      return;
    }

    try {
      await onSave({
        url: url.trim(),
        secret: secret.trim() || undefined,
        enabled,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.integSaveFailed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {t.integWebhookUrlLabel}
          <span
            title={t.integWebhookUrlHint}
            className="cursor-help text-muted-foreground/70"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </span>
        </label>
        <Input
          type="url"
          inputMode="url"
          placeholder="https://hooks.zapier.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {t.integWebhookSecretLabel}
          <span
            title={t.integWebhookSecretHint}
            className="cursor-help text-muted-foreground/70"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </span>
        </label>
        <Input
          type="password"
          placeholder={t.integWebhookSecretPlaceholder}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-border text-accent"
        />
        {t.integWebhookEnabled}
      </label>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <Button type="submit" size="sm" disabled={saving} className="gap-2">
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {t.integSave}
      </Button>
    </form>
  );
}
