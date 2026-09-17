// Task 1 backfill: archive.mjs only scanned <img> attributes, srcset, and
// inline style="background-image" for CDN assets. That missed URLs sitting
// anywhere else in the markup -- <style> blocks, data-dm-image-path /
// data-image-url / data-background-image attributes, <link>/<meta> tags,
// and inline JSON (JSON-LD, widget config blobs). This script re-scans the
// raw HTML with a permissive, attribute-agnostic regex, downloads whatever
// archive.mjs missed, and appends matching entries to manifest.json so the
// new files are recorded the same way the original 206 are.
//
// Safe to re-run: anything already recorded in manifest.json (by clean,
// query-stripped source URL, per page) is skipped, and cheerio-derived
// alt/role inference is preserved for anything added.

import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';

const HTML_DIR = join('_archive', 'html');
const ASSETS_DIR = join('_archive', 'assets');
const MANIFEST_PATH = join('_archive', 'manifest.json');

const CDN_RE = /(cdn-website\.com|multiscreensite\.com)/i;
const IMG_EXT_RE = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
// Any run of non-whitespace, non-quote, non-angle-bracket, non-paren
// characters starting with http(s):// -- this deliberately stops at the
// delimiters that close an HTML attribute, a CSS url(...), or a JSON string,
// so it never swallows trailing markup into the "URL".
const URL_TOKEN_RE = /https?:\/\/[^\s"'<>()]+/g;

const REQUEST_DELAY_MS = 150;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Duda appends resize params via query string on some URLs; strip them to
// get a stable, fetchable, hashable identity -- same convention archive.mjs
// uses (it hashes the query-stripped URL).
const cleanUrl = (u) => u.split('?')[0];

// Pull every http(s) URL token out of a blob of text, decoding the HTML
// entity for '&' first since Duda joins query params with "&amp;" in raw
// markup.
function extractUrls(text) {
  const decoded = text.replace(/&amp;/g, '&');
  return decoded.match(URL_TOKEN_RE) ?? [];
}

// Every CDN image URL (already query-stripped) referenced anywhere in the
// raw HTML text, permissively -- attributes, <style> blocks, inline <script>
// JSON, JSON-LD, meta/link tags, wherever.
function findCdnImageUrls(html) {
  const found = new Set();
  for (const raw of extractUrls(html)) {
    if (!CDN_RE.test(raw)) continue;
    const clean = cleanUrl(raw);
    if (!IMG_EXT_RE.test(clean)) continue;
    found.add(clean);
  }
  return found;
}

// Given a page's cheerio DOM and a target (clean) URL, figure out how it's
// referenced so we can fill in `alt` / `role` faithfully:
//  - found as an attribute on an <img> itself -> use that img's own alt,
//    no `role` (matches how archive.mjs records plain <img> assets).
//  - found as an attribute on some other element (div/a/link/meta/etc.) ->
//    role: 'background', alt borrowed from a genuinely nearby <img> if one
//    exists (checked via descendants, then a few ancestor levels), else "".
//  - found only inside a <style> or <script> block's text (CSS url(), JSON
//    blobs, JSON-LD) -> role: 'background', alt: "" (no DOM element to
//    associate it with, so no alt to genuinely borrow).
function describeReference($, targetUrl) {
  let result = null;

  $('*').each((_, el) => {
    const tagName = el.tagName?.toLowerCase();
    if (tagName === 'style' || tagName === 'script') return; // handled below

    const attribs = el.attribs || {};
    for (const value of Object.values(attribs)) {
      if (!value || (!value.includes('cdn-website') && !value.includes('multiscreensite'))) continue;
      const tokens = extractUrls(value);
      if (!tokens.some((t) => cleanUrl(t) === targetUrl)) continue;

      if (tagName === 'img') {
        result = { alt: $(el).attr('alt') ?? '', role: undefined };
      } else {
        result = { alt: findNearbyAlt($, el), role: 'background' };
      }
      return false; // stop iterating, we have our answer
    }
  });

  if (result) return result;

  // Not found as an element attribute -- check <style>/<script> text content
  // (CSS url(...) rules, JSON-LD, inline widget-config JSON).
  let inTextBlock = false;
  $('style, script').each((_, el) => {
    if (inTextBlock) return;
    const text = $(el).html() ?? '';
    if (!text.includes('cdn-website') && !text.includes('multiscreensite')) return;
    const tokens = extractUrls(text);
    if (tokens.some((t) => cleanUrl(t) === targetUrl)) inTextBlock = true;
  });

  if (inTextBlock) return { alt: '', role: 'background' };

  // Shouldn't happen (the URL came from this same HTML), but fall back
  // safely rather than inventing anything.
  return { alt: '', role: 'background' };
}

// Look for a genuinely associated <img> nested inside a non-img element that
// referenced the CDN URL (e.g. an <a data-image-url="..."> tightly wrapping
// a single <img> as its direct child). Deliberately does NOT walk up
// ancestors, and deliberately does NOT do a deep descendant search either:
// these CDN references frequently sit on large section/grid/group <div>s
// (parallax backgrounds, layout wrappers) whose subtree -- many levels
// down -- can contain a single, entirely unrelated <img> (e.g. a decorative
// separator graphic used once elsewhere in that same layout section). A deep
// find('img') would "find" that one and wrongly borrow its alt text. Only a
// true direct child is treated as genuinely associated; otherwise "" --
// never invents or misattributes alt text.
function findNearbyAlt($, el) {
  const imgs = $(el).children('img');
  if (imgs.length === 1) return ($(imgs[0]).attr('alt') ?? '').trim();
  return '';
}

async function loadManifest() {
  const raw = await readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(raw);
}

async function saveManifest(manifest) {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

async function fetchWithRetry(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (attempt === 1) {
          await sleep(REQUEST_DELAY_MS);
          continue;
        }
        return { ok: false, status: res.status };
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) {
        if (attempt === 1) {
          await sleep(REQUEST_DELAY_MS);
          continue;
        }
        return { ok: false, status: 'empty-body' };
      }
      return { ok: true, buf };
    } catch (err) {
      if (attempt === 1) {
        await sleep(REQUEST_DELAY_MS);
        continue;
      }
      return { ok: false, status: err.message };
    }
  }
}

