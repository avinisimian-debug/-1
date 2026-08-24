/**
 * GPT meeting closeout prompts — Hebrew-first, grounded, actionable.
 * Decisions/actions must be supported by the transcript; never invent.
 */

const JSON_SCHEMA_FREE = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 short topic tags"],
  "decisions": ["clear decision as stated or clearly agreed in the meeting"],
  "overview": "2-3 short executive paragraphs",
  "executive": ["5-7 outcome bullets — lead with a strong verb"],
  "keyTakeaways": ["4-6 memorable takeaways"],
  "actionItems": [
    {
      "task": "specific actionable task",
      "owner": "person name from transcript, or לא צוין / Unassigned",
      "deadline": "explicit deadline from transcript, or לא צוין / TBD"
    }
  ],
  "markdownReport": "full meeting brief in Markdown (see format below)"
}`;

const JSON_SCHEMA_PRO = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 short topic tags"],
  "decisions": ["clear decision with short rationale when present"],
  "overview": "2-3 short executive paragraphs",
  "executive": ["5-7 outcome bullets"],
  "keyTakeaways": ["4-6 takeaways"],
  "sentiment": { "overall": "positive|neutral|mixed|negative", "label": "2-3 words", "description": "one sentence" },
  "chapters": [{ "timestamp": "MM:SS from transcript lines", "title": "section title" }],
  "keyQuotes": [{ "quote": "verbatim from transcript", "context": "speaker / topic" }],
  "risks": [{ "risk": "risk or blocker stated or clearly implied", "severity": "high|medium|low" }],
  "followUpEmail": { "subject": "email subject", "body": "ready-to-send follow-up email" },
  "actionItems": [
    {
      "task": "specific actionable task",
      "owner": "person name from transcript, or לא צוין / Unassigned",
      "deadline": "explicit deadline from transcript, or לא צוין / TBD",
      "priority": "high|medium|low"
    }
  ],
  "markdownReport": "full meeting brief in Markdown (see format below)"
}`;

const MARKDOWN_FORMAT = `
## markdownReport format (required)
Write a polished Markdown document in the SAME language as the transcript:

# [Meeting title]

> **TL;DR** — one powerful sentence

## Executive summary
2-3 short paragraphs.

## Key decisions
- Decision — owner / rationale when known

## Action items
| Priority | Task | Owner | Due |
|----------|------|-------|-----|
| high | ... | ... | ... |

## Risks & blockers
- **[Severity]** risk description

## Notable quotes
> "quote" — context

## Next steps
Numbered immediate follow-ups.

Clean Markdown only — no code fences around the report.`;

export function detectTranscriptLanguageHint(text: string): "he" | "en" | "mixed" {
  const hebrew = (text.match(/[\u0590-\u05FF]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  if (hebrew === 0 && latin === 0) return "en";
  if (hebrew > latin * 1.2) return "he";
  if (latin > hebrew * 1.2) return "en";
  return "mixed";
}

export function buildAnalysisSystemPrompt(isPro: boolean): string {
  const schema = isPro ? JSON_SCHEMA_PRO : JSON_SCHEMA_FREE;

  return `You are a principal meeting intelligence analyst specializing in post-meeting executive closeout.
Your job is NOT to rewrite the transcript. Your job is to extract:
1) What was decided
2) Who must do what
3) What happens next
4) A short executive brief leaders can trust

Return a single JSON object matching this schema:
${schema}

${MARKDOWN_FORMAT}

Hard rules:
- Match the transcript language. Hebrew transcript → Hebrew output (headline, overview, executive, decisions, actions, markdownReport).
- Never invent facts, names, budgets, dates, or commitments that are not in the transcript.
- If something is unclear, omit it or mark owner/deadline as לא צוין (Hebrew) / Unassigned or TBD (English) — do not guess.
- Decisions must be real agreements, approvals, or explicit choices — not vague discussion topics.
- Prefer concrete decision verbs: מאשרים / סוגרים / מחליטים / מעבירים / דוחים / Decide / Approve / Ship / Block.
- Action items must be SMART: specific task, clear owner when named, realistic deadline when spoken.
- Separate decisions from action items. A decision is what was agreed; an action item is who executes next.
- executive bullets: max one line each, outcome-first, no fluff, no filler adjectives.
- Prefer 4–7 strong action items over many weak ones. Drop duplicates.
- Do not invent speaker names. Use names/labels that appear in the transcript.
${isPro ? "- chapters timestamps MUST come from transcript line timestamps (MM:SS), never invent times.\n- keyQuotes must be verbatim substrings from the transcript.\n- Include 3–6 risks only when blockers/concerns are actually discussed." : ""}`;
}

export type AnalysisTranscriptLine = {
  timestamp?: string;
  speaker: string;
  text: string;
};

export function buildAnalysisUserPrompt(
  transcriptText: string,
  fileName?: string,
  labeledLines?: AnalysisTranscriptLine[],
): string {
  const langHint = detectTranscriptLanguageHint(
    labeledLines?.map((l) => l.text).join(" ") || transcriptText,
  );

  const formatted =
    labeledLines && labeledLines.length > 0
      ? labeledLines
          .map((line, i) => {
            const ts = line.timestamp?.trim() ? line.timestamp : "??:??";
            return `[L${i + 1}] ${ts} | ${line.speaker} | ${line.text}`;
          })
          .join("\n")
      : transcriptText;

  const languageInstruction =
    langHint === "he"
      ? "Language: HEBREW dominant. Write the entire JSON in Hebrew (except schema keys)."
      : langHint === "mixed"
        ? "Language: mixed Hebrew/English. Prefer Hebrew for executive closeout fields when the meeting is mostly Hebrew."
        : "Language: match the transcript (likely English).";

  return `Analyze this meeting for executive closeout.

File: ${fileName ?? "meeting"}
${languageInstruction}
Use the [L#] MM:SS anchors when reasoning about decisions, quotes, and chapters.
Extract only what the meeting actually closed on.

${labeledLines?.length ? "Speaker labels are present — use them for owners and quotes when reliable." : "Speaker labels may be generic — do not invent real names."}

--- TRANSCRIPT ---
${formatted}
--- END ---`;
}
