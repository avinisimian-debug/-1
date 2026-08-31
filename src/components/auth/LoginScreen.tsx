"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { StazAuthPanel } from "@/components/auth/StazAuthPanel";
import { LoginLiveStats } from "@/components/auth/LoginLiveStats";
import { AhaEvidenceSection } from "@/components/landing/AhaEvidenceSection";
import { AudienceValueSection } from "@/components/landing/AudienceValueSection";
import { CapabilityStories } from "@/components/landing/CapabilityStories";
import { DayInLifeSection } from "@/components/landing/DayInLifeSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { RoiSection } from "@/components/landing/RoiSection";
import { SeoDiscoverSection } from "@/components/seo/SeoDiscoverSection";
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
import { LANDING_CTA } from "@/lib/landing-copy";
import { LaunchAnnouncementBar } from "@/components/launch/LaunchAnnouncementBar";
import {
  LaunchMonthModal,
  useLaunchMonthAutoModal,
} from "@/components/launch/LaunchMonthModal";

export function LoginScreen() {
  const router = useRouter();
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const signupRef = useRef<HTMLDivElement>(null);
  const pastDemoRef = useRef(false);
  const [pastDemo, setPastDemo] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const autoLaunch = useLaunchMonthAutoModal(false);

  const openLaunchOffer = useCallback(() => {
    setLaunchModalOpen(true);
  }, []);

  const goLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

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
    goLogin();
  }, [goLogin]);

  useEffect(() => {
    const demoEl = document.getElementById("demo");
    if (!demoEl) return;

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
          onLogin={goLogin}
          onSignup={scrollToSignup}
        />
      </div>

      <StazHero
        onDemo={scrollToDemo}
        onSignup={scrollToSignup}
        onLaunchOffer={openLaunchOffer}
      />

      <LandingChapter tone="cool" className="!bg-[#05080a] !py-12 sm:!py-16" id="signup">
        <div className="mx-auto max-w-md px-4 sm:px-0">
          <StazAuthPanel ref={signupRef} />
          <div className="mt-8">
            <LoginLiveStats />
          </div>
        </div>
      </LandingChapter>

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

      <TrustSection
        variant="landing"
        onSignup={scrollToSignup}
        onDemo={scrollToDemo}
      />

      <AudienceValueSection />

      <LandingChapter
        tone="quiet"
        className="!bg-zinc-50 !py-14 dark:!bg-zinc-950 sm:!py-20"
        id="pricing-chapter"
      >
        <LandingPricing
          variant="landing"
          onFreeSignup={scrollToSignup}
          onProSignup={scrollToSignupForPro}
        />
      </LandingChapter>

      <SeoDiscoverSection />

      <LandingFaq />

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
