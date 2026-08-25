/**
 * Live GPT closeout smoke test for Meeting Bot intelligence.
 * Runs only when OPENAI_API_KEY is set (local .env.local).
 *
 * Usage: npx tsx scripts/verify-meeting-bot-closeout.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { analyzeTranscriptWithOpenAI } from "../src/features/transcription/server/analyze-transcript.use-case";
import { isFailure } from "../src/shared/lib/result";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const MESSY_HEBREW_LINES = [
  {
    timestamp: "10:12",
    speaker: "נועה",
    speakerId: "1",
    text: "אולי נעשה את זה ביום ראשון? זה יכול לעבוד.",
  },
  {
    timestamp: "10:18",
    speaker: "דניאל",
    speakerId: "2",
    text: "רגע, מה תהיה העלות ללקוח?",
  },
  {
    timestamp: "10:20",
    speaker: "נועה",
    speakerId: "1",
    text: "עזבו, נחזור לזה אחר כך. בוא נדבר על הפיילוט.",
  },
  {
    timestamp: "10:28",
    speaker: "מיכל",
    speakerId: "3",
    text: "Maybe Daniel can handle the proposal.",
  },
  {
    timestamp: "10:38",
    speaker: "נועה",
    speakerId: "1",
    text: "בעצם לא, נדחה לרביעי. סגור, עושים השקה ביום רביעי.",
  },
  {
    timestamp: "10:42",
    speaker: "נועה",
    speakerId: "1",
    text: "דניאל, אתה מטפל בהצעה עד חמישי.",
  },
  {
    timestamp: "10:45",
    speaker: "דניאל",
    speakerId: "2",
    text: "סבבה. אני אשלח לך את המסמך מחר.",
  },
  {
    timestamp: "10:50",
    speaker: "מיכל",
    speakerId: "3",
    text: "נחליט על התקציב מחר — עדיין אין מספר.",
  },
];

async function main() {
  loadEnvLocal();
  if (!process.env.OPENAI_API_KEY) {
    console.log("SKIP: OPENAI_API_KEY missing — prompt/unit tests still cover structure.");
    process.exit(0);
  }

  const transcriptText = MESSY_HEBREW_LINES.map((l) => l.text).join("\n");
  const result = await analyzeTranscriptWithOpenAI({
    fileName: "messy-sales.he.txt",
    plan: "pro",
    transcriptText,
    durationSeconds: 650,
    transcript: MESSY_HEBREW_LINES,
    diarizationEnabled: true,
  });

  if (isFailure(result)) {
    console.error("FAIL:", result.error.message);
    process.exit(1);
  }

  const data = result.data;
  const decisionsJoined = (data.decisions ?? []).join(" | ");
  const openJoined = (data.openQuestions ?? []).join(" | ");
  const followJoined = (data.followUps ?? []).join(" | ");
  const actionsJoined = data.actionItems
    .map((a) => `${a.task}/${a.owner}/${a.deadline}`)
    .join(" | ");

  console.log("--- CLOSEOUT ---");
  console.log("headline:", data.headline);
  console.log("decisions:", decisionsJoined);
  console.log("actions:", actionsJoined);
  console.log("openQuestions:", openJoined);
  console.log("followUps:", followJoined);

  const checks: Array<[string, boolean]> = [
    [
      "final decision is Wednesday (not Sunday)",
      /רביעי|Wednesday/i.test(decisionsJoined) &&
        !/ראשון(?!.*רביעי)/i.test(decisionsJoined),
    ],
    [
      "Daniel assigned (not maybe)",
      data.actionItems.some(
        (a) =>
          /דניאל|Daniel/i.test(a.owner) &&
          /הצעה|proposal|מסמך|doc/i.test(a.task),
      ),
    ],
    [
      "cost question remains open",
      /עלות|cost|מחיר|price/i.test(openJoined),
    ],
    [
      "budget deferred is not a decision",
      !(data.decisions ?? []).some((d) => /תקציב|budget/i.test(d) && /מחר|tomorrow/i.test(d)),
    ],
    [
      "follow-up about sending document",
      /מסמך|document|אשלח|send/i.test(followJoined + " " + actionsJoined),
    ],
  ];

  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(ok ? `PASS: ${name}` : `FAIL: ${name}`);
    if (!ok) failed += 1;
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
