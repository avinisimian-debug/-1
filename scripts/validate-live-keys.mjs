import fs from "fs";

function loadEnv(path) {
  const keys = {};
  if (!fs.existsSync(path)) return keys;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    keys[t.slice(0, i).trim()] = v;
  }
  return keys;
}

const env = loadEnv(".env.local");

function presence(name) {
  const v = env[name];
  if (v === undefined) return "ABSENT";
  if (!v) return "EMPTY";
  return `SET len=${v.length}`;
}

async function checkAssemblyAI(key) {
  if (!key) return { ok: false, detail: "missing" };
  const res = await fetch("https://api.assemblyai.com/v2/account", {
    headers: { authorization: key },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, detail: `HTTP ${res.status}` };
  }
  return { ok: true, detail: "account ok" };
}

async function checkOpenAI(key) {
  if (!key) return { ok: false, detail: "missing" };
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` };
  return { ok: true, detail: "models ok" };
}

async function checkRecall(key, region, explicitBase) {
  if (!key) return { ok: false, detail: "missing" };
  const base = explicitBase
    ? explicitBase.replace(/\/$/, "")
    : `https://${region || "eu-central-1"}.recall.ai/api/v1`;
  const res = await fetch(`${base}/bot/?limit=1`, {
    headers: {
      Authorization: `Token ${key}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      detail: `HTTP ${res.status} via ${base} ${text.slice(0, 60)}`,
    };
  }
  return { ok: true, detail: `bots list ok via ${base}` };
}

const region = env.RECALL_AI_REGION || "(unset→eu-central-1)";
const aai = await checkAssemblyAI(env.ASSEMBLYAI_API_KEY);
const oai = await checkOpenAI(env.OPENAI_API_KEY);
const recall = await checkRecall(
  env.RECALL_AI_API_KEY,
  env.RECALL_AI_REGION || "eu-central-1",
  env.RECALL_API_BASE_URL,
);

console.log("--- presence ---");
for (const k of [
  "RECALL_AI_API_KEY",
  "RECALL_AI_REGION",
  "RECALL_WEBHOOK_SECRET",
  "RECALL_API_BASE_URL",
  "CRON_SECRET",
  "ASSEMBLYAI_API_KEY",
  "OPENAI_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
]) {
  console.log(k + ":", presence(k));
}
if (env.RECALL_AI_REGION) {
  console.log("REGION_VALUE:", env.RECALL_AI_REGION);
}
console.log("--- live checks ---");
console.log("ASSEMBLYAI:", aai.ok ? "OK" : "FAIL", aai.detail);
console.log("OPENAI:", oai.ok ? "OK" : "FAIL", oai.detail);
console.log("RECALL:", recall.ok ? "OK" : "FAIL", recall.detail);
console.log(
  "AUTO_JOIN:",
  recall.ok ? "enabled" : "disabled",
);
console.log(
  "CLOSEOUT:",
  aai.ok && oai.ok && env.BLOB_READ_WRITE_TOKEN ? "ready" : "incomplete",
);
