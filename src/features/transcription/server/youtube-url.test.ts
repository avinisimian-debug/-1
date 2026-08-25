import { describe, expect, it } from "vitest";
import { parseYouTubeUrl, isYouTubeUrl, extractYouTubeVideoId } from "./youtube-url";

describe("parseYouTubeUrl", () => {
  it("parses watch URLs", () => {
    const p = parseYouTubeUrl("https://www.youtube.com/watch?v=pGxBrJ5KK20");
    expect(p.videoId).toBe("pGxBrJ5KK20");
    expect(p.canonicalUrl).toBe("https://www.youtube.com/watch?v=pGxBrJ5KK20");
  });

  it("parses youtu.be", () => {
    expect(extractYouTubeVideoId("https://youtu.be/pGxBrJ5KK20")).toBe(
      "pGxBrJ5KK20",
    );
  });

  it("parses shorts", () => {
    expect(
      parseYouTubeUrl("https://www.youtube.com/shorts/pGxBrJ5KK20").kind,
    ).toBe("shorts");
  });

  it("rejects non-youtube", () => {
    expect(() => parseYouTubeUrl("https://example.com/watch?v=abc")).toThrow(
      /YT_INVALID_URL/,
    );
    expect(isYouTubeUrl("https://vimeo.com/123")).toBe(false);
  });

  it("rejects invalid ids", () => {
    expect(() =>
      parseYouTubeUrl("https://www.youtube.com/watch?v=short"),
    ).toThrow(/YT_INVALID_URL/);
  });
});
