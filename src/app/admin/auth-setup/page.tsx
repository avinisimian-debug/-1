"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Shield,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useSession } from "next-auth/react";

interface SetupData {
  configured: boolean;
  mode: string;
  hasClientId: boolean;
  origins: string[];
  consoleUrl: string;
  googleClientIdPreview?: string | null;
}

export default function AdminAuthSetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth-config");
      if (res.status === 403) {
        router.replace("/");
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as SetupData;
      setSetup(data);
    } catch {
      setError("לא הצלחנו לטעון את ההגדרות.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.replace("/");
      return;
    }
    if (status === "authenticated" && session?.user?.isAdmin) {
      void load();
    }
  }, [load, router, session?.user?.isAdmin, status]);

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/auth-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleClientId: clientId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Save failed");
      }
      setMessage("Google הופעל! חזור למסך ההתחברות ונסה שוב.");
      setClientId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שמירה נכשלה");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardShell title="הגדרת Google" description="טוען...">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="הגדרת התחברות Google"
      description="הפעלה חד-פעמית — לוקח בערך 2 דקות"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {setup?.configured && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Google מוגדר ופעיל</p>
              <p className="mt-1 text-emerald-700/80">
                מצב: {setup.mode}
                {setup.googleClientIdPreview
                  ? ` · ${setup.googleClientIdPreview}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        <section className="glass-card space-y-4 rounded-lg p-6">
          <div className="flex items-center gap-2 text-zinc-900">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">שלב 1 — צור Client ID ב-Google</h2>
          </div>
          <ol className="list-decimal space-y-2 ps-5 text-sm leading-relaxed text-zinc-600">
            <li>לחץ על הכפתור למטה ופתח את Google Cloud Console</li>
            <li>בחר <strong>Application type → Web application</strong></li>
            <li>תחת <strong>Authorized JavaScript origins</strong> הוסף את הכתובות הבאות (העתק כל אחת):</li>
          </ol>

          <div className="space-y-2">
            {setup?.origins.map((origin) => (
              <div
                key={origin}
                className="flex items-center justify-between gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <code className="truncate text-xs text-zinc-700">{origin}</code>
                <button
                  type="button"
                  onClick={() => void copyText(origin, origin)}
                  className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                >
                  <Copy className="h-3 w-3" />
                  {copied === origin ? "הועתק" : "העתק"}
                </button>
              </div>
            ))}
          </div>

          <p className="text-sm text-zinc-600">
            אחרי השמירה ב-Google, העתק את ה-<strong>Client ID</strong> (מספר ארוך
            שמסתיים ב-<code>.apps.googleusercontent.com</code>) והדבק בשלב 2.
          </p>

          <a
            href={setup?.consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cinema inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            פתח Google Cloud Console
          </a>
        </section>

        <section className="glass-card space-y-4 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            שלב 2 — הדבק את ה-Client ID כאן
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="123456789-xxxx.apps.googleusercontent.com"
              className="input-field font-mono text-sm"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-emerald-700">{message}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || !clientId.trim()}
                className="btn-cinema px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                {saving ? "שומר..." : "שמור והפעל Google"}
              </button>
              <Link
                href="/login"
                className="inline-flex items-center rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                לך למסך התחברות
              </Link>
            </div>
          </form>
        </section>

        <p className="text-center text-xs text-zinc-400">
          עד ש-Google מוגדר, אפשר להתחבר עם שם + אימייל בלבד (ללא סיסמה).
        </p>
      </div>
    </DashboardShell>
  );
}
