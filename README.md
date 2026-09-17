# greenlightstudio.co

Static site for Green Light Studio. Astro 7 → Cloudflare Workers static assets.
Replaced a Duda site in September 2026.

**26 pages:** homepage, `/our-work`, 23 case studies, 404.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # generates + verifies redirects, then builds to dist/
```

Node 22.12+ required.

## Deploying

Push to `main`. Cloudflare rebuilds and deploys in about 50 seconds. There is no
other step.

## Layout

| Path | What it is |
|---|---|
| `src/data/featured.ts` | The 8 case studies shown on the homepage, in display order |
| `src/content/case-studies/<slug>/index.md` | One case study, with its images alongside |
| `src/components/home/` | One file per homepage section |
| `scripts/inventory.mjs` | Single source of truth for every legacy URL → new slug |
| `public/_redirects` | **Generated.** Edit `scripts/inventory.mjs` and run `npm run redirects` |
| `_archive/` | The captured Duda site — 25 pages, 367 images. The only copy of the originals. |

## Adding a case study

Create `src/content/case-studies/<slug>/index.md` with its images in the same
folder. The frontmatter schema is enforced at build time, so a missing or
malformed field fails the build and names itself.

If the old site had a different URL for it, add that to `scripts/inventory.mjs`
and run `npm run redirects`.

## Notes for whoever works on this next

A handful of settings look arbitrary but are load-bearing — trailing slashes,
Tailwind's source scope, `@theme static`, `generateId`, and the redirect
ordering rules. Each has a comment at its definition explaining what breaks
without it.

The `gls-website` Claude skill carries the full context, including the DNS
cutover procedure. **The domain has two independent email senders behind
`DMARC p=reject`, so DNS mistakes bounce mail rather than filtering it.** The
pre-cutover zone is recorded in `_archive/dns-before.md`.
