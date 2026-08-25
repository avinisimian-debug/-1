import { describe, expect, it } from "vitest";
import { resolveTranscriptionErrorMessage } from "./error-messages";
import { translations } from "@/lib/i18n/translations";

const t = translations.he;

describe("resolveTranscriptionErrorMessage youtube", () => {
  it("does not suggest Pro for AssemblyAI youtube-style failures when user is Pro", () => {
    const r = resolveTranscriptionErrorMessage(
      "Transcoding failed. File type <mime> (mp4) may be unsupported. Try a direct MP3/MP4 URL.",
      t,
      true,
    );
    expect(r.kind).toBe("youtube_unavailable");
    expect(r.text).not.toMatch(/Pro/i);
  });

  it("maps YT_PRIVATE", () => {
    const r = resolveTranscriptionErrorMessage(
      "YT_PRIVATE: הסרטון פרטי ולא זמין לעיבוד.",
      t,
      true,
    );
    expect(r.kind).toBe("youtube_private");
  });

  it("maps analysis failure", () => {
    const r = resolveTranscriptionErrorMessage(
      "ANALYSIS_FAILED: התמלול הושלם, אבל עיבוד התובנות נכשל. נסו שוב.",
      t,
      false,
    );
    expect(r.kind).toBe("analysis_failed");
  });
});
