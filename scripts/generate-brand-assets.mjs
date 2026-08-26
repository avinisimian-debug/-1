import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const BRAND = join(ROOT, "public", "brand");
const PUBLIC = join(ROOT, "public");
const APP = join(ROOT, "src", "app");

const MARK_SVG = join(BRAND, "staz-mark.svg");
const SOURCE_PNG = join(BRAND, "staz-mark-source.png");

mkdirSync(BRAND, { recursive: true });
mkdirSync(APP, { recursive: true });

async function rasterFromSvg(size, out) {
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">` +
      (await import("fs")).readFileSync(MARK_SVG, "utf8").replace(
        /<svg[^>]*>|<\/svg>/g,
        "",
      ) +
      `</svg>`,
  );
  await sharp(svg).png().toFile(out);
  console.log(`✓ ${out}`);
}

async function fromSource(size, out) {
  if (!existsSync(SOURCE_PNG)) {
    await rasterFromSvg(size, out);
    return;
  }
  await sharp(SOURCE_PNG)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(out);
  console.log(`✓ ${out} (from source)`);
}

async function makeLockup() {
  const markSize = 256;
  const markBuf = existsSync(SOURCE_PNG)
    ? await sharp(SOURCE_PNG).resize(markSize, markSize).png().toBuffer()
    : await sharp(MARK_SVG).resize(markSize, markSize).png().toBuffer();

  const width = 920;
  const height = 256;
  const wordSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#05080A"/>
      <text x="300" y="162" fill="#F4F7F6" font-family="Arial, Helvetica, sans-serif"
        font-size="108" font-weight="700" letter-spacing="28">STAZ</text>
    </svg>
  `);

  const base = await sharp(wordSvg).png().toBuffer();
  await sharp(base)
    .composite([{ input: markBuf, left: 24, top: 0 }])
    .png()
    .toFile(join(PUBLIC, "logo.png"));
  console.log("✓ public/logo.png");
}

async function main() {
  await fromSource(512, join(PUBLIC, "icon-512.png"));
  await fromSource(192, join(PUBLIC, "icon-192.png"));
  await fromSource(180, join(APP, "apple-icon.png"));
  await fromSource(32, join(APP, "icon.png"));
  await fromSource(32, join(PUBLIC, "favicon-32x32.png"));
  await fromSource(16, join(PUBLIC, "favicon-16x16.png"));
  await makeLockup();

  // Transparent-friendly mark export for UI
  await fromSource(256, join(BRAND, "staz-mark.png"));
  copyFileSync(join(PUBLIC, "icon-192.png"), join(PUBLIC, "brand", "icon-192.png"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
