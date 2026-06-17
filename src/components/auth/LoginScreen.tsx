"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { ArrowRight, Globe, Mail, Sparkles, User, Zap } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { TrustSection } from "@/components/trust/TrustSection";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginScreen() {
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const { update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let active = true;

    getProviders()
      .then((providers) => {
        if (active) {
          setGoogleEnabled(Boolean(providers?.google));
        }
      })
      .catch(() => {
        if (active) {
          setGoogleEnabled(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t.authErrorName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.authErrorEmail);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        await update();
        return;
      }

      setError(
        result?.error === "CredentialsSignin"
          ? t.authErrorSignIn
          : t.authErrorEmail,
      );
    } catch {
      setError(t.authErrorSignIn);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);

    if (!googleEnabled) {
      setError(t.authGoogleUnavailable);
      return;
    }

    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError(t.authErrorSignIn);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-8">
        <Globe className="h-4 w-4 text-zinc-400" />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={t.langLabel}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 shadow-sm focus:border-indigo-300 focus:outline-none"
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {localeLabels[l]}
            </option>
          ))}
        </select>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center lg:flex-row lg:gap-20">
        <div className="mb-12 max-w-xl text-center lg:mb-0 lg:text-start">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t.authTagline}
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            {t.authTitle}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-zinc-500">
            {t.authSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {[
              { icon: Zap, text: t.authFeature1 },
              { icon: Sparkles, text: t.authFeature2 },
              { icon: User, text: t.authFeature3 },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
                {text}
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-zinc-400 lg:hidden">{t.authSocialProof}</p>
        </div>

        <div className="w-full max-w-md">
          <div className="glass-card rounded-lg p-8 shadow-sm">
            <div className="mb-8 hidden lg:block">
              <Logo size="md" showTagline />
            </div>

            <h2 className="mb-1 text-lg font-semibold text-zinc-900">
              {t.authSubmit}
            </h2>
            <p className="mb-6 text-sm text-zinc-500">{t.authUpdates}</p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon />
              {googleLoading ? t.authLoading : t.authGoogle}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <User className="h-3 w-3" />
                  {t.authName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder={t.authName}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <Mail className="h-3 w-3" />
                  {t.authEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@email.com"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn-cinema flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium disabled:opacity-60"
              >
                {loading ? t.authLoading : t.authSubmit}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
        </div>

        <div className="mt-16 border-t border-zinc-200 pt-12">
          <TrustSection variant="landing" />
        </div>
      </div>
    </div>
  );
}
