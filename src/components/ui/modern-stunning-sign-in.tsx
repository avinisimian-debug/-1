"use client";

import { forwardRef, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { StazMark } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { LANDING } from "@/lib/landing-copy";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export interface ModernStunningSignInProps {
  name: string;
  email: string;
  otp: string;
  otpSent: boolean;
  error: string | null;
  loading: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onOtpChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

/**
 * Glass sign-in card wired to Staz OTP + Google auth.
 * Visual language from modern-stunning-sign-in; product behavior from SignupCard.
 */
export const SignIn1 = forwardRef<HTMLDivElement, ModernStunningSignInProps>(
  function SignIn1(
    {
      name,
      email,
      otp,
      otpSent,
      error,
      loading,
      onNameChange,
      onEmailChange,
      onOtpChange,
      onSubmit,
      className,
    },
    ref,
  ) {
    const { t, locale } = useLocale();
    const he = locale === "he";
    const landing = LANDING.signup;
    const [google, setGoogle] = useState(false);

    useEffect(() => {
      void fetch("/api/auth/config")
        .then((r) => r.json())
        .then((d: { google?: boolean }) => setGoogle(Boolean(d.google)))
        .catch(() => setGoogle(false));
    }, []);

    const fieldClass =
      "w-full rounded-xl bg-white/10 px-5 py-3 text-sm text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-teal-400/50";

    return (
      <div
        ref={ref}
        id="signup-form"
        className={cn(
          "relative flex w-full flex-col items-center justify-center",
          className,
        )}
      >
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-[#0a1210]/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg ring-1 ring-white/15">
            <StazMark size={36} title={BRAND_NAME} />
          </div>

          <h2 className="mb-1 text-center font-brand text-2xl font-semibold tracking-tight text-white">
            {BRAND_NAME}
          </h2>
          <p className="mb-6 text-center text-sm text-zinc-400">
            {he ? "כניסה או הרשמה בחינם" : t.authCardSubtitle}
          </p>

          {google ? (
            <button
              type="button"
              onClick={() => void signIn("google", { callbackUrl: "/" })}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#232526] to-[#2d2e30] px-5 py-3 text-sm font-medium text-white shadow transition hover:brightness-110"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt=""
                className="h-5 w-5"
              />
              {t.authGoogle}
            </button>
          ) : null}

          {google ? (
            <p className="mb-4 text-center text-xs text-zinc-500">
              {t.authEmailOr}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
            <input
              placeholder={t.authName}
              type="text"
              value={name}
              autoComplete="name"
              className={fieldClass}
              onChange={(e) => onNameChange(e.target.value)}
            />
            <input
              placeholder={landing.emailPlaceholder}
              type="email"
              value={email}
              autoComplete="email"
              className={fieldClass}
              onChange={(e) => onEmailChange(e.target.value)}
            />

            {otpSent ? (
              <input
                placeholder={he ? "קוד אימות מהאימייל" : "Verification code"}
                inputMode="numeric"
                value={otp}
                autoComplete="one-time-code"
                className={fieldClass}
                onChange={(e) => onOtpChange(e.target.value)}
              />
            ) : null}

            {error ? (
              <div
                role="alert"
                className="rounded-xl bg-red-500/10 px-3 py-2 text-left text-sm text-red-300 ring-1 ring-red-500/25"
              >
                {error}
              </div>
            ) : null}

            <hr className="my-1 border-white/10 opacity-40" />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-b from-teal-300 to-teal-500 px-5 py-3 text-sm font-semibold text-[#04110e] shadow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? t.authLoading
                : otpSent
                  ? landing.submitVerify
                  : landing.submitSend}
            </button>

            <p className="mt-1 text-center text-[11px] leading-relaxed text-zinc-500">
              {he
                ? "לא נכנסים לחשבון של מישהו אחר לפי אימייל בלבד — נדרש קוד או Google."
                : "Email alone is not enough — a code or Google sign-in is required."}
            </p>
          </form>
        </div>

        <div className="relative z-10 mt-10 flex flex-col items-center text-center">
          <p className="mb-3 text-sm text-zinc-400">
            {he ? (
              <>
                הצטרפו ל־
                <span className="font-medium text-white">מנהלים</span> שסוגרים
                פגישות עם {BRAND_NAME}.
              </>
            ) : (
              <>
                Join{" "}
                <span className="font-medium text-white">teams</span> already
                closing meetings with {BRAND_NAME}.
              </>
            )}
          </p>
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[#121212] object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[#121212] object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[#121212] object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="h-8 w-8 rounded-full border-2 border-[#121212] object-cover"
            />
          </div>
        </div>
      </div>
    );
  },
);

export { SignIn1 as ModernStunningSignIn };