async function main() {
  const manifest = await loadManifest();
  const manifestByPage = new Map(manifest.map((p) => [p.slug, p]));

  // Everything already recorded, per page, as a Set of clean source URLs.
  const havePerPage = new Map();
  for (const page of manifest) {
    havePerPage.set(page.slug, new Set(page.assets.map((a) => cleanUrl(a.source))));
  }

  const htmlFiles = (await readdir(HTML_DIR)).filter((f) => f.endsWith('.html'));

  // First pass: figure out every (page, url) pair that's referenced but
  // missing, and the global set of all referenced URLs (for the summary).
  const referencedGlobal = new Set();
  const alreadyGlobal = new Set();
  const toFetch = []; // { slug, url }
  const domCache = new Map(); // slug -> cheerio $

  for (const file of htmlFiles) {
    const slug = file.replace(/\.html$/, '');
    const html = await readFile(join(HTML_DIR, file), 'utf8');
    const urls = findCdnImageUrls(html);
    const have = havePerPage.get(slug) ?? new Set();

    for (const url of urls) {
      referencedGlobal.add(url);
      if (have.has(url)) {
        alreadyGlobal.add(url);
        continue;
      }
      toFetch.push({ slug, url, html });
    }
  }

  console.log(`Referenced (distinct, global): ${referencedGlobal.size}`);
  console.log(`Already present per-page-source matches: ${[...referencedGlobal].filter((u) => alreadyGlobal.has(u)).length}`);
  console.log(`Missing (page, url) pairs to backfill: ${toFetch.length}`);
  console.log('');

  const downloadCache = new Map(); // clean url -> { name, buf } | { failed: true }
  const failures = []; // { slug, url, reason }
  let downloadedCount = 0;
  let addedEntries = 0;

  for (const { slug, url, html } of toFetch) {
    let cached = downloadCache.get(url);

    if (!cached) {
      console.log(`FETCH ${url}`);
      const result = await fetchWithRetry(url);
      await sleep(REQUEST_DELAY_MS);

      if (!result.ok) {
        console.warn(`  FAIL (${result.status}) ${url}`);
        cached = { failed: true, status: result.status };
      } else {
        const hash = createHash('sha1').update(url).digest('hex').slice(0, 8);
        const ext = extname(new URL(url).pathname) || '.jpg';
        cached = { name: `${hash}${ext}`, buf: result.buf };
        downloadedCount++;
      }
      downloadCache.set(url, cached);
    }

    if (cached.failed) {
      failures.push({ slug, url, reason: cached.status });
      continue;
    }

    await mkdir(join(ASSETS_DIR, slug), { recursive: true });
    await writeFile(join(ASSETS_DIR, slug, cached.name), cached.buf);

    let $ = domCache.get(slug);
    if (!$) {
      $ = cheerio.load(html);
      domCache.set(slug, $);
    }
    const { alt, role } = describeReference($, url);

    const page = manifestByPage.get(slug);
    if (!page) {
      console.warn(`  WARNING: no manifest page entry for slug "${slug}", skipping record for ${url}`);
      continue;
    }
    const entry = { file: cached.name, alt, source: url };
    if (role) entry.role = role;
    page.assets.push(entry);
    addedEntries++;
  }

  await saveManifest(manifest);

  console.log('');
  console.log('=== Summary ===');
  console.log(`Referenced (distinct, global):     ${referencedGlobal.size}`);
  console.log(`Already present before this run:   ${alreadyGlobal.size}`);
  console.log(`Missing (page, url) pairs found:   ${toFetch.length}`);
  console.log(`Distinct URLs downloaded:          ${downloadedCount}`);
  console.log(`Manifest entries added:            ${addedEntries}`);
  console.log(`Failed downloads (unique URLs):    ${new Set(failures.map((f) => f.url)).size}`);

  if (failures.length) {
    console.log('');
    console.log('=== FAILURES (not silently dropped -- reported here) ===');
    for (const f of failures) {
      console.log(`  [${f.slug}] ${f.url} -- ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
