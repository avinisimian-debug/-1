"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Mail,
  Sparkles,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LoginLiveStats } from "@/components/auth/LoginLiveStats";
import { LoginProductPreview } from "@/components/auth/LoginProductPreview";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const PricingTable = dynamic(
  () =>
    import("@/components/billing/PricingTable").then((m) => ({
      default: m.PricingTable,
    })),
  {
    loading: () => (
      <div className="skeleton-shimmer h-96 rounded-2xl border border-border" />
    ),
  },
);

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
    const nameInput = document.getElementById("login-name");
    if (nameInput instanceof HTMLInputElement) {
      window.setTimeout(() => nameInput.focus(), 400);
    }
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

  const features = [
    { icon: Zap, text: t.authFeature1 },
    { icon: Sparkles, text: t.authFeature2 },
    { icon: CheckCircle2, text: t.authFeature3 },
  ];
  const stats = [t.authStat1, t.authStat2, t.authStat3];
  const benefits = [t.authBenefit1, t.authBenefit2, t.authBenefit3];
  const howSteps = [
    {
      icon: Upload,
      title: t.authHowStep1Title,
      desc: t.authHowStep1Desc,
    },
    {
      icon: Sparkles,
      title: t.authHowStep2Title,
      desc: t.authHowStep2Desc,
    },
    {
      icon: CheckCircle2,
      title: t.authHowStep3Title,
      desc: t.authHowStep3Desc,
    },
  ];

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

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:px-8">
        <div className="animate-fade-in-up mb-8 grid gap-4 lg:grid-cols-2">
          <SaleCountdown />
          <div className="glass-card flex items-center rounded-2xl px-5 py-4">
            <LoginLiveStats />
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-12 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
          <div className="w-full max-w-xl text-center lg:max-w-none lg:flex-1 lg:pt-4 lg:text-start">
            <div className="animate-fade-in-up mb-8 flex justify-center lg:hidden">
              <Logo size="lg" />
            </div>

            <div className="animate-fade-in-up animate-fade-in-up-delay-1 badge-accent mb-6">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {t.authTagline}
            </div>

            <h1 className="animate-fade-in-up animate-fade-in-up-delay-2 text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.35rem]">
              {t.authTitle}
            </h1>

            <p className="animate-fade-in-up animate-fade-in-up-delay-3 mt-5 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.authSubtitle}
            </p>

            <div className="animate-fade-in-up animate-fade-in-up-delay-4 mt-8 hidden lg:block">
              <LoginProductPreview />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:mt-10">
              {stats.map((stat, i) => (
                <div
                  key={stat}
                  className={cn(
                    "stat-pill px-3 py-3 text-center sm:px-4 sm:py-4",
                    "animate-fade-in-up",
                    i === 1 && "animate-fade-in-up-delay-1",
                    i === 2 && "animate-fade-in-up-delay-2",
                  )}
                >
                  <p className="text-sm font-semibold text-foreground sm:text-base">
                    {stat}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-2 text-xs font-medium text-foreground shadow-xs backdrop-blur-sm sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                  {text}
                </div>
              ))}
            </div>

            <p className="mt-8 hidden text-sm text-muted-foreground lg:block">
              {t.authSocialProof}
            </p>
          </div>

          <div
            ref={signupRef}
            id="signup-form"
            className="animate-fade-in-up animate-fade-in-up-delay-2 w-full max-w-md shrink-0 scroll-mt-24 lg:sticky lg:top-8 lg:max-w-[26rem]"
          >
            <div className="premium-signup-card p-8 sm:p-9">
              <div className="relative mb-8 hidden lg:block">
                <Logo size="md" showTagline tagline={t.authTagline} />
              </div>

              <div className="relative mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  {t.authCardTitle}
                </h2>
                <span className="inline-flex w-fit shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                  {t.authFreeBadge}
                </span>
              </div>

              <p className="relative mb-5 text-sm leading-relaxed text-muted-foreground">
                {t.authCardSubtitle}
              </p>

              <ul className="relative mb-6 space-y-2.5">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="relative space-y-4">
                <div>
                  <label
                    htmlFor="login-name"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <User className="h-3 w-3" aria-hidden />
                    {t.authName}
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder={t.authName}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
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
                  disabled={loading}
                  className={cn(
                    "btn-cinema flex min-h-[48px] w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  <span className="whitespace-nowrap">
                    {loading ? t.authLoading : t.authSubmit}
                  </span>
                  {!loading && (
                    <ArrowRight
                      className="h-4 w-4 shrink-0 rtl:rotate-180"
                      aria-hidden
                    />
                  )}
                </button>

                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  {t.authUpdates}
                </p>
              </form>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground">
            {t.authHowTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {howSteps.map(({ icon: Icon, title, desc }, index) => (
              <div
                key={title}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" aria-hidden />
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 glass-card rounded-2xl p-6 sm:p-10">
          <PricingTable
            currentPlan="free"
            landing
            onLandingSignup={scrollToSignup}
          />
        </section>

        <div className="mt-16 border-t border-border/80 pt-12">
          <TrustSection variant="landing" />
        </div>
      </div>
    </div>
  );
}
