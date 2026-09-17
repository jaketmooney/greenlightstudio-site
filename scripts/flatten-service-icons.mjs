// Duda exported the five service illustrations as ~1.7MB SVGs wrapping a
// base64 raster, with an feColorMatrix filter that converts the bitmap's
// luminance into an alpha channel. Astro does not process SVGs, so all of it
// shipped verbatim.
//
// Extracting the raw embedded bitmap is WRONG: it skips the filter, leaving the
// black backing plate opaque instead of transparent. Instead this renders each
// SVG through a real renderer, which applies the filter, and writes a PNG with
// the alpha channel intact. Astro then converts it to WebP like any other image.
//
// Source SVGs are read from git (they are not kept in the tree).
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE_REV = 'dc88493';
const ICONS = ['strategy', 'copilot', 'fulfillment', 'media', 'coaching'];
const DIR = 'src/assets/home';

for (const name of ICONS) {
  const svgPath = `${DIR}/icon-${name}.svg`;
  const svg = execFileSync('git', ['show', `${SOURCE_REV}:${svgPath}`], {
    maxBuffer: 1024 * 1024 * 32,
  });

  // density 150 so the rasterised filter output stays crisp at 600px wide.
  const png = await sharp(svg, { density: 150 })
    .resize({ width: 600, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const meta = await sharp(png).metadata();
  const stats = await sharp(png).stats();
  if (!meta.hasAlpha || stats.channels[3]?.min !== 0) {
    throw new Error(
      `icon-${name}: no transparency after render — the colour-matrix filter did not apply`
    );
  }

  await writeFile(`${DIR}/icon-${name}.png`, png);
  console.log(
    `OK  icon-${name}: ${Math.round(svg.length / 1024)}KB svg -> ` +
      `${Math.round(png.length / 1024)}KB png, alpha ${stats.channels[3].min}-${stats.channels[3].max}`
  );
}
