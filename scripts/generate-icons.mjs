import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";

const publicDir = path.resolve(import.meta.dirname, "..", "public");
const svg = readFileSync(path.join(publicDir, "icon.svg"));

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

for (const { size, name } of sizes) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`generated ${name}`);
}
