import sharp from "sharp";
import { existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SOURCE =
  [
    join(ROOT, "public", "brand", "staz-mark-source.png"),
    join(ROOT, "public", "brand", "staz-mark.png"),
    join(ROOT, "public", "logo.png"),
  ].find((p) => existsSync(p)) ?? join(ROOT, "public", "logo.png");

async function writeSquare(size, output) {
  await sharp(SOURCE)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(output);
  console.log(`✓ ${output} (${size}x${size})`);
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error("Missing brand mark source. Run: node scripts/generate-brand-assets.mjs");
    process.exit(1);
  }

  await writeSquare(32, join(ROOT, "src", "app", "icon.png"));
  await writeSquare(180, join(ROOT, "src", "app", "apple-icon.png"));
  await writeSquare(192, join(ROOT, "public", "icon-192.png"));
  await writeSquare(512, join(ROOT, "public", "icon-512.png"));
  await writeSquare(16, join(ROOT, "public", "favicon-16x16.png"));
  await writeSquare(32, join(ROOT, "public", "favicon-32x32.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
