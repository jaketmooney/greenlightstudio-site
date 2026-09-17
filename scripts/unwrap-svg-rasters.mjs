// Duda exported the five service illustrations as SVG wrappers around a single
// base64-embedded raster. Astro does not process SVGs, so all 1.7MB shipped
// verbatim. This extracts the embedded bitmap so Astro can optimise it like any
// other image.
//
// Run once. Safe to re-run: it skips any icon already unwrapped.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const ICONS = ['strategy', 'copilot', 'fulfillment', 'media', 'coaching'];
const DIR = 'src/assets/home';

for (const name of ICONS) {
  const svgPath = `${DIR}/icon-${name}.svg`;
  if (!existsSync(svgPath)) {
    console.log(`SKIP  icon-${name}.svg (already unwrapped)`);
    continue;
  }

  const svg = await readFile(svgPath, 'utf8');
  const m = svg.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+)/);
  if (!m) {
    console.warn(`KEEP  icon-${name}.svg — no embedded raster, it is a real vector`);
    continue;
  }

  const buf = Buffer.from(m[2].replace(/\s/g, ''), 'base64');
  const out = `${DIR}/icon-${name}.png`;

  // The illustrations are line art on a transparent background, so PNG is kept
  // rather than flattened to JPEG. Astro converts to WebP at build time.
  const meta = await sharp(buf).metadata();
  await sharp(buf)
    .resize({ width: Math.min(meta.width ?? 600, 600), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out);

  const before = Buffer.byteLength(svg);
  const after = (await readFile(out)).byteLength;
  await rm(svgPath);

  console.log(
    `OK    icon-${name}: ${Math.round(before / 1024)}KB svg -> ${Math.round(after / 1024)}KB png ` +
      `(${meta.width}x${meta.height} -> ${Math.min(meta.width ?? 600, 600)}w)`
  );
}
