// Format conversion only: original compositions are generated with image_gen.
import { createRequire } from "node:module";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const manifest = JSON.parse(await readFile(process.argv[2], "utf8"));
const output = path.resolve("public/images/mag/itineraires");
await mkdir(output, { recursive: true });
await mkdir("artifacts/mag-illustrations", { recursive: true });
const thumbs = [];
for (const [index, item] of manifest.entries()) {
  if (!/^[a-z0-9-]+$/.test(item.slug)) throw new Error("Invalid asset slug");
  const destination = path.join(output, `${item.slug}.webp`);
  await sharp(item.source).resize(1536, 1024, { fit: "cover" }).webp({ quality: 84 }).toFile(destination);
  const meta = await sharp(destination).metadata();
  if (meta.width !== 1536 || meta.height !== 1024) throw new Error(`Unexpected dimensions: ${item.slug}`);
  console.log(`${index + 1}. ${item.slug}: ${Math.round((await stat(destination)).size / 1024)} KB`);
  thumbs.push(await sharp(destination).resize(384, 256).toBuffer());
}
// Contact sheets are inspection artifacts, never published illustrations.
for (let start = 0; start < thumbs.length; start += 6) {
  const group = thumbs.slice(start, start + 6);
  await sharp({ create: { width: 1152, height: 512, channels: 3, background: "#eee9dd" } })
    .composite(group.map((input, i) => ({ input, left: (i % 3) * 384, top: Math.floor(i / 3) * 256 })))
    .png().toFile(`artifacts/mag-illustrations/inspection-${start / 6 + 1}.png`);
}
