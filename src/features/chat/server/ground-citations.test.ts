import { describe, expect, it } from "vitest";
import { groundCitationsAgainstTranscript } from "./ground-citations";
import type { TranscriptEntry } from "@/features/transcription/types";

const lines: TranscriptEntry[] = [
  {
    timestamp: "01:00",
    speaker: "נועה",
    text: "אנחנו סוגרים את הפיילוט עד חמישי",
  },
  {
    timestamp: "02:14",
    speaker: "איתי",
    text: "בלי אישור משפטי לא שולחים הצעה",
  },
];

describe("groundCitationsAgainstTranscript", () => {
  it("keeps citations that match timestamp", () => {
    const out = groundCitationsAgainstTranscript(
      [{ timestamp: "02:14", quote: "אישור משפטי", speaker: "איתי" }],
      lines,
    );
    expect(out).toHaveLength(1);
    expect(out[0].timestamp).toBe("02:14");
    expect(out[0].speaker).toBe("איתי");
  });

  it("drops hallucinated quotes and times", () => {
    const out = groundCitationsAgainstTranscript(
      [
        {
          timestamp: "09:99",
          quote: "נטוע לא קיים בכלל בפגישה הזאת מילה נדירה",
          speaker: "רובוט",
        },
      ],
      lines,
    );
    expect(out).toHaveLength(0);
  });

  it("matches by quote substring when time is off", () => {
    const out = groundCitationsAgainstTranscript(
      [{ timestamp: "00:01", quote: "הפיילוט עד חמישי", speaker: "נועה" }],
      lines,
    );
    expect(out).toHaveLength(1);
    expect(out[0].timestamp).toBe("01:00");
  });
});
