import { describe, expect, it } from "vitest";
import {
  computeEndsAt,
  computeJoinAt,
  detectPlatform,
  isDueForBotDispatch,
  isValidMeetingUrl,
} from "@/features/live/lib/platform";

describe("platform resolver", () => {
  it("detects Zoom, Meet, Teams, RTMP, WebRTC", () => {
    expect(detectPlatform("https://zoom.us/j/123")).toBe("zoom");
    expect(detectPlatform("https://meet.google.com/abc-defg-hij")).toBe(
      "google_meet",
    );
    expect(detectPlatform("https://teams.microsoft.com/l/meetup-join/x")).toBe(
      "microsoft_teams",
    );
    expect(detectPlatform("rtmps://live.example.com/app/stream")).toBe("rtmp");
    expect(detectPlatform("https://staz.daily.co/room")).toBe("webrtc");
  });

  it("validates meeting URLs and rejects garbage", () => {
    expect(isValidMeetingUrl("https://zoom.us/j/1")).toBe(true);
    expect(isValidMeetingUrl("rtmp://host/app")).toBe(true);
    expect(isValidMeetingUrl("not-a-url")).toBe(false);
    expect(isValidMeetingUrl("")).toBe(false);
  });

  it("computes join/end windows", () => {
    const start = "2026-07-21T15:00:00.000Z";
    expect(computeJoinAt(start, 2).toISOString()).toBe(
      "2026-07-21T14:58:00.000Z",
    );
    expect(computeEndsAt(start, 60).toISOString()).toBe(
      "2026-07-21T16:00:00.000Z",
    );
  });

  it("dispatches only scheduled bots inside the join window", () => {
    const session = {
      startsAt: "2026-07-21T15:00:00.000Z",
      durationMinutes: 60,
      bot: { enabled: true, joinEarlyMinutes: 2 },
      botStatus: "scheduled",
    };

    expect(
      isDueForBotDispatch(session, new Date("2026-07-21T14:50:00.000Z")),
    ).toBe(false);
    expect(
      isDueForBotDispatch(session, new Date("2026-07-21T14:59:00.000Z")),
    ).toBe(true);
    expect(
      isDueForBotDispatch(
        { ...session, botStatus: "recording" },
        new Date("2026-07-21T14:59:00.000Z"),
      ),
    ).toBe(false);
    expect(
      isDueForBotDispatch(
        { ...session, bot: { ...session.bot, enabled: false } },
        new Date("2026-07-21T14:59:00.000Z"),
      ),
    ).toBe(false);
  });
});

describe("edge cases", () => {
  it("handles missing API key provider selection", async () => {
    const prev = process.env.RECALL_AI_API_KEY;
    delete process.env.RECALL_AI_API_KEY;
    const { getBotProvider } = await import("@/features/live/lib/platform");
    expect(getBotProvider()).toBe("manual");
    if (prev !== undefined) process.env.RECALL_AI_API_KEY = prev;
  });
});
