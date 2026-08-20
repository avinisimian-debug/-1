"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { SignupCard } from "@/components/auth/SignupCard";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { OutcomeSection } from "@/components/landing/OutcomeSection";
import { PainOutcomeSection } from "@/components/landing/PainOutcomeSection";
import { StazFooter } from "@/components/landing/StazFooter";
import { StazHero } from "@/components/landing/StazHero";
import { StazNav } from "@/components/landing/StazNav";
import { PublicDemoWorkspace } from "@/features/staz-workspace";
import { useLocale } from "@/context/LocaleContext";
import { LANDING } from "@/lib/landing-copy";

const TrustSection = dynamic(
  () =>
    import("@/components/trust/TrustSection").then((m) => ({
      default: m.TrustSection,
    })),
  { loading: () => <div className="h-16" /> },
);

export function LoginScreen() {
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const signupRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const copy = LANDING;

  const scrollToDemo = useCallback(() => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToHow = useCallback(() => {
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToPricing = useCallback(() => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  const requestOtp = async () => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      setError(t.authErrorName);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(t.authErrorEmail);
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: normalizedEmail }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? t.authErrorSignIn);
        return false;
      }
      setOtpSent(true);
      return true;
    } catch {
      setError(t.authErrorSignIn);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpSent) {
      await requestOtp();
      return;
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!otp.trim()) {
      setError("נא להזין את קוד האימות שנשלח לאימייל.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("email-otp", {
        name: trimmedName,
        email: normalizedEmail,
        otp: otp.trim(),
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        window.location.assign("/");
        return;
      }

      setError("קוד שגוי או שפג תוקפו. בקשו קוד חדש.");
    } catch {
      setError(t.authErrorSignIn);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-shell min-h-screen pb-24 text-[var(--staz-text)] lg:pb-0">
      <StazNav
        locale={locale}
        locales={locales}
        localeLabels={localeLabels}
        langLabel={t.langLabel}
        onLocaleChange={(l) => setLocale(l)}
        onDemo={scrollToDemo}
        onHow={scrollToHow}
        onPricing={scrollToPricing}
        onLogin={scrollToSignup}
      />

      <StazHero onDemo={scrollToDemo} onSignup={scrollToSignup} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
        <section aria-labelledby="demo-heading">
          <PublicDemoWorkspace onSignup={scrollToSignup} />
        </section>

        <PainOutcomeSection />
        <OutcomeSection />

        <div className="mt-20 sm:mt-24">
          <TrustSection variant="landing" />
        </div>

        <div className="mt-16 sm:mt-20">
          <LandingPricing
            variant="landing"
            onFreeSignup={scrollToSignup}
            onProSignup={scrollToSignupForPro}
          />
        </div>

        <LandingFaq />

        <section
          className="mx-auto mt-20 max-w-xl sm:mt-24"
          aria-labelledby="signup-heading"
        >
          <div className="mb-8 text-center">
            <h2
              id="signup-heading"
              className="font-brand text-2xl tracking-tight text-[var(--staz-text)] sm:text-3xl"
            >
              {copy.signup.headline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--staz-muted)] sm:text-base">
              {copy.signup.subhead}
            </p>
          </div>
          <SignupCard
            ref={signupRef}
            variant="landing"
            name={name}
            email={email}
            otp={otp}
            otpSent={otpSent}
            error={error}
            loading={loading}
            onNameChange={setName}
            onEmailChange={setEmail}
            onOtpChange={setOtp}
            onSubmit={handleSubmit}
          />
        </section>

        <FinalCta onDemo={scrollToDemo} onSignup={scrollToSignup} />
      </main>

      <StazFooter />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--staz-border)] bg-[color-mix(in_srgb,var(--staz-bg)_92%,transparent)] p-3 backdrop-blur-md lg:hidden">
        <button type="button" onClick={scrollToDemo} className="staz-btn-primary w-full">
          {copy.hero.primaryCta}
        </button>
      </div>
    </div>
  );
}
