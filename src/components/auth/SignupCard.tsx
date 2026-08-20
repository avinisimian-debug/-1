"use client";

import { forwardRef, useEffect, useState } from "react";
import { ArrowRight, Mail, ShieldCheck, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useLocale } from "@/context/LocaleContext";
import { LANDING } from "@/lib/landing-copy";
import { cn } from "@/lib/utils";

interface SignupCardProps {
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
  variant?: "default" | "landing";
}

export const SignupCard = forwardRef<HTMLDivElement, SignupCardProps>(
  function SignupCard(
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
      variant = "default",
    },
    ref,
  ) {
    const { t } = useLocale();
    const [google, setGoogle] = useState(false);
    const isLanding = variant === "landing";
    const landing = LANDING.signup;

    useEffect(() => {
      void fetch("/api/auth/config")
        .then((r) => r.json())
        .then((d: { google?: boolean }) => setGoogle(Boolean(d.google)))
        .catch(() => setGoogle(false));
    }, []);

    const fieldClass = isLanding
      ? "w-full rounded-xl border border-white/12 bg-black/25 px-3.5 py-3 text-sm text-[#ededea] outline-none placeholder:text-[#6f7670] focus:border-[#7eb8ab]/50"
      : "input-field";

    const labelClass = isLanding
      ? "mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#a8aea8]"
      : "mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground";

    return (
      <div ref={ref} id="signup-form" className={cn("scroll-mt-24", className)}>
        <div
          className={cn(
            "mx-auto max-w-md p-7 sm:max-w-lg sm:p-8",
            isLanding
              ? "rounded-2xl border border-white/10 bg-[#121614]/90 backdrop-blur-sm"
              : "premium-signup-card",
          )}
        >
          {!isLanding ? (
            <>
              <h2 className="text-center text-xl font-semibold text-foreground sm:text-start">
                {t.authCardTitle}
              </h2>
              <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground sm:text-start">
                {t.authCardSubtitle}
              </p>
            </>
          ) : null}

          {google ? (
            <button
              type="button"
              onClick={() => void signIn("google", { callbackUrl: "/" })}
              className={cn(
                "flex min-h-[48px] w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium",
                isLanding
                  ? "mt-0 rounded-xl border border-white/15 bg-white/5 text-[#ededea]"
                  : "btn-secondary mt-6",
              )}
            >
              {t.authGoogle}
            </button>
          ) : null}

          {google ? (
            <p
              className={cn(
                "my-4 text-center text-xs",
                isLanding ? "text-[#6f7670]" : "text-muted-foreground",
              )}
            >
              {t.authEmailOr}
            </p>
          ) : (
            <div className={isLanding ? "mt-0" : "mt-6"} />
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-name" className={labelClass}>
                <User className="h-3 w-3" aria-hidden />
                {t.authName}
              </label>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className={fieldClass}
                placeholder={t.authName}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="login-email" className={labelClass}>
                <Mail className="h-3 w-3" aria-hidden />
                {t.authEmail}
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={fieldClass}
                placeholder={landing.emailPlaceholder}
                autoComplete="email"
              />
            </div>

            {otpSent ? (
              <div>
                <label htmlFor="login-otp" className={labelClass}>
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  קוד אימות מהאימייל
                </label>
                <input
                  id="login-otp"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => onOtpChange(e.target.value)}
                  className={fieldClass}
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
            ) : null}

            {error ? (
              <p
                role="alert"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  isLanding
                    ? "bg-red-950/50 text-red-200 ring-1 ring-red-500/30"
                    : "bg-red-50 text-red-700 ring-1 ring-red-100",
                )}
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex min-h-[48px] w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60",
                isLanding ? "lat-btn-inverse" : "btn-cinema",
              )}
            >
              <span className="whitespace-nowrap">
                {loading
                  ? t.authLoading
                  : otpSent
                    ? landing.submitVerify
                    : landing.submitSend}
              </span>
              {!loading ? (
                <ArrowRight
                  className="h-4 w-4 shrink-0 rtl:rotate-180"
                  aria-hidden
                />
              ) : null}
            </button>

            <p
              className={cn(
                "text-center text-[11px] leading-relaxed",
                isLanding ? "text-[#6f7670]" : "text-muted-foreground",
              )}
            >
              לא נכנסים לחשבון של מישהו אחר לפי אימייל בלבד — נדרש קוד או Google.
              האימייל נשמר לעדכוני מוצר חשובים; אפשר לפנות אלינו להסרה.
            </p>
          </form>
        </div>
      </div>
    );
  },
);
