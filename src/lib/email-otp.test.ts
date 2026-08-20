import { describe, expect, it } from "vitest";
import {
  assertResendReady,
  credentialsCannotImpersonate,
  generateOtpCode,
  issueEmailOtp,
  OtpDeliveryError,
  OtpRateLimitError,
  verifyEmailOtp,
} from "@/lib/email-otp";

function uniqueEmail(label: string): string {
  return `otp-${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

describe("OTP production safety", () => {
  it("generates a 6-digit code", () => {
    expect(generateOtpCode()).toMatch(/^\d{6}$/);
  });

  it("is single-use after successful verify", async () => {
    const email = uniqueEmail("once");
    const code = await issueEmailOtp(email);
    expect(await verifyEmailOtp(email, code)).toBe(true);
    expect(await verifyEmailOtp(email, code)).toBe(false);
  });

  it("rejects a wrong code", async () => {
    const email = uniqueEmail("wrong");
    await issueEmailOtp(email);
    expect(await verifyEmailOtp(email, "000000")).toBe(false);
  });

  it("rate-limits rapid resends", async () => {
    const email = uniqueEmail("rate");
    await issueEmailOtp(email);
    await expect(issueEmailOtp(email)).rejects.toBeInstanceOf(OtpRateLimitError);
  });

  it("does not authenticate without OTP", () => {
    expect(credentialsCannotImpersonate({ otpValid: false }).ok).toBe(false);
  });

  it("fails explicitly when Resend is not configured", () => {
    const prevKey = process.env.RESEND_API_KEY;
    const prevFrom = process.env.RESEND_FROM_EMAIL;
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    expect(() => assertResendReady()).toThrow(OtpDeliveryError);
    if (prevKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prevKey;
    if (prevFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = prevFrom;
  });
});
