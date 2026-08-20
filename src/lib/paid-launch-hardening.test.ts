import { afterEach, describe, expect, it } from "vitest";
import {
  assertCloudPersistence,
  CloudStorageUnavailableError,
} from "@/lib/runtime-env";
import {
  isExpectedProMonthlyAmount,
  isExpectedProMonthlyOffer,
  regularBillingCycleFromPlan,
  getPayPalBaseUrl,
  getPayPalMode,
} from "@/lib/paypal-plan-inspect";
import { PLAN_LIMITS } from "@/lib/constants";
import { assertMeetingOwner } from "@/features/library/server/meetings-store";
import type { StoredMeeting } from "@/features/library/server/meetings-store";
import type { TranscriptionResult } from "@/features/transcription/types";

describe("production cloud persistence", () => {
  const prevVercel = process.env.VERCEL;
  const prevEnv = process.env.VERCEL_ENV;
  const prevToken = process.env.BLOB_READ_WRITE_TOKEN;

  afterEach(() => {
    if (prevVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = prevVercel;
    if (prevEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prevEnv;
    if (prevToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = prevToken;
  });

  it("allows local disk when not hosted", () => {
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(() => assertCloudPersistence()).not.toThrow();
  });

  it("fails explicitly on Vercel production without Blob", () => {
    process.env.VERCEL = "1";
    process.env.VERCEL_ENV = "production";
    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(() => assertCloudPersistence()).toThrow(
      CloudStorageUnavailableError,
    );
  });
});

describe("PayPal regular cycle amount", () => {
  const monthly2490 = {
    billing_cycles: [
      {
        tenure_type: "REGULAR",
        frequency: { interval_unit: "MONTH", interval_count: 1 },
        pricing_scheme: {
          fixed_price: { value: "24.90", currency_code: "USD" },
        },
      },
    ],
  };

  it("matches UI only for $24.90 USD / month REGULAR", () => {
    const cycle = regularBillingCycleFromPlan(monthly2490);
    expect(cycle.amount).toBe("24.90");
    expect(cycle.currency).toBe("USD");
    expect(isExpectedProMonthlyOffer(cycle)).toBe(true);
    expect(isExpectedProMonthlyAmount(cycle.amount)).toBe(true);
  });

  it("fails if amount differs", () => {
    const cycle = regularBillingCycleFromPlan({
      billing_cycles: [
        {
          tenure_type: "REGULAR",
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          pricing_scheme: {
            fixed_price: { value: "19.00", currency_code: "USD" },
          },
        },
      ],
    });
    expect(isExpectedProMonthlyOffer(cycle)).toBe(false);
  });

  it("fails if currency is not USD", () => {
    const cycle = regularBillingCycleFromPlan({
      billing_cycles: [
        {
          tenure_type: "REGULAR",
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          pricing_scheme: {
            fixed_price: { value: "24.90", currency_code: "EUR" },
          },
        },
      ],
    });
    expect(isExpectedProMonthlyOffer(cycle)).toBe(false);
  });

  it("uses Live PayPal API host when mode=live", () => {
    const prev = process.env.PAYPAL_MODE;
    process.env.PAYPAL_MODE = "live";
    expect(getPayPalMode()).toBe("live");
    expect(getPayPalBaseUrl()).toBe("https://api-m.paypal.com");
    if (prev === undefined) delete process.env.PAYPAL_MODE;
    else process.env.PAYPAL_MODE = prev;
  });
});

describe("server quota limits", () => {
  it("enforces monthly caps from PLAN_LIMITS not client storage", () => {
    expect(PLAN_LIMITS.free.transcriptionsPerMonth).toBe(10);
    expect(PLAN_LIMITS.pro.transcriptionsPerMonth).toBe(100);
  });
});

describe("IDOR meeting owner check", () => {
  const result = {
    fileName: "x",
    duration: "01:00",
    processedAt: "",
    summary: { executive: [], keyTakeaways: [], overview: "" },
    actionItems: [],
    transcript: [],
  } as TranscriptionResult;

  function meeting(owner: string): StoredMeeting {
    return {
      id: "guessable-id",
      ownerEmail: owner,
      createdAt: new Date().toISOString(),
      title: "t",
      persistStatus: "complete",
      result,
    };
  }

  it("rejects guessed IDs owned by another email", () => {
    expect(assertMeetingOwner(meeting("owner@x.com"), "attacker@x.com")).toBe(
      false,
    );
  });
});
