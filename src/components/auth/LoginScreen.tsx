"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { SignupCard } from "@/components/auth/SignupCard";
import { LandingProductTheatre } from "@/features/staz-workspace";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";

const TrustSection = dynamic(
  () =>
    import("@/components/trust/TrustSection").then((m) => ({
      default: m.TrustSection,
    })),
  { loading: () => <div className="h-24" /> },
);

export function LoginScreen() {
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const { update } = useSession();
  const signupRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollToSignup = useCallback(() => {
    signupRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToSignupForPro = useCallback(() => {
    try {
      sessionStorage.setItem("staz-upgrade-intent", "1");
    } catch {
      /* ignore */
    }
    scrollToSignup();
  }, [scrollToSignup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError(t.authErrorName);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(t.authErrorEmail);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        name: trimmedName,
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

  return (
    <div className="lat-stage min-h-screen text-[#ededea]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-brand text-2xl tracking-tight">STAZ</span>
        <div className="flex items-center gap-3">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t.langLabel}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-[#a8aea8]"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {localeLabels[l]}
              </option>
            ))}
          </select>
          <button type="button" onClick={scrollToSignup} className="lat-btn-ghost text-sm">
            {t.authSubmit}
          </button>
          <button type="button" onClick={scrollToSignup} className="lat-btn-inverse !min-h-10 !text-sm">
            נסו עכשיו
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-brand text-5xl tracking-tight text-[#ededea] sm:text-6xl">
            STAZ
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#a8aea8] sm:text-xl">
            יוצאים מהפגישה עם החלטות ומשימות — לא עם קובץ טקסט.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={scrollToSignup} className="lat-btn-inverse w-full sm:w-auto">
              נסו עכשיו
            </button>
            <a href="#theatre" className="lat-btn-ghost w-full sm:w-auto text-[#a8aea8]">
              ראו איך זה עובד
            </a>
          </div>
        </div>

        <div id="theatre" className="mx-auto mt-12 max-w-4xl lat-fade-rise">
          <LandingProductTheatre />
        </div>

        <section className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-sm font-semibold text-[#3d9b86]">איך זה עובד</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { t: "מקשיבים", d: "הקלטה או פגישה — Staz קולט." },
              { t: "מבינים", d: "תמצית, החלטות ומשימות." },
              { t: "שולחים", d: "סיכום מוכן לצוות תוך דקות." },
            ].map((step) => (
              <div key={step.t} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
                <p className="font-semibold text-[#ededea]">{step.t}</p>
                <p className="mt-2 text-sm text-[#a8aea8]">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-2xl bg-[var(--bg-canvas)] p-1 text-[var(--ink-primary)]">
          <div className="rounded-xl bg-[var(--bg-elevated)] p-6 sm:p-8">
            <SignupCard
              ref={signupRef}
              name={name}
              email={email}
              error={error}
              loading={loading}
              onNameChange={setName}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="mt-12 text-[var(--ink-primary)]">
          <LandingPricing
            onFreeSignup={scrollToSignup}
            onProSignup={scrollToSignupForPro}
          />
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <TrustSection variant="landing" />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0c0e0d]/95 p-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={scrollToSignup}
          className="lat-btn-inverse w-full"
        >
          {t.authSubmit}
        </button>
      </div>
    </div>
  );
}
