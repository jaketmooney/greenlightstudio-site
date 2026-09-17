// Task 3 Step 2: convert archived case-study HTML into content-collection
// markdown entries. Consumes `_archive/manifest.json` + `_archive/html/*.html`
// from Task 1. `client`, `services` and `results` cannot be reliably inferred
// from markup, so they are emitted empty/placeholder here and filled by hand
// in Task 3 Step 4 — this script must not invent them.
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const manifest = JSON.parse(await readFile('_archive/manifest.json', 'utf8'));

// Chrome assets that appear first in every page's asset list (nav logo +
// generic page-header banner), shared across all 23 pages. They are not
// case-study-specific and must never be picked as the hero image.
const isChromeAsset = (a) => /GLS_25_LOGO/.test(a.source) || /page\+header/.test(a.source);

const yamlStr = (s) => JSON.stringify(String(s ?? ''));

for (const page of manifest.filter((p) => p.kind === 'case-study')) {
  const html = await readFile(join('_archive/html', `${page.slug}.html`), 'utf8');
  const $ = cheerio.load(html);

  const title = $('h1').first().text().replace(/\s+/g, ' ').trim() || page.title;
  const dir = join('src/content/case-studies', page.slug);
  await mkdir(dir, { recursive: true });

  // Copy this page's assets alongside the markdown so image() can resolve them.
  const copied = new Set();
  for (const a of page.assets) {
    if (copied.has(a.file)) continue;
    copied.add(a.file);
    await copyFile(join('_archive/assets', page.slug, a.file), join(dir, a.file));
  }

  // Map each asset's original CDN source URL -> its locally copied filename,
  // so inline <img> tags in the body can be rewritten to point at the copy
  // instead of leaking a live irp.cdn-website.com URL into the markdown.
  const srcToFile = new Map(page.assets.map((a) => [a.source, a.file]));

  // Hero: the first case-study-specific, non-background asset — i.e. skip
  // the shared nav-logo/page-header chrome that leads every page's asset list.
  const hero = page.assets.find((a) => a.role !== 'background' && !isChromeAsset(a));
  if (!hero) throw new Error(`no hero image for ${page.slug}`);

  // Body container: Duda nests the whole case-study section under a stable
  // template chain. From the H1, three parents up is a 4-child row:
  // [title group, body content, CTA group, CTA group] — verified identical
  // across all 23 archived pages. Body is always child index 1; the two CTA
  // groups (both start "Unimpressed with your marketing?") are boilerplate
  // and are excluded by construction rather than stripped after the fact.
  const $container = $('h1').first().parent().parent().parent();
  const $body = $container.children().eq(1);
  if (!$body.length) throw new Error(`no body container for ${page.slug}`);

  // Strip Quill editor cursor-placeholder artifacts (a zero-width space in a
  // <span class="ql-cursor">) that Duda leaves embedded in saved rich text.
  $body.find('.ql-cursor').remove();
  // Remove heading elements that are empty spacers (Duda authors sometimes
  // insert an <h3><br></h3> purely for vertical whitespace).
  $body.find('h1, h2, h3, h4, h5, h6').each((_, el) => {
    if (!$(el).text().replace(/\s| /g, '')) $(el).remove();
  });

  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  td.use(gfm);
  // Duda wraps everything in layout divs; drop chrome that is rebuilt as components.
  td.remove(['script', 'style', 'nav', 'header', 'footer']);

  // Duda pull-quotes are <figure class="quote"><blockquote class="quoteText">
  // ...</blockquote><figcaption class="citation">Name, Title</figcaption></figure>.
  // Render as a markdown blockquote with an attribution line underneath.
  td.addRule('pullQuote', {
    filter: (node) => node.nodeName === 'FIGURE' && node.classList?.contains('quote'),
    replacement: (_content, node) => {
      const quoteEl = node.querySelector('blockquote.quoteText, blockquote');
      const citeEl = node.querySelector('figcaption.citation');
      const quote = (quoteEl?.textContent ?? '').replace(/\s+/g, ' ').trim();
      const cite = (citeEl?.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (!quote) return '';
      let md = `> ${quote}`;
      if (cite) md += `\n>\n> — ${cite}`;
      return `\n\n${md}\n\n`;
    },
  });

  // Rewrite inline <img> src from the live CDN URL to the locally copied
  // asset filename (falls back to the original src if no manifest match).
  td.addRule('localImage', {
    filter: 'img',
    replacement: (_content, node) => {
      // Some pages lazy-load body images: the real URL sits in data-src while
      // src is blank/placeholder. Prefer src, fall back to data-src.
      const src = node.getAttribute('src') || node.getAttribute('data-src') || '';
      const alt = node.getAttribute('alt') ?? '';
      const file = srcToFile.get(src);
      if (!src) return '';
      return `![${alt}](${file ? `./${file}` : src})`;
    },
  });

  let body = td.turndown($body.html() ?? '').trim();
  // Duda inserts many empty <p><br></p> spacer paragraphs; turndown renders
  // these as blank lines, which stack up into oversized gaps. Collapse 3+
  // consecutive newlines to a single blank line.
  body = body.replace(/\n{3,}/g, '\n\n');

  // publishDate: pulled from this page's own BlogPosting JSON-LD, archived
  // by Duda at original publish time — not invented.
  let publishDate = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (publishDate) return;
    try {
      const j = JSON.parse($(el).html() ?? '');
      if (j?.datePublished) publishDate = String(j.datePublished).split('T')[0];
    } catch {
      // ignore malformed JSON-LD blocks
    }
  });
  if (!publishDate) throw new Error(`no datePublished found for ${page.slug}`);

  const fm = [
    '---',
    `title: ${yamlStr(title)}`,
    'client: ""            # TASK 3 STEP 4: fill from body copy',
    `summary: ${yamlStr($('meta[name="description"]').attr('content') ?? '')}`,
    `heroImage: "./${hero.file}"`,
    `heroAlt: ${yamlStr(hero.alt)}`,
    'services: []          # TASK 3 STEP 4: fill from body copy',
    'results: []           # TASK 3 STEP 4: fill from body copy',
    `publishDate: ${publishDate}`,
    'featured: false',
    `legacyPath: ${yamlStr(page.old)}`,
    '---',
    '',
    body,
    '',
  ].join('\n');

  await writeFile(join(dir, 'index.md'), fm);
  console.log(`WROTE ${page.slug} (${page.assets.length} assets, hero=${hero.file}, date=${publishDate})`);
}
