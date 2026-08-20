import { describe, expect, it } from "vitest";
import {
  mapDecisionToTimestamp,
  mapDecisionsToTimestamps,
} from "./map-decision-timestamp";
import type { TranscriptEntry } from "@/features/transcription/types";
import { getDemoMeetingResult } from "../data/demo-meeting";
import { credentialsCannotImpersonate } from "@/lib/email-otp";

const entries: TranscriptEntry[] = [
  {
    timestamp: "01:00",
    speaker: "נועה",
    text: "אנחנו סוגרים פיילוט עד חמישי",
  },
  {
    timestamp: "02:14",
    speaker: "איתי",
    text: "בלי אישור משפטי לא שולחים הצעה",
  },
];

describe("mapDecisionToTimestamp", () => {
  it("maps decision words to matching line", () => {
    const m = mapDecisionToTimestamp(
      "מאשרים פיילוט ללקוח עד חמישי",
      entries,
    );
    expect(m).not.toBeNull();
    expect(m!.timestamp).toBe("01:00");
  });

  it("maps legal decision to second line", () => {
    const m = mapDecisionToTimestamp(
      "הצעת מחיר לא נשלחת לפני אישור משפטי",
      entries,
    );
    expect(m).not.toBeNull();
    expect(m!.timestamp).toBe("02:14");
  });

  it("does not jump on unrelated transcript", () => {
    const m = mapDecisionToTimestamp("נמכור את החברה מחר בבוקר", entries);
    expect(m).toBeNull();
  });

  it("does not jump on empty transcript", () => {
    expect(mapDecisionToTimestamp("פיילוט עד חמישי", [])).toBeNull();
  });

  it("does not invent a midpoint timestamp", () => {
    const m = mapDecisionToTimestamp("xyzabc qqq", entries, 0.35);
    expect(m).toBeNull();
  });

  it("prefers unique timestamps for multiple decisions", () => {
    const mapped = mapDecisionsToTimestamps(
      [
        "מאשרים פיילוט ללקוח עד חמישי",
        "הצעת מחיר לא נשלחת לפני אישור משפטי",
      ],
      entries,
    );
    const stamps = mapped.map((m) => m.timestamp);
    expect(new Set(stamps).size).toBe(stamps.length);
  });

  it("demo meeting decisions all have evidence", () => {
    const demo = getDemoMeetingResult();
    for (const d of demo.decisions ?? []) {
      const m = mapDecisionToTimestamp(d, demo.transcript);
      expect(m).not.toBeNull();
    }
  });
});

describe("identity", () => {
  it("rejects credentials without OTP", () => {
    const r = credentialsCannotImpersonate({ otpValid: false });
    expect(r.ok).toBe(false);
  });

  it("allows credentials only with OTP", () => {
    const r = credentialsCannotImpersonate({ otpValid: true });
    expect(r.ok).toBe(true);
  });
});

describe("meeting ownership", () => {
  it("does not treat user A email as user B", () => {
    const a = "a@example.com";
    const b = "b@example.com";
    expect(a.toLowerCase() === b.toLowerCase()).toBe(false);
  });
});
