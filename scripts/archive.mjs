import { mkdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import { BASE, PAGES } from './inventory.mjs';

const OUT = '_archive';
const IMG_ATTRS = ['src', 'data-src', 'data-lazy-src', 'data-original'];
const SET_ATTRS = ['srcset', 'data-srcset'];
const CDN = /(cdn-website\.com|multiscreensite\.com)/;

const seen = new Map(); // absolute asset URL -> { name, buf } (fetched once, reused across pages)
const manifest = [];

// Duda appends resize params. Strip them to request the original.
const originalUrl = (u) => u.split('?')[0];

// From a srcset, take the candidate with the largest width descriptor.
function largestFromSrcset(set) {
  const best = set
    .split(',')
    .map((p) => p.trim().split(/\s+/))
    .map(([url, d]) => ({ url, w: parseInt(d ?? '0', 10) || 0 }))
    .sort((a, b) => b.w - a.w)[0];
  return best?.url;
}

// NOTE: the same asset (logo, shared thumbnail, etc.) is referenced from many
// pages. We only fetch it once over the network (cached in `seen` by the
// cleaned URL), but we still write a copy into *every* page's own
// assets/<slug>/ directory, because the manifest records each page's assets
// as local paths under that page's own slug. Caching only the filename (and
// skipping the write on repeat) would leave later pages' manifest entries
// pointing at files that were never created in their directory.
async function download(url, slug) {
  const clean = originalUrl(url);
  let cached = seen.get(clean);

  if (!cached) {
    const res = await fetch(clean);
    if (!res.ok) {
      console.warn(`  MISS ${res.status} ${clean}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) {
      console.warn(`  EMPTY ${clean}`);
      return null;
    }
    const hash = createHash('sha1').update(clean).digest('hex').slice(0, 8);
    const ext = extname(new URL(clean).pathname) || '.jpg';
    cached = { name: `${hash}${ext}`, buf };
    seen.set(clean, cached);
  }

  await mkdir(join(OUT, 'assets', slug), { recursive: true });
  await writeFile(join(OUT, 'assets', slug, cached.name), cached.buf);
  return cached.name;
}

for (const page of PAGES) {
  const url = BASE + page.old;
  console.log(`FETCH ${page.old}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} on ${url}`);
  const html = await res.text();

  await mkdir(join(OUT, 'html'), { recursive: true });
  await writeFile(join(OUT, 'html', `${page.slug}.html`), html);

  const $ = cheerio.load(html);
  const assets = [];

  for (const el of $('img').toArray()) {
    const $el = $(el);
    let src = IMG_ATTRS.map((a) => $el.attr(a)).find((v) => v && CDN.test(v));
    if (!src) {
      const set = SET_ATTRS.map((a) => $el.attr(a)).find(Boolean);
      if (set) src = largestFromSrcset(set);
    }
    if (!src || !CDN.test(src)) continue;

    const abs = new URL(src, url).href;
    const file = await download(abs, page.slug);
    if (file) assets.push({ file, alt: $el.attr('alt') ?? '', source: abs });
  }

  // Inline style background images
  for (const el of $('[style*="background-image"]').toArray()) {
    const m = /url\(["']?([^"')]+)["']?\)/.exec($(el).attr('style') ?? '');
    if (!m || !CDN.test(m[1])) continue;
    const abs = new URL(m[1], url).href;
    const file = await download(abs, page.slug);
    if (file) assets.push({ file, alt: '', source: abs, role: 'background' });
  }

  const videos = $('iframe[src*="youtube"]')
    .toArray()
    .map((el) => $(el).attr('src'));

  manifest.push({ ...page, title: $('title').text(), assets, videos });
  console.log(`  ${assets.length} assets, ${videos.length} videos`);
}

await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nArchived ${manifest.length} pages, ${seen.size} unique assets.`);
