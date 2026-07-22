import { describe, expect, it } from "vitest";
import {
  getOpenAiKeyDiagnostics,
  isOpenAiKeyConfigured,
} from "./transcription-ready";

describe("getOpenAiKeyDiagnostics", () => {
  it("rejects missing keys", () => {
    expect(getOpenAiKeyDiagnostics("").configured).toBe(false);
    expect(getOpenAiKeyDiagnostics(undefined).present).toBe(false);
  });

  it("rejects .env.example placeholders", () => {
    const diag = getOpenAiKeyDiagnostics("sk-your-openai-api-key-here");
    expect(diag.present).toBe(true);
    expect(diag.looksLikePlaceholder).toBe(true);
    expect(diag.configured).toBe(false);
  });

  it("accepts sk-proj style keys and strips quotes", () => {
    const key = `sk-proj-${"a".repeat(40)}`;
    expect(getOpenAiKeyDiagnostics(`"${key}"`).configured).toBe(true);
    expect(getOpenAiKeyDiagnostics(key).prefix.startsWith("sk-")).toBe(true);
  });

  it("rejects short / malformed keys", () => {
    expect(getOpenAiKeyDiagnostics("sk-short").configured).toBe(false);
    expect(getOpenAiKeyDiagnostics("not-a-key").configured).toBe(false);
  });
});

describe("isOpenAiKeyConfigured", () => {
  it("reads process.env", () => {
    const prev = process.env.OPENAI_API_KEY;
    try {
      process.env.OPENAI_API_KEY = `sk-proj-${"b".repeat(40)}`;
      expect(isOpenAiKeyConfigured()).toBe(true);
      process.env.OPENAI_API_KEY = "sk-your-openai-api-key-here";
      expect(isOpenAiKeyConfigured()).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prev;
    }
  });
});
