import { describe, expect, it } from "vitest";
import { assertMeetingOwner, type StoredMeeting } from "./meetings-store";
import type { TranscriptionResult } from "@/features/transcription/types";

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
    id: "m1",
    ownerEmail: owner,
    createdAt: new Date().toISOString(),
    title: "t",
    persistStatus: "complete",
    result,
  };
}

describe("meeting ownership", () => {
  it("user A cannot read user B meeting", () => {
    expect(assertMeetingOwner(meeting("a@x.com"), "b@x.com")).toBe(false);
  });

  it("owner can read own meeting", () => {
    expect(assertMeetingOwner(meeting("a@x.com"), "A@x.com")).toBe(true);
  });
});
