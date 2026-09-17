// Asserts public/_redirects covers every legacy URL and contains no rule
// Cloudflare would silently never match. Runs as part of `npm run build`.
import { readFile } from 'node:fs/promises';
import { CASE_STUDIES, CUT_REDIRECTS } from './inventory.mjs';
import { CUT_PAGES } from './cut-pages.mjs';

const text = await readFile('public/_redirects', 'utf8');
const rules = text.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
const sources = rules.map((l) => l.trim().split(/\s+/)[0]);
const sourceSet = new Set(sources);

const fail = (msg) => {
  console.error(msg);
  process.exitCode = 1;
};

// 1. Every legacy URL is covered.
const required = [
  ...CASE_STUDIES.filter((c) => c.old !== `/case-studies/${c.slug}`).map((c) => c.old),
  ...CUT_REDIRECTS.map((r) => r.from),
  ...CUT_PAGES,
];
const missing = required.filter((p) => !sourceSet.has(p));
if (missing.length) fail(`MISSING REDIRECTS (${missing.length}):\n  ` + missing.join('\n  '));

// 2. No intra-segment placeholder. Cloudflare matches whole path segments, so
//    a rule like /case-study-:slug never fires.
const badPlaceholder = sources.filter((s) => /[^/\s]:[a-zA-Z]/.test(s));
if (badPlaceholder.length)
  fail('INVALID intra-segment placeholder:\n  ' + badPlaceholder.join('\n  '));

// 3. No duplicate source. Cloudflare takes the first match, so a duplicate
//    silently shadows the later rule.
const dupes = sources.filter((s, i) => sources.indexOf(s) !== i);
if (dupes.length) fail('DUPLICATE SOURCES:\n  ' + [...new Set(dupes)].join('\n  '));

// 4. No cut page shadowed by an earlier wildcard sending it elsewhere.
const wildcards = rules
  .map((l) => l.trim().split(/\s+/))
  .filter(([from]) => from.endsWith('/*'));
const shadowed = [];
for (const [from, to] of wildcards) {
  const prefix = from.slice(0, -1);
  for (const r of rules) {
    const [src, dest] = r.trim().split(/\s+/);
    if (src !== from && src.startsWith(prefix) && dest !== to)
      shadowed.push(`${src} -> ${dest} conflicts with ${from} -> ${to}`);
  }
}
if (shadowed.length) fail('WILDCARD CONFLICTS:\n  ' + shadowed.join('\n  '));

// 5. Free-tier limits: 2000 static rules, 100 dynamic.
const dynamic = sources.filter((s) => s.includes('*') || s.includes(':')).length;
if (sources.length - dynamic > 2000) fail('Over Cloudflare free-tier static redirect limit');
if (dynamic > 100) fail('Over Cloudflare free-tier dynamic redirect limit');

if (!process.exitCode)
  console.log(
    `OK: ${rules.length} rules (${dynamic} dynamic), all ${required.length} legacy URLs covered`
  );
