import { describe, expect, it } from "vitest";
import { inspectGoogleClientId } from "@/lib/auth-oauth";

describe("Google client ID production safety", () => {
  it("rejects the known placeholder", () => {
    const inspect = inspectGoogleClientId("your-google-client-id");
    expect(inspect.usable).toBeNull();
    expect(inspect.placeholderDetected).toBe(true);
  });

  it("accepts a real Google OAuth client id format", () => {
    const inspect = inspectGoogleClientId(
      "1234567890-abcdef.apps.googleusercontent.com",
    );
    expect(inspect.usable).toBe(
      "1234567890-abcdef.apps.googleusercontent.com",
    );
    expect(inspect.placeholderDetected).toBe(false);
  });
});
