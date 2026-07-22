import { existsSync, readFileSync } from "fs";

for (const f of [".env.local", ".env.vercel.production"]) {
  if (!existsSync(f)) {
    console.log(`${f}: missing`);
    continue;
  }
  const text = readFileSync(f, "utf8");
  for (const k of [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_MODE",
  ]) {
    const m = text.match(new RegExp(`^${k}=(.*)$`, "m"));
    const v = m ? m[1].replace(/^["']|["']$/g, "") : "";
    console.log(`${f} ${k}: ${v.length > 5 ? `set (${v.length} chars)` : "empty"}`);
  }
}
