import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "icons");
await mkdir(outDir, { recursive: true });

const bg = "#0a0a14";
const blue = "#5b8bff";

function svg(size, maskable = false) {
  const inner = maskable ? Math.round(size * 0.7) : Math.round(size * 0.82);
  const offset = Math.round((size - inner) / 2);
  const stroke = Math.max(8, Math.round(size * 0.05));
  const bar = (x, y, w, h, color) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(w / 4)}" fill="${color}"/>`;
  // simple bar chart glyph (3 bars: red, blue tall, green)
  const bw = Math.round(inner / 5);
  const gap = Math.round(inner / 12);
  const baseY = offset + inner - Math.round(inner * 0.1);
  const bars = [
    { h: Math.round(inner * 0.35), color: "#ff5b6e" },
    { h: Math.round(inner * 0.85), color: blue },
    { h: Math.round(inner * 0.55), color: "#3ddc97" },
  ];
  let x = offset + Math.round((inner - (bw * 3 + gap * 2)) / 2);
  const barEls = bars
    .map((b) => {
      const y = baseY - b.h;
      const el = bar(x, y, bw, b.h, b.color);
      x += bw + gap;
      return el;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="${bg}"/>${barEls}<rect x="${offset}" y="${offset}" width="${inner}" height="${inner}" fill="none" stroke="${blue}" stroke-width="${stroke}" rx="${Math.round(size * 0.18)}"/></svg>`;
}

async function gen(size, name, maskable = false) {
  const buf = Buffer.from(svg(size, maskable));
  await sharp(buf).png().toFile(join(outDir, name));
  console.log("wrote", name);
}

await gen(192, "icon-192.png");
await gen(512, "icon-512.png");
await gen(512, "icon-maskable.png", true);
await gen(180, "apple-touch-icon.png");
console.log("done");
