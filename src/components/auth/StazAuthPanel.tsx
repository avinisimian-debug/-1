"use client";

import { forwardRef } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { StazMark } from "@/components/brand/Logo";
import { OtpInput } from "@/components/auth/OtpInput";
import { useEmailOtpAuth } from "@/hooks/useEmailOtpAuth";
import { useLocale } from "@/context/LocaleContext";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

type StazAuthPanelProps = {
  className?: string;
  variant?: "landing" | "focused";
};

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-teal-400/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-teal-400/20";

export const StazAuthPanel = forwardRef<HTMLDivElement, StazAuthPanelProps>(
  function StazAuthPanel({ className, variant = "landing" }, ref) {
    const { t, locale } = useLocale();
    const he = locale === "he";
    const auth = useEmailOtpAuth();

    const stepTitle =
      auth.step === "email"
        ? t.authStepEmailTitle
        : auth.step === "name"
          ? t.authStepNameTitle
          : t.authStepOtpTitle;

    const stepSub =
      auth.step === "otp"
        ? t.authStepOtpSub.replace("{email}", auth.email.trim())
        : auth.step === "name"
          ? t.authStepNameSub
          : t.authStepEmailSub;

    const primaryLabel =
      auth.loading
        ? t.authLoading
        : auth.step === "email"
          ? t.authContinue
          : auth.step === "name"
            ? t.authSendCode
            : t.authVerifyCode;

    return (
      <div
        ref={ref}
        id="signup-form"
        className={cn("relative w-full", className)}
      >
        <div
          className={cn(
            "relative z-10 w-full rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8",
            variant === "focused"
              ? "bg-gradient-to-b from-white/[0.08] to-[#0a1210]/95"
              : "bg-gradient-to-b from-white/10 to-[#0a1210]/90",
          )}
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <StazMark size={32} title={BRAND_NAME} />
            </div>
            <h2 className="font-brand text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {stepTitle}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
              {stepSub}
            </p>
          </div>

          {auth.step === "email" && auth.google ? (
            <>
              <button
                type="button"
                onClick={() => void signIn("google", { callbackUrl: "/" })}
                className="mb-4 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04110e] shadow transition hover:bg-zinc-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt=""
                  className="h-5 w-5"
                />
                {t.authGoogle}
              </button>
              <p className="mb-4 text-center text-xs text-zinc-500">
                {t.authEmailOr}
              </p>
            </>
          ) : null}

          <form onSubmit={auth.handleSubmit} className="space-y-4">
            {auth.step === "email" ? (
              <div>
                <label htmlFor="staz-auth-email" className="sr-only">
                  {t.authEmail}
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                    aria-hidden
                  />
                  <input
                    id="staz-auth-email"
                    type="email"
                    value={auth.email}
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t.authEmailPlaceholder}
                    className={cn(fieldClass, "ps-10")}
                    onChange={(e) => auth.setEmail(e.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {auth.step === "name" ? (
              <div>
                <label htmlFor="staz-auth-name" className="mb-1.5 block text-xs font-medium text-white/50">
                  {t.authName}
                </label>
                <input
                  id="staz-auth-name"
                  type="text"
                  value={auth.name}
                  autoComplete="name"
                  placeholder={t.authName}
                  className={fieldClass}
                  onChange={(e) => auth.setName(e.target.value)}
                />
                <p className="mt-2 text-xs text-zinc-500">{t.authNameHint}</p>
              </div>
            ) : null}

            {auth.step === "otp" ? (
              <div className="space-y-4">
                {auth.isReturning ? (
                  <p className="text-center text-sm text-[#5eead4]">
                    {t.authReturningWelcome.replace(
                      "{name}",
                      auth.name.split(" ")[0] || auth.name,
                    )}
                  </p>
                ) : null}
                <OtpInput
                  value={auth.otp}
                  disabled={auth.loading}
                  onChange={auth.setOtp}
                  onComplete={(code) => void auth.verifyOtp(code)}
                />
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
                  <button
                    type="button"
                    onClick={auth.changeEmail}
                    className="text-zinc-400 underline-offset-2 hover:text-white hover:underline"
                  >
                    {t.authChangeEmail}
                  </button>
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                  <button
                    type="button"
                    disabled={!auth.canResend}
                    onClick={() => void auth.sendOtp()}
                    className="text-zinc-400 underline-offset-2 hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {auth.resendCooldown > 0
                      ? t.authResendIn.replace(
                          "{seconds}",
                          String(auth.resendCooldown),
                        )
                      : t.authResend}
                  </button>
                </div>
              </div>
            ) : null}

            {auth.error ? (
              <div
                role="alert"
                className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/25"
              >
                {auth.error}
              </div>
            ) : null}

            <div className="flex gap-2">
              {auth.step !== "email" ? (
                <button
                  type="button"
                  onClick={auth.goBack}
                  disabled={auth.loading}
                  className="inline-flex min-h-[48px] items-center justify-center gap-1 rounded-full border border-white/12 px-4 text-sm font-medium text-white/80 transition hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  {t.authBack}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={auth.loading || (auth.step === "otp" && auth.otp.length < 6)}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-teal-300 to-teal-500 px-5 py-3 text-sm font-semibold text-[#04110e] shadow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{primaryLabel}</span>
                {auth.step !== "otp" ? (
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                ) : null}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-500">
            {he
              ? "לא נכנסים לחשבון של מישהו אחר לפי אימייל בלבד — נדרש קוד או Google."
              : "Email alone is not enough — a code or Google sign-in is required."}
          </p>
        </div>
      </div>
    );
  },
);
