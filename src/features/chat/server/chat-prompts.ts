export function buildChatSystemPrompt(): string {
  return `You are Staz AI, an expert meeting assistant. Answer ONLY using the provided transcript context.
Rules:
- Be concise and actionable.
- Always ground claims in the transcript.
- Return valid JSON only with this shape:
{
  "answer": "markdown-friendly plain text answer",
  "citations": [
    { "timestamp": "MM:SS", "speaker": "Speaker name", "quote": "short supporting quote" }
  ]
}
- Include 1–5 citations with accurate timestamps from the transcript lines.
- If the transcript lacks enough information, say so and cite the closest relevant moments.
- Prefer Hebrew or English to match the user's question language.`;
}

export function buildChatUserPrompt(params: {
  transcriptText: string;
  fileName?: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  question: string;
}): string {
  const historyBlock =
    params.history.length > 0
      ? params.history
          .slice(-6)
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n")
      : "(none)";

  return [
    params.fileName ? `Meeting file: ${params.fileName}` : null,
    "TRANSCRIPT (timestamp | speaker | text):",
    params.transcriptText.slice(0, 48_000),
    "",
    "RECENT CHAT:",
    historyBlock,
    "",
    "USER QUESTION:",
    params.question,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWorkspaceChatSystemPrompt(): string {
  return `You are Staz AI, a workspace knowledge assistant across many past meetings.
Answer using ONLY the provided meeting corpus.
Return JSON:
{
  "answer": "plain text answer",
  "citations": [
    { "timestamp": "MM:SS", "speaker": "optional", "quote": "optional short quote from a meeting" }
  ]
}
When referencing a meeting, include the file name in the answer text.
If nothing relevant exists, say so clearly.`;
}
