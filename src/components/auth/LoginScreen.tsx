"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  Clapperboard,
  Film,
  Globe,
  Mail,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const result = await signIn("credentials", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError(t.authErrorEmail);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="cinema-bg relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />

      {/* Language picker */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-8">
        <Globe className="h-4 w-4 text-zinc-500" />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={t.langLabel}
          className="rounded-lg border border-white/[0.08] bg-black/40 px-3 py-1.5 text-sm text-zinc-300 backdrop-blur-xl focus:border-violet-500/40 focus:outline-none"
        >
          {locales.map((l) => (
            <option key={l} value={l} className="bg-zinc-900">
              {localeLabels[l]}
            </option>
          ))}
        </select>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 lg:flex-row lg:gap-16 lg:px-8">
        {/* Left — hero */}
        <div className="mb-12 max-w-xl text-center lg:mb-0 lg:text-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            <Clapperboard className="h-3.5 w-3.5" />
            {t.authTagline}
          </div>

          <h1
            className="text-glow text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {t.authTitle}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            {t.authSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            {[
              { icon: Zap, text: t.authFeature1 },
              { icon: Sparkles, text: t.authFeature2 },
              { icon: Film, text: t.authFeature3 },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-zinc-400"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                {text}
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: t.authStat1, icon: Film },
              { value: t.authStat2, icon: Star },
              { value: t.authStat3, icon: Sparkles },
            ].map(({ value, icon: Icon }) => (
              <div
                key={value}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-center"
              >
                <Icon className="mx-auto mb-2 h-4 w-4 text-amber-400" />
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-zinc-600">{t.authSocialProof}</p>
        </div>

        {/* Right — login card */}
        <div className="w-full max-w-md">
          <div className="gradient-border glass-card rounded-3xl p-8 shadow-2xl shadow-violet-900/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 shadow-lg shadow-violet-600/30">
                <Clapperboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  MeetScribe
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">
                  {t.studioGrade}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-100 hover:shadow-lg"
            >
              <GoogleIcon />
              {t.authGoogle}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-zinc-600">or</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <User className="h-3 w-3" />
                  {t.authName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                  placeholder={t.authName}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Mail className="h-3 w-3" />
                  {t.authEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                  placeholder="you@email.com"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-cinema flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {loading ? t.authLoading : t.authSubmit}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-600">
              {t.authUpdates}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
