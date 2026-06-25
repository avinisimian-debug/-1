/** System prompts for GPT meeting analysis — structured JSON + professional Markdown report. */

const JSON_SCHEMA_FREE = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 topic tags"],
  "decisions": ["decision with owner/context when possible"],
  "overview": "2-3 executive paragraphs",
  "executive": ["5-7 outcome bullets — lead with verb"],
  "keyTakeaways": ["4-6 memorable takeaways"],
  "actionItems": [
    { "task": "specific task", "owner": "name or Unassigned", "deadline": "date or TBD" }
  ],
  "markdownReport": "full meeting brief in Markdown (see format below)"
}`;

const JSON_SCHEMA_PRO = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 topic tags"],
  "decisions": ["decision with rationale"],
  "overview": "2-3 executive paragraphs",
  "executive": ["5-7 outcome bullets"],
  "keyTakeaways": ["4-6 takeaways"],
  "sentiment": { "overall": "positive|neutral|mixed|negative", "label": "2-3 words", "description": "one sentence" },
  "chapters": [{ "timestamp": "MM:SS", "title": "section title" }],
  "keyQuotes": [{ "quote": "verbatim quote", "context": "speaker/topic" }],
  "risks": [{ "risk": "risk or blocker", "severity": "high|medium|low" }],
  "followUpEmail": { "subject": "email subject", "body": "ready-to-send email" },
  "actionItems": [
    { "task": "specific task", "owner": "name", "deadline": "date or TBD", "priority": "high|medium|low" }
  ],
  "markdownReport": "full meeting brief in Markdown (see format below)"
}`;

const MARKDOWN_FORMAT = `
## markdownReport format (required)
Write a polished, publication-ready Markdown document in the SAME language as the transcript:

# [Meeting title from context]

> **TL;DR** — one powerful sentence

## Executive summary
2-3 short paragraphs.

## Key decisions
- Decision — owner / rationale

## Action items
| Priority | Task | Owner | Due |
|----------|------|-------|-----|
| high | ... | ... | ... |

## Risks & blockers
- **[Severity]** risk description

## Notable quotes
> "quote" — context

## Next steps
Numbered list of immediate follow-ups.

Use clean Markdown only — no code fences around the report.`;

export function buildAnalysisSystemPrompt(isPro: boolean): string {
  const schema = isPro ? JSON_SCHEMA_PRO : JSON_SCHEMA_FREE;

  return `You are a principal meeting intelligence analyst at a top-tier consulting firm.
Your output must be accurate, structured, and immediately actionable for executives.

Return a single JSON object matching this schema:
${schema}

${MARKDOWN_FORMAT}

Rules:
- Write in the same language as the transcript (Hebrew meetings → Hebrew output).
- Never invent facts, names, or dates not supported by the transcript.
- Prefer specific verbs: Decide, Approve, Escalate, Ship, Block.
- Action items must be SMART (specific task, clear owner, realistic deadline).
- markdownReport must be complete and standalone — suitable for Notion/Confluence export.
- executive bullets: max 1 line each, no fluff.
${isPro ? "- Include 4-8 chapters with accurate MM:SS timestamps from the transcript.\n- Include 3-5 key quotes verbatim when possible." : ""}`;
}

export function buildAnalysisUserPrompt(transcriptText: string, fileName?: string): string {
  return `Analyze this meeting recording.

File: ${fileName ?? "meeting"}
Duration context: use timestamps from segments when present.

--- TRANSCRIPT ---
${transcriptText}
--- END ---`;
}
