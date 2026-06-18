"use client";

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
import { LoginDemoSection } from "@/components/auth/LoginDemoSection";
import { LoginLiveStats } from "@/components/auth/LoginLiveStats";
import { LoginProductPreview } from "@/components/auth/LoginProductPreview";
import { SaleCountdown } from "@/components/billing/SaleCountdown";
import { PricingTable } from "@/components/billing/PricingTable";
import { TrustSection } from "@/components/trust/TrustSection";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

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
    <div className="relative min-h-screen overflow-hidden bg-zinc-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
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
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <SaleCountdown />
          <div className="flex items-center rounded-2xl border border-zinc-200/80 bg-white/90 px-5 py-4 shadow-sm">
            <LoginLiveStats />
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-12 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
          <div className="w-full max-w-xl text-center lg:max-w-none lg:flex-1 lg:pt-4 lg:text-start">
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

            <div className="mt-8 hidden lg:block">
              <LoginProductPreview />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:mt-10">
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

          <div
            ref={signupRef}
            id="signup-form"
            className="w-full max-w-md shrink-0 scroll-mt-24 lg:max-w-[26rem] lg:sticky lg:top-8"
          >
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-900/8 sm:p-9">
              <div className="mb-8 hidden lg:block">
                <Logo size="md" showTagline tagline={t.authTagline} />
              </div>

              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {t.authCardTitle}
                </h2>
                <span className="inline-flex w-fit shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                  {t.authFreeBadge}
                </span>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                {t.authCardSubtitle}
              </p>

              <ul className="mb-6 space-y-2.5">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-name"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-600"
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

                <p className="text-center text-[11px] leading-relaxed text-zinc-400">
                  {t.authUpdates}
                </p>
              </form>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-semibold text-zinc-900">
            {t.authHowTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {howSteps.map(({ icon: Icon, title, desc }, index) => (
              <div
                key={title}
                className="relative rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                  {index + 1}
                </span>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-indigo-600" aria-hidden />
                  <h3 className="font-semibold text-zinc-900">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <LoginDemoSection className="mt-20" />

        <section className="mt-20 rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <PricingTable
            currentPlan="free"
            landing
            onLandingSignup={scrollToSignup}
          />
        </section>

        <div className="mt-16 border-t border-zinc-200/80 pt-12">
          <TrustSection variant="landing" />
        </div>
      </div>
    </div>
  );
}
