"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { LandingPricing } from "@/components/auth/LandingPricing";
import { SignupCard } from "@/components/auth/SignupCard";
import {
  LandingProductTheatre,
  PublicDemoWorkspace,
} from "@/features/staz-workspace";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";

const TrustSection = dynamic(
  () =>
    import("@/components/trust/TrustSection").then((m) => ({
      default: m.TrustSection,
    })),
  { loading: () => <div className="h-24" /> },
);

export function LoginScreen() {
  const { t, locale, setLocale, localeLabels, locales } = useLocale();
  const { update } = useSession();
  const signupRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollToDemo = useCallback(() => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
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
      const result = await signIn("credentials", {
        name: trimmedName,
        email: normalizedEmail,
        otp: otp.trim(),
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        await update();
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
    <div className="lat-stage min-h-screen pb-24 text-[#ededea] lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0c0e0d]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <span className="font-brand text-xl tracking-[0.12em] text-[#ededea] sm:text-2xl">
            STAZ
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t.langLabel}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-[#c5cbc5] sm:text-sm"
            >
              {locales.map((l) => (
                <option key={l} value={l} className="text-black">
                  {localeLabels[l]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={scrollToDemo}
              className="lat-btn-ghost hidden text-sm sm:inline-flex"
            >
              ראו דמו
            </button>
            <button
              type="button"
              onClick={scrollToSignup}
              className="lat-btn-inverse !min-h-9 !px-3 !text-xs sm:!min-h-10 sm:!px-4 sm:!text-sm"
            >
              העלו פגישה
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium tracking-wide text-[#7eb8ab]">
            עוזר מנהלים אחרי פגישה
          </p>
          <h1 className="mt-4 text-balance font-brand text-[1.85rem] leading-[1.2] tracking-tight text-[#ededea] sm:text-5xl">
            יוצאים מהפגישה עם החלטות, לא עם קובץ טקסט.
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-[#b4bab4] sm:text-lg">
            תמצית מנהלים, משימות, ורגע מדויק בתמלול — בעברית.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={scrollToDemo}
              className="lat-btn-inverse w-full sm:w-auto"
            >
              חוו את הדמו
            </button>
            <a
              href="#signup-form"
              className="lat-btn-ghost w-full border border-white/10 sm:w-auto"
            >
              העלו פגישה ראשונה
            </a>
          </div>
        </div>

        <div id="theatre" className="mx-auto mt-14 max-w-4xl lat-fade-rise">
          <LandingProductTheatre />
        </div>

        <section className="mx-auto mt-16 max-w-5xl">
          <PublicDemoWorkspace />
        </section>

        <section className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-[13px] font-medium text-[#7eb8ab]">איך זה עובד</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "מעלים", d: "הקלטה קצרה של הפגישה." },
              { n: "02", t: "מקבלים בהירות", d: "תמצית, החלטות ומשימות." },
              { n: "03", t: "שולחים", d: "סיכום מוכן לצוות תוך דקות." },
            ].map((step) => (
              <div
                key={step.t}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 text-start"
              >
                <p className="font-mono-time text-[11px] text-[#c4a35a]">{step.n}</p>
                <p className="mt-2 font-semibold text-[#ededea]">{step.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#b4bab4]">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lat-landing-sheet mx-auto mt-20 max-w-3xl p-6 sm:p-10">
          <p className="mb-6 text-center text-sm leading-relaxed text-[var(--ink-secondary)]">
            כדי לעבד את הפגישה שלכם (לא רק את הדמו) — צרו חשבון חינמי.
          </p>
          <SignupCard
            ref={signupRef}
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

        <div className="lat-landing-sheet mx-auto mt-10 max-w-4xl">
          <LandingPricing
            onFreeSignup={scrollToSignup}
            onProSignup={scrollToSignupForPro}
          />
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <TrustSection variant="landing" />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0c0e0d]/95 p-3 backdrop-blur-md lg:hidden">
        <button type="button" onClick={scrollToDemo} className="lat-btn-inverse w-full">
          חוו את הדמו
        </button>
      </div>
    </div>
  );
}
