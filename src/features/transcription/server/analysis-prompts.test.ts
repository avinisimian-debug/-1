import { describe, expect, it } from "vitest";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
  detectTranscriptLanguageHint,
} from "./analysis-prompts";

describe("detectTranscriptLanguageHint", () => {
  it("detects Hebrew-dominant text", () => {
    expect(
      detectTranscriptLanguageHint("אנחנו מאשרים את הפיילוט עד יום חמישי"),
    ).toBe("he");
  });

  it("detects English-dominant text", () => {
    expect(
      detectTranscriptLanguageHint("We approved the pilot launch for Thursday"),
    ).toBe("en");
  });
});

describe("buildAnalysisUserPrompt", () => {
  it("includes grounded line anchors with timestamps", () => {
    const prompt = buildAnalysisUserPrompt("fallback", "meeting.mp3", [
      { timestamp: "02:14", speaker: "נועה", text: "אנחנו סוגרים פיילוט" },
    ]);
    expect(prompt).toContain("[L1] 02:14 | נועה | אנחנו סוגרים פיילוט");
    expect(prompt).toContain("HEBREW");
  });
});

describe("buildAnalysisSystemPrompt", () => {
  it("requires Hebrew output and grounded decisions", () => {
    const prompt = buildAnalysisSystemPrompt(false);
    expect(prompt).toContain("Hebrew transcript → Hebrew output");
    expect(prompt).toContain("Never invent facts");
    expect(prompt).toContain("SMART");
  });
});
