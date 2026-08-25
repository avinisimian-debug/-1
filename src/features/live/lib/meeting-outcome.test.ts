import { describe, expect, it } from "vitest";
import type { TranscriptionResult } from "@/features/transcription/types";
import { deriveMeetingOutcome } from "./meeting-outcome";

function base(partial: Partial<TranscriptionResult>): TranscriptionResult {
  return {
    fileName: "m.mp3",
    duration: "10:00",
    processedAt: "now",
    summary: { overview: "", executive: [], keyTakeaways: [] },
    actionItems: [],
    transcript: [],
    ...partial,
  };
}

describe("deriveMeetingOutcome", () => {
  it("marks strong closeout when decisions and owned actions exist", () => {
    const o = deriveMeetingOutcome(
      base({
        decisions: ["משיקים ביום חמישי"],
        actionItems: [
          {
            id: "1",
            task: "לשלוח הצעה",
            owner: "דניאל",
            deadline: "מחר",
            completed: false,
          },
        ],
      }),
      true,
    );
    expect(o.kind).toBe("strong");
    expect(o.label).toContain("חזקה");
  });

  it("marks needs follow-up when open questions remain", () => {
    const o = deriveMeetingOutcome(
      base({
        decisions: ["עושים פיילוט"],
        openQuestions: ["מה תהיה העלות?"],
        actionItems: [
          {
            id: "1",
            task: "לבדוק מחיר",
            owner: "אחראי לא צוין",
            deadline: "מועד לא צוין",
            completed: false,
          },
        ],
      }),
      true,
    );
    expect(o.kind).toBe("needs_followup");
    expect(o.reason).toContain("שאלות פתוחות");
  });

  it("marks unclear when nothing actionable was extracted", () => {
    const o = deriveMeetingOutcome(base({}), true);
    expect(o.kind).toBe("unclear");
  });
});
