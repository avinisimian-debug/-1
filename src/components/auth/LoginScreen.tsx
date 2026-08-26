"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { SignupCard } from "@/components/auth/SignupCard";
import { AhaEvidenceSection } from "@/components/landing/AhaEvidenceSection";
import { AudienceValueSection } from "@/components/landing/AudienceValueSection";
import { CapabilityStories } from "@/components/landing/CapabilityStories";
import { DayInLifeSection } from "@/components/landing/DayInLifeSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { RoiSection } from "@/components/landing/RoiSection";
import { StazFooter } from "@/components/landing/StazFooter";
import { StazHero } from "@/components/landing/StazHero";
import { StazNav } from "@/components/landing/StazNav";
import { TransformationFlow } from "@/components/landing/TransformationFlow";
import { WalkthroughSection } from "@/components/landing/WalkthroughSection";
import { WhyNotJustChat } from "@/components/landing/WhyNotJustChat";
import { WhyStazSection } from "@/components/landing/WhyStazSection";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { StazButton } from "@/components/landing/ui/StazButton";
import { TrustSection } from "@/components/trust/TrustSection";
import { PublicDemoWorkspace } from "@/features/staz-workspace";
import { useLocale } from "@/context/LocaleContext";
import { LANDING, LANDING_CTA } from "@/lib/landing-copy";
import { LaunchAnnouncementBar } from "@/components/launch/LaunchAnnouncementBar";
import {
  LaunchMonthModal,
  useLaunchMonthAutoModal,
} from "@/components/launch/LaunchMonthModal";

export function LoginScreen() {
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const signupRef = useRef<HTMLDivElement>(null);
  const pastDemoRef = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pastDemo, setPastDemo] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const autoLaunch = useLaunchMonthAutoModal(false);
  const copy = LANDING;

  const openLaunchOffer = useCallback(() => {
    setLaunchModalOpen(true);
  }, []);

  const scrollToDemo = useCallback(() => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToHow = useCallback(() => {
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToOutcomes = useCallback(() => {
    document.getElementById("outcomes")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToAudience = useCallback(() => {
    document.getElementById("audience")?.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    const demoEl = document.getElementById("demo");
    if (!demoEl) return;

    // visualViewport height is read for CTA label only — never drives layout.
    const onScroll = () => {
      const viewportH = window.visualViewport?.height ?? window.innerHeight;
      const rect = demoEl.getBoundingClientRect();
      const next = rect.bottom < viewportH * 0.45;
      if (next === pastDemoRef.current) return;
      pastDemoRef.current = next;
      setPastDemo(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
    };
  }, []);

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

  const showLaunchModal = launchModalOpen || autoLaunch.open;
  const closeLaunchModal = () => {
    setLaunchModalOpen(false);
    autoLaunch.close();
  };

  return (
    <div className="landing-shell min-h-screen overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] text-[var(--staz-ink)] lg:pb-0">
      <div className="sticky top-0 z-50">
        <LaunchAnnouncementBar onOpenOffer={openLaunchOffer} />
        <StazNav
          locale={locale}
          locales={locales}
          localeLabels={localeLabels}
          langLabel={t.langLabel}
          onLocaleChange={(l) => setLocale(l)}
          onDemo={scrollToDemo}
          onHow={scrollToHow}
          onOutcomes={scrollToOutcomes}
          onAudience={scrollToAudience}
          onPricing={scrollToPricing}
          onLogin={scrollToSignup}
          onSignup={scrollToSignup}
        />
      </div>

      <StazHero
        onDemo={scrollToDemo}
        onSignup={scrollToSignup}
        onLaunchOffer={openLaunchOffer}
      />

      <WhyStazSection />
      <TransformationFlow />

      <LandingChapter tone="product">
        <PublicDemoWorkspace onSignup={scrollToSignup} />
      </LandingChapter>

      <AhaEvidenceSection />
      <WalkthroughSection />
      <DayInLifeSection />
      <CapabilityStories />
      <WhyNotJustChat />
      <RoiSection />
      <TrustSection variant="landing" />
      <AudienceValueSection />

      <LandingChapter tone="sand" className="!py-10 sm:!py-14">
        <LandingPricing
          variant="landing"
          onFreeSignup={scrollToSignup}
          onProSignup={scrollToSignupForPro}
        />
      </LandingChapter>

      <LandingFaq />

      <LandingChapter tone="quiet" id="signup">
        <div className="mx-auto max-w-xl" aria-labelledby="signup-heading">
          <div className="mb-8 text-center">
            <h2
              id="signup-heading"
              className="font-brand text-2xl tracking-tight text-[var(--staz-ink)] sm:text-3xl"
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
        </div>
      </LandingChapter>

      <FinalCta
        onDemo={scrollToDemo}
        onSignup={scrollToSignup}
        onLaunchOffer={openLaunchOffer}
      />
      <StazFooter />

      <LaunchMonthModal
        open={showLaunchModal}
        onClose={closeLaunchModal}
        source={launchModalOpen ? "manual" : "auto"}
      />

      {/* Fixed CTA — does not alter document height; safe-area via padding only */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#05080a]/90 px-3 pt-3 backdrop-blur-xl lg:hidden"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <StazButton
          onClick={pastDemo ? scrollToSignup : scrollToDemo}
          className="w-full"
        >
          {pastDemo ? LANDING_CTA.primary : LANDING_CTA.secondary}
        </StazButton>
      </div>
    </div>
  );
}
