"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useLocale } from "@/context/LocaleContext";
import { OTP_LENGTH } from "@/components/auth/OtpInput";

const EMAIL_KEY = "staz-auth-email";
const RESEND_SECONDS = 60;

export type AuthStep = "email" | "name" | "otp";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function useEmailOtpAuth() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [isReturning, setIsReturning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [google, setGoogle] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void fetch("/api/auth/config")
      .then((r) => r.json())
      .then((d: { google?: boolean }) => setGoogle(Boolean(d.google)))
      .catch(() => setGoogle(false));
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const rememberEmail = useCallback((value: string) => {
    try {
      localStorage.setItem(EMAIL_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  const sendOtp = useCallback(
    async (opts?: { nameOverride?: string }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = (opts?.nameOverride ?? name).trim();

      if (!isValidEmail(normalizedEmail)) {
        setError(t.authErrorEmail);
        return false;
      }
      if (!isReturning && !trimmedName) {
        setError(t.authErrorName);
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedEmail,
            name: trimmedName || undefined,
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? t.authErrorSignIn);
          return false;
        }
        rememberEmail(normalizedEmail);
        setOtp("");
        setStep("otp");
        setResendCooldown(RESEND_SECONDS);
        return true;
      } catch {
        setError(t.authErrorSignIn);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [email, name, isReturning, rememberEmail, t],
  );

  const verifyOtp = useCallback(
    async (code?: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedOtp = (code ?? otp).trim();

      if (!trimmedOtp) {
        setError(t.authOtpRequired);
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await signIn("email-otp", {
          name: name.trim() || undefined,
          email: normalizedEmail,
          otp: trimmedOtp,
          redirect: false,
          callbackUrl: "/",
        });

        if (result?.ok) {
          window.location.assign("/");
          return true;
        }

        setError(t.authOtpInvalid);
        return false;
      } catch {
        setError(t.authErrorSignIn);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [email, name, otp, t],
  );

  const continueWithEmail = useCallback(async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setError(t.authErrorEmail);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/lookup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = (await res.json()) as {
        exists?: boolean;
        name?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? t.authErrorSignIn);
        return;
      }

      const returning = Boolean(data.exists);
      setIsReturning(returning);
      if (returning && data.name) {
        setName(data.name);
        await sendOtp({ nameOverride: data.name });
        return;
      }

      setStep(returning ? "otp" : "name");
      if (returning) {
        await sendOtp();
      }
    } catch {
      setError(t.authErrorSignIn);
    } finally {
      setLoading(false);
    }
  }, [email, sendOtp, t]);

  const goBack = useCallback(() => {
    setError(null);
    setOtp("");
    if (step === "otp") {
      setStep(isReturning ? "email" : "name");
      return;
    }
    if (step === "name") {
      setStep("email");
    }
  }, [step, isReturning]);

  const changeEmail = useCallback(() => {
    setError(null);
    setOtp("");
    setStep("email");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (step === "email") {
        await continueWithEmail();
        return;
      }
      if (step === "name") {
        await sendOtp();
        return;
      }
      if (step === "otp") {
        await verifyOtp();
      }
    },
    [step, continueWithEmail, sendOtp, verifyOtp],
  );

  return {
    email,
    setEmail,
    name,
    setName,
    otp,
    setOtp,
    step,
    isReturning,
    error,
    loading,
    resendCooldown,
    google,
    sendOtp,
    verifyOtp,
    goBack,
    changeEmail,
    handleSubmit,
    canResend: resendCooldown <= 0 && !loading,
    otpComplete: otp.length === OTP_LENGTH,
  };
}
