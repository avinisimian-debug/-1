"use client";

import { forwardRef, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
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
    },
    ref,
  ) {
    const { t } = useLocale();
    const [google, setGoogle] = useState(false);
    const benefits = [t.authBenefit1, t.authBenefit2, t.authBenefit3];

    useEffect(() => {
      void fetch("/api/auth/config")
        .then((r) => r.json())
        .then((d: { google?: boolean }) => setGoogle(Boolean(d.google)))
        .catch(() => setGoogle(false));
    }, []);

    return (
      <div ref={ref} id="signup-form" className={cn("scroll-mt-24", className)}>
        <div className="premium-signup-card mx-auto max-w-md p-8 sm:max-w-lg sm:p-9">
          <div className="mb-6 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <h2 className="text-center text-xl font-semibold text-foreground sm:text-start">
              {t.authCardTitle}
            </h2>
            <span className="mx-auto inline-flex w-fit shrink-0 whitespace-nowrap rounded-full bg-success/10 px-3 py-1 text-[11px] font-medium text-success ring-1 ring-success/20 sm:mx-0">
              {t.authFreeBadge}
            </span>
          </div>

          <p className="mb-5 text-center text-sm leading-relaxed text-muted-foreground sm:text-start">
            {t.authCardSubtitle}
          </p>

          <ul className="mb-6 space-y-2.5">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  aria-hidden
                />
                {benefit}
              </li>
            ))}
          </ul>

          {google ? (
            <button
              type="button"
              onClick={() => void signIn("google", { callbackUrl: "/" })}
              className="btn-secondary mb-4 flex min-h-[48px] w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium"
            >
              {t.authGoogle}
            </button>
          ) : null}

          {google ? (
            <p className="mb-4 text-center text-xs text-muted-foreground">
              {t.authEmailOr}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
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
                onChange={(e) => onNameChange(e.target.value)}
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
                onChange={(e) => onEmailChange(e.target.value)}
                className="input-field"
                placeholder="you@gmail.com"
                autoComplete="email"
              />
            </div>

            {otpSent ? (
              <div>
                <label
                  htmlFor="login-otp"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  קוד אימות מהאימייל
                </label>
                <input
                  id="login-otp"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => onOtpChange(e.target.value)}
                  className="input-field"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
            ) : null}

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
                {loading
                  ? t.authLoading
                  : otpSent
                    ? "אימות כניסה"
                    : "שלחו קוד והמשיכו לפגישה"}
              </span>
              {!loading && (
                <ArrowRight
                  className="h-4 w-4 shrink-0 rtl:rotate-180"
                  aria-hidden
                />
              )}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              לא נכנסים לחשבון של מישהו אחר לפי אימייל בלבד — נדרש קוד או Google.
            </p>
          </form>
        </div>
      </div>
    );
  },
);
