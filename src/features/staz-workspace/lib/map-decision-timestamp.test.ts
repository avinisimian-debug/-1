import { describe, expect, it } from "vitest";
import { mapDecisionToTimestamp } from "./map-decision-timestamp";
import type { TranscriptEntry } from "@/features/transcription/types";

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
});
