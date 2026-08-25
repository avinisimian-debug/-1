/**
 * GPT meeting closeout prompts — Hebrew-first, evidence-based, anti-hallucination.
 * Distinguishes discussion vs decisions, suggestions vs assignments, and final vs superseded choices.
 */

const JSON_SCHEMA_FREE = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 short topic tags"],
  "decisions": ["FINAL decisions only — explicit agreements/approvals/rejections"],
  "overview": "2-3 short executive paragraphs",
  "executive": ["5-7 outcome bullets — lead with a strong verb"],
  "keyTakeaways": ["4-6 memorable takeaways"],
  "openQuestions": ["unanswered questions that still matter commercially or operationally"],
  "followUps": ["explicit future commitments spoken in the meeting (no invented dates)"],
  "actionItems": [
    {
      "task": "specific actionable task",
      "owner": "person name from transcript, or אחראי לא צוין / Unassigned",
      "deadline": "explicit deadline from transcript, or מועד לא צוין / TBD"
    }
  ],
  "markdownReport": "full meeting brief in Markdown (see format below)"
}`;

const JSON_SCHEMA_PRO = `{
  "headline": "one outcome-focused sentence",
  "topics": ["3-5 short topic tags"],
  "decisions": ["FINAL decisions only — with short rationale when present"],
  "overview": "2-3 short executive paragraphs",
  "executive": ["5-7 outcome bullets"],
  "keyTakeaways": ["4-6 takeaways"],
  "openQuestions": ["unanswered questions that still matter"],
  "followUps": ["explicit future commitments (no invented dates)"],
  "sentiment": { "overall": "positive|neutral|mixed|negative", "label": "2-3 words", "description": "one sentence grounded in tone of discussion" },
  "chapters": [{ "timestamp": "MM:SS from transcript lines", "title": "section title" }],
  "keyQuotes": [{ "quote": "verbatim from transcript", "context": "speaker / topic" }],
  "risks": [{ "risk": "risk or blocker stated or clearly implied", "severity": "high|medium|low" }],
  "followUpEmail": { "subject": "email subject", "body": "ready-to-send follow-up email" },
  "actionItems": [
    {
      "task": "specific actionable task",
      "owner": "person name from transcript, or אחראי לא צוין / Unassigned",
      "deadline": "explicit deadline from transcript, or מועד לא צוין / TBD",
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

## תמצית מנהלים / Executive summary
2-3 short paragraphs.

## מה הוחלט / Key decisions
- Final decision only (not earlier superseded ideas)

## מי עושה מה / Action items
| Priority | Task | Owner | Due |
|----------|------|-------|-----|
| high | ... | ... | ... |

## שאלות פתוחות / Open questions
- Unanswered question

## המשכים / Follow-ups
- Spoken future commitment

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

  return `You are a principal meeting intelligence analyst for STAZ.
You produce an executive meeting CLOSEOUT — not a transcript rewrite, not a chatbot reply.

Your job:
1) What was finally decided
2) Who must do what (only when assigned)
3) What remains open
4) What happens next
5) A short executive brief leaders can trust

Return a single JSON object matching this schema:
${schema}

${MARKDOWN_FORMAT}

## Decision intelligence (critical)
- DISCUSSION ≠ DECISION.
  - "We could launch next week" / "אפשר להשיק בשבוע הבא" → NOT a decision.
  - "Let's launch Thursday" / "מאשרים השקה ביום חמישי" → decision.
- SUGGESTION ≠ ASSIGNMENT.
  - "Maybe Daniel can handle it" / "אולי דניאל יטפל" → NOT an action item.
  - "Daniel, you own this by Thursday" / "דניאל, אתה מטפל בזה עד חמישי" → action item.
- CONTRADICTIONS: if a later statement supersedes an earlier one, keep ONLY the final decision.
  - Example: Sunday then "actually Wednesday" → Wednesday only.
- "We'll decide tomorrow" / "נחליט מחר" → open question / follow-up, NOT a decision.
- Rejected ideas: do not list as decisions unless the rejection itself is the agreement ("we will NOT do X").

## Action item rules
- Only explicit commitments or clear assignments.
- Owner: use a name that appears in the transcript. Otherwise אחראי לא צוין / Unassigned — NEVER invent people.
- Deadline: only if spoken. Otherwise מועד לא צוין / TBD — NEVER invent dates.
- Prefer 3–8 strong items. Drop duplicates and soft musings.

## Open questions & follow-ups
- openQuestions: commercially/operationally important questions asked but not answered.
- followUps: spoken future commitments ("I'll send the doc", "נבדוק מחר", "נקבע שיחה").
- Do not invent missing dates or owners inside follow-ups.

## Hard anti-hallucination rules
- Never invent facts, names, budgets, prices, deadlines, competitors, or commitments.
- If unclear → omit or mark אחראי לא צוין / מועד לא צוין / Unassigned / TBD.
- Match transcript language. Hebrew transcript → Hebrew fields (headline, overview, executive, decisions, actions, openQuestions, followUps, markdownReport).
- Prefer concrete verbs: מאשרים / סוגרים / מחליטים / מעבירים / דוחים / Decide / Approve / Ship / Block.
- Separate decisions from action items.
- executive bullets: one line each, outcome-first, no fluff.
- Do not invent speaker names.
${isPro ? "- chapters timestamps MUST come from transcript line timestamps (MM:SS).\n- keyQuotes must be verbatim substrings from the transcript.\n- Include 3–6 risks only when blockers/concerns are actually discussed.\n- sentiment must be grounded in the discussion, not theatrical." : ""}`;
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
Extract only FINAL agreements and explicit assignments. Ignore superseded ideas.

${labeledLines?.length ? "Speaker labels are present — use them for owners and quotes when reliable." : "Speaker labels may be generic — do not invent real names."}

--- TRANSCRIPT ---
${formatted}
--- END ---`;
}
