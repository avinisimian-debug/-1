"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { TrustSection } from "@/components/trust/TrustSection";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

type GoogleAuthMode = "oauth" | "gis" | "none";

interface AuthConfigResponse {
  google?: boolean;
  mode?: GoogleAuthMode;
  clientId?: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "continue_with";
              locale?: string;
              shape?: "rectangular" | "pill" | "circle" | "square";
            },
          ) => void;
          prompt: (
            momentListener?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "User";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
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
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleMode, setGoogleMode] = useState<GoogleAuthMode>("none");
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const gsiReady = useRef(false);

  const completeGoogleSignIn = useCallback(
    async (credential: string) => {
      setError(null);
      setGoogleLoading(true);

      try {
        const result = await signIn("google-credential", {
          credential,
          redirect: false,
          callbackUrl: "/",
        });

        if (result?.ok) {
          await update();
          return;
        }

        setError(t.authErrorSignIn);
      } catch {
        setError(t.authErrorSignIn);
      } finally {
        setGoogleLoading(false);
      }
    },
    [t.authErrorSignIn, update],
  );

  useEffect(() => {
    let active = true;

    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((data: AuthConfigResponse) => {
        if (!active) return;
        setGoogleMode(data.mode ?? (data.google ? "oauth" : "none"));
        setGoogleClientId(data.clientId ?? null);
      })
      .catch(() => {
        if (active) setGoogleMode("none");
      });

    return () => {
      active = false;
    };
  }, []);

  const mountGoogleSignIn = useCallback(() => {
    const clientId = googleClientId;
    const container = googleButtonRef.current;
    const google = window.google?.accounts?.id;

    if (!clientId || !container || !google || gsiReady.current) return;

    container.innerHTML = "";
    google.initialize({
      client_id: clientId,
      callback: (response) => {
        void completeGoogleSignIn(response.credential);
      },
      auto_select: true,
      cancel_on_tap_outside: true,
      itp_support: true,
    });

    google.renderButton(container, {
      theme: "outline",
      size: "large",
      width: Math.max(container.offsetWidth, 320),
      text: "continue_with",
      locale,
      shape: "rectangular",
    });

    google.prompt();
    gsiReady.current = true;
  }, [completeGoogleSignIn, googleClientId, locale]);

  useEffect(() => {
    if (!googleClientId) return;

    if (window.google?.accounts?.id) {
      mountGoogleSignIn();
      return;
    }

    const scriptId = "google-gsi-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", mountGoogleSignIn);
    return () => {
      script?.removeEventListener("load", mountGoogleSignIn);
      gsiReady.current = false;
    };
  }, [googleClientId, mountGoogleSignIn]);

  const handleGoogleRedirect = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: `${window.location.origin}/` });
    } catch {
      setError(t.authErrorSignIn);
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    if (googleMode === "oauth") {
      await handleGoogleRedirect();
      return;
    }

    if (!googleClientId) {
      setError(t.authGoogleUnavailable);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(t.authErrorEmail);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        name: deriveNameFromEmail(normalizedEmail),
        email: normalizedEmail,
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

  const showOfficialGoogleButton = Boolean(googleClientId);
  const features = [
    { icon: Zap, text: t.authFeature1 },
    { icon: Sparkles, text: t.authFeature2 },
    { icon: CheckCircle2, text: t.authFeature3 },
  ];
  const stats = [t.authStat1, t.authStat2, t.authStat3];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -start-24 top-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -end-16 top-1/3 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-0 start-1/3 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="absolute end-4 top-4 z-20 sm:end-8 sm:top-8">
        <label className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-sm text-zinc-600 shadow-sm backdrop-blur-sm">
          <Globe className="h-4 w-4 text-zinc-400" aria-hidden />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t.langLabel}
            className="cursor-pointer bg-transparent pe-1 focus:outline-none"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeLabels[l]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:px-8">
        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-12 lg:flex-row lg:gap-16 xl:gap-24">
          <div className="w-full max-w-xl text-center lg:max-w-none lg:flex-1 lg:text-start">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo size="lg" />
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {t.authTagline}
            </div>

            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
              {t.authTitle}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-zinc-600 sm:text-xl">
              {t.authSubtitle}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat}
                  className="rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-3 text-center shadow-sm backdrop-blur-sm sm:px-4 sm:py-4"
                >
                  <p className="text-sm font-semibold text-zinc-900 sm:text-base">
                    {stat}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3.5 py-2 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-sm sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-indigo-600" aria-hidden />
                  {text}
                </div>
              ))}
            </div>

            <p className="mt-8 hidden text-sm text-zinc-500 lg:block">
              {t.authSocialProof}
            </p>
          </div>

          <div className="w-full max-w-md shrink-0 lg:max-w-[26rem]">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur-md sm:p-9">
              <div className="mb-8 hidden lg:block">
                <Logo size="md" showTagline tagline={t.authTagline} />
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {t.authCardTitle}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                  {t.authFreeBadge}
                </span>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                {t.authGoogleHint}
              </p>

              <div className="space-y-3">
                {showOfficialGoogleButton ? (
                  <div
                    ref={googleButtonRef}
                    className="flex min-h-[48px] w-full justify-center overflow-hidden rounded-lg [&>div]:!w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={googleLoading || loading}
                    className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <GoogleIcon className="h-5 w-5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {googleLoading ? t.authLoading : t.authGoogle}
                    </span>
                  </button>
                )}

                {googleLoading && showOfficialGoogleButton && (
                  <p className="text-center text-xs text-zinc-500">
                    {t.authLoading}
                  </p>
                )}
              </div>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  {t.authEmailOr}
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-600"
                  >
                    <Mail className="h-3 w-3" aria-hidden />
                    {t.authEmail}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@gmail.com"
                    autoComplete="email"
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className={cn(
                    "btn-cinema flex min-h-[48px] w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  <span className="whitespace-nowrap">
                    {loading ? t.authLoading : t.authEmailSubmit}
                  </span>
                  {!loading && (
                    <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden />
                  )}
                </button>

                <p className="text-center text-[11px] leading-relaxed text-zinc-400">
                  {t.authUpdates}
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-200/80 pt-12">
          <TrustSection variant="landing" />
        </div>
      </div>
    </div>
  );
}
