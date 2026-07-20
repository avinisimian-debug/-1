"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, Globe } from "lucide-react";
import { LandingBenefits, LandingTrustStrip } from "@/components/auth/LandingBenefits";
import { LandingHero } from "@/components/auth/LandingHero";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { LoginLiveStats } from "@/components/auth/LoginLiveStats";
import { SignupCard } from "@/components/auth/SignupCard";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { AdSenseUnit } from "@/components/marketing/AdSenseUnit";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";

const TrustSection = dynamic(
  () =>
    import("@/components/trust/TrustSection").then((m) => ({
      default: m.TrustSection,
    })),
  { loading: () => <div className="skeleton-shimmer h-32 rounded-xl" /> },
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
    window.setTimeout(() => {
      const nameInput = document.getElementById("login-name");
      if (nameInput instanceof HTMLInputElement) nameInput.focus();
    }, 400);
  }, []);

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
    <div className="mesh-bg relative min-h-screen overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="absolute end-4 top-4 z-20 sm:end-8 sm:top-8">
        <label className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
          <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
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

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <SaleCountdown />
          <div className="glass-card flex items-center rounded-2xl px-5 py-4 shadow-sm">
            <LoginLiveStats />
          </div>
        </div>

        <LandingHero onGetStarted={scrollToSignup} />

        <div className="my-8">
          <AdSenseUnit format="horizontal" className="min-h-[90px]" />
        </div>

        <LandingTrustStrip className="-mx-4 sm:-mx-6 lg:-mx-8" />

        <LandingBenefits />

        <div className="my-8">
          <AdSenseUnit format="rectangle" className="min-h-[250px]" />
        </div>

        <div className="py-12 sm:py-16">
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

        <LandingPricing onFreeSignup={scrollToSignup} className="-mx-4 rounded-none sm:-mx-6 lg:-mx-8" />

        <div className="my-8">
          <AdSenseUnit format="auto" className="min-h-[100px]" />
        </div>

        <div className="mt-16 border-t border-border/80 pt-12">
          <TrustSection variant="landing" />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-card/95 p-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={scrollToSignup}
          className="btn-cinema flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium"
        >
          {t.authSubmit}
          <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
