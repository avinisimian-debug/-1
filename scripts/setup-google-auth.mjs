#!/usr/bin/env node
/**
 * One-time Google Sign-In setup for Staz AI.
 * Opens Google Cloud Console and saves GOOGLE_CLIENT_ID to .env.local
 */
import { createInterface } from "readline/promises";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { execSync } from "child_process";
import { stdin as input, stdout as output } from "process";

const PRODUCTION_URL = "https://1stazai.com";
const CONSOLE_URL =
  "https://console.cloud.google.com/apis/credentials/oauthclient";

const rl = createInterface({ input, output });

function upsertEnv(content: string, key: string, value: string): string {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }
  return `${content.trimEnd()}\n${line}\n`;
}

async function main() {
  console.log("\n=== Staz AI — Google Sign-In Setup ===\n");
  console.log("This enables the standard 'Continue with Google' button.\n");
  console.log("1. A browser window will open to Google Cloud Console");
  console.log("2. Create an OAuth Client ID → Web application");
  console.log("3. Add these Authorized JavaScript origins:\n");
  console.log(`   • ${PRODUCTION_URL}`);
  console.log("   • http://localhost:3000\n");
  console.log("4. Copy the Client ID and paste it below.\n");

  try {
    execSync(`start "" "${CONSOLE_URL}"`, { stdio: "ignore", shell: "cmd.exe" });
  } catch {
    console.log(`Open manually: ${CONSOLE_URL}\n`);
  }

  const clientId = await rl.question("Paste Google Client ID: ");
  rl.close();

  if (!clientId.trim().endsWith(".apps.googleusercontent.com")) {
    console.error("\nInvalid Client ID format. It should end with .apps.googleusercontent.com");
    process.exit(1);
  }

  const envPath = ".env.local";
  let content = existsSync(envPath) ? await readFile(envPath, "utf8") : "";
  content = upsertEnv(content, "GOOGLE_CLIENT_ID", clientId.trim());
  content = upsertEnv(content, "NEXT_PUBLIC_GOOGLE_CLIENT_ID", clientId.trim());
  if (!content.includes("AUTH_URL=")) {
    content = upsertEnv(content, "AUTH_URL", PRODUCTION_URL);
  }

  await writeFile(envPath, content, "utf8");

  console.log("\n✓ Saved to .env.local");
  console.log("\nNext: add the same GOOGLE_CLIENT_ID to Vercel → Settings → Environment Variables");
  console.log(`      Production value: ${clientId.trim()}`);
  console.log("\nThen redeploy. Google Sign-In will work like any other app.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
