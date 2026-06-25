"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Link2,
  Loader2,
  Send,
  Shield,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { cn } from "@/lib/utils";
import {
  fetchWebhooksConfig,
  saveWebhooksConfig,
  testWebhook,
  type WebhookSettingsResponse,
} from "../api/webhooks.client";

const MAX_URL_LENGTH = 2048;

function validateHttpsUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.length > MAX_URL_LENGTH) return false;
  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

type ButtonStatus = "idle" | "loading" | "success";

export function WebhooksSettingsPanel() {
  const { t, rtl } = useLocale();
  const [url, setUrl] = useState("");
  const [signingKey, setSigningKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>("idle");
  const [testStatus, setTestStatus] = useState<ButtonStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [urlTouched, setUrlTouched] = useState(false);

  const urlError = useMemo(() => {
    if (!urlTouched && !url.trim()) return null;
    if (isActive && !url.trim()) return t.webhooksUrlRequired;
    if (url.trim() && !validateHttpsUrl(url)) return t.webhooksUrlInvalid;
    return null;
  }, [url, urlTouched, isActive, t.webhooksUrlInvalid, t.webhooksUrlRequired]);

  const applyConfig = useCallback((settings: WebhookSettingsResponse) => {
    setUrl(settings.url ?? "");
    setSigningKey(settings.signingKey ?? "");
    setIsActive(settings.isActive ?? false);
    setUrlTouched(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await fetchWebhooksConfig();
      applyConfig(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.webhooksLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [applyConfig, t.webhooksLoadFailed]);

  useEffect(() => {
    load();
  }, [load]);

  const flashSuccess = (
    setter: (status: ButtonStatus) => void,
    ms = 2200,
  ) => {
    setter("success");
    window.setTimeout(() => setter("idle"), ms);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setError(null);
    setUrlTouched(true);

    if (urlError) {
      setError(urlError);
      return;
    }

    setSaveStatus("loading");
    try {
      const settings = await saveWebhooksConfig({
        url: url.trim(),
        signingKey: signingKey.trim(),
        isActive,
      });
      applyConfig(settings);
      setBanner({ type: "success", text: t.webhooksSaveSuccess });
      flashSuccess(setSaveStatus);
    } catch (err) {
      const text = err instanceof Error ? err.message : t.webhooksSaveFailed;
      setError(text);
      setBanner({ type: "error", text });
      setSaveStatus("idle");
    }
  };

  const handleTest = async () => {
    setBanner(null);
    setError(null);
    setUrlTouched(true);

    if (!url.trim()) {
      setError(t.webhooksUrlRequired);
      return;
    }
    if (!validateHttpsUrl(url)) {
      setError(t.webhooksUrlInvalid);
      return;
    }

    setTestStatus("loading");
    try {
      const result = await testWebhook(
        url.trim(),
        signingKey.trim() || undefined,
      );
      setBanner({
        type: "success",
        text: t.webhooksTestSuccess.replace(
          "{status}",
          String(result.statusCode ?? 200),
        ),
      });
      flashSuccess(setTestStatus);
    } catch (err) {
      const text = err instanceof Error ? err.message : t.webhooksTestFailed;
      setError(text);
      setBanner({ type: "error", text });
      setTestStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">{t.webhooksLoading}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6" dir={rtl ? "rtl" : "ltr"}>
      <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3.5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t.webhooksPayloadNote}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="webhook-url"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <Link2 className="h-3.5 w-3.5" />
          {t.webhooksUrlLabel}
          <span title={t.webhooksUrlHint} className="cursor-help text-muted-foreground/70">
            <HelpCircle className="h-3.5 w-3.5" />
          </span>
        </Label>
        <Input
          id="webhook-url"
          type="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://hooks.example.com/transcription"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setUrlTouched(true)}
          className={cn(
            "font-mono text-sm",
            urlError && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200",
          )}
          aria-invalid={Boolean(urlError)}
          aria-describedby={urlError ? "webhook-url-error" : undefined}
        />
        {urlError ? (
          <p
            id="webhook-url-error"
            className="flex items-center gap-1.5 text-xs text-red-600"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {urlError}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">{t.webhooksUrlHint}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="webhook-signing-key"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <Shield className="h-3.5 w-3.5" />
          {t.webhooksSecretLabel}
          <span
            title={t.webhooksSecretHint}
            className="cursor-help text-muted-foreground/70"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </span>
        </Label>
        <Input
          id="webhook-signing-key"
          type="password"
          dir="ltr"
          placeholder={t.webhooksSecretPlaceholder}
          value={signingKey}
          onChange={(e) => setSigningKey(e.target.value)}
          className="text-sm"
        />
        <p className="text-[11px] text-muted-foreground">{t.webhooksSecretHint}</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{t.webhooksActiveLabel}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.webhooksEnabled}</p>
        </div>
        <Switch
          id="webhook-active"
          checked={isActive}
          onCheckedChange={setIsActive}
          aria-label={t.webhooksActiveLabel}
        />
      </div>

      {(banner || error) && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg px-4 py-3 text-sm",
            banner?.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800",
          )}
          role={banner?.type === "error" || error ? "alert" : "status"}
        >
          {banner?.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{banner?.text ?? error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={saveStatus === "loading" || testStatus === "loading"}
          className="gap-2 sm:min-w-[140px]"
        >
          {saveStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveStatus === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : null}
          {saveStatus === "success" ? t.webhooksSaved : t.webhooksSave}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={saveStatus === "loading" || testStatus === "loading"}
          onClick={handleTest}
          className="gap-2 sm:min-w-[180px]"
        >
          {testStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : testStatus === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {testStatus === "success" ? t.webhooksTestSent : t.webhooksTest}
        </Button>
      </div>
    </form>
  );
}
