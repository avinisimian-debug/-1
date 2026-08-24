import { describe, expect, it } from "vitest";
import { __analyzeTestUtils } from "./analyze-transcript.use-case";

describe("truncateLinesForAnalysis", () => {
  it("keeps early lines within budget", () => {
    const lines = Array.from({ length: 200 }, (_, i) => ({
      timestamp: `0${Math.floor(i / 60)}:${String(i % 60).padStart(2, "0")}`,
      speaker: "Speaker 1",
      text: "word ".repeat(40),
    }));
    const truncated = __analyzeTestUtils.truncateLinesForAnalysis(lines, 5_000);
    expect(truncated.length).toBeGreaterThan(5);
    expect(truncated.length).toBeLessThan(lines.length);
  });
});
