"use client";

import { forwardRef } from "react";
import { ArrowRight, CheckCircle2, Mail, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

interface SignupCardProps {
  name: string;
  email: string;
  error: string | null;
  loading: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const SignupCard = forwardRef<HTMLDivElement, SignupCardProps>(
  function SignupCard(
    {
      name,
      email,
      error,
      loading,
      onNameChange,
      onEmailChange,
      onSubmit,
      className,
    },
    ref,
  ) {
    const { t } = useLocale();
    const benefits = [t.authBenefit1, t.authBenefit2, t.authBenefit3];

    return (
      <div
        ref={ref}
        id="signup-form"
        className={cn("scroll-mt-24", className)}
      >
        <div className="premium-signup-card mx-auto max-w-md p-8 sm:max-w-lg sm:p-9">
          <div className="mb-6 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <h2 className="text-center text-xl font-semibold text-foreground sm:text-start">
              {t.authCardTitle}
            </h2>
            <span className="mx-auto inline-flex w-fit shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/80 sm:mx-0">
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
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden
                />
                {benefit}
              </li>
            ))}
          </ul>

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
                <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden />
              )}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              {t.authUpdates}
            </p>
          </form>
        </div>
      </div>
    );
  },
);
