import sharp from "sharp";
import { existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "public", "logo.png");

async function cropMark(size, output) {
  const meta = await sharp(SOURCE).metadata();
  const height = meta.height ?? size;
  const cropWidth = Math.min(height, meta.width ?? height);

  await sharp(SOURCE)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .resize(size, size, { fit: "cover", position: "left" })
    .png()
    .toFile(output);

  console.log(`✓ ${output} (${size}x${size})`);
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error("Missing public/logo.png");
    process.exit(1);
  }

  await cropMark(32, join(ROOT, "src", "app", "icon.png"));
  await cropMark(180, join(ROOT, "src", "app", "apple-icon.png"));
  await cropMark(192, join(ROOT, "public", "icon-192.png"));
  await cropMark(512, join(ROOT, "public", "icon-512.png"));

  await sharp(join(ROOT, "src", "app", "icon.png"))
    .resize(16, 16)
    .toFile(join(ROOT, "public", "favicon-16x16.png"));

  await sharp(join(ROOT, "src", "app", "icon.png"))
    .resize(32, 32)
    .toFile(join(ROOT, "public", "favicon-32x32.png"));

  console.log("✓ public/favicon-16x16.png");
  console.log("✓ public/favicon-32x32.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
