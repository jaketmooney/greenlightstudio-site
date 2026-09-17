# Design: greenlightstudio.co — Duda to Astro on Cloudflare Pages

**Date:** 2026-09-17
**Status:** Approved, pending implementation plan

## Problem

greenlightstudio.co runs on Duda. The goal is to leave Duda for a self-hosted
static site on Cloudflare Pages: no monthly hosting fee, full ownership of the
markup, and no vendor to migrate away from again.

The rebuild must look substantially the same as the current site. Exact pixel
parity is not required.

## Scope

**In scope**

- Homepage
- `/our-work` case study index
- 22 case study pages
- 404 page

**Out of scope (explicitly cut)**

| Cut | Disposition |
|---|---|
| ~45 blog/insight posts | 301 to `/` |
| 4 `/services/*` pages | 301 to `/#services` |
| `/jake-take` intake form | Page deleted, 301 to `/#contact-2026`. Zero submissions to date; not worth maintaining. |
| `/events` | 301 to `/` |
| `/home-old` | 301 to `/` |
| CMS, search, comments, dark mode, blog | Not built |

The decision to drop the blog was made knowingly. Those URLs still resolve via
301 rather than 404ing, so link equity passes to the homepage rather than being lost.

## Approach

Hand-rebuild each section in Astro + Tailwind using the existing brand tokens.

Two alternatives were rejected:

- **Scraping and cleaning Duda's HTML/CSS** — closer to pixel-perfect faster,
  but inherits Duda's generated class soup (`dmRespDesignRow`, `u_1554741311`)
  and React runtime hooks. Trades one unmaintainable site for another.
- **Migrate plus light redesign** — out of scope; the brief is visual parity.

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro 5, `output: 'static'` | Ships zero JS by default; content collections are native |
| Styling | Tailwind CSS 4 | Brand tokens as CSS variables |
| Fonts | `@fontsource` Rubik + Source Sans Pro | Same fonts as today, self-hosted, no Google CDN request |
| Images | Astro `<Image>` + sharp | Auto WebP/AVIF, responsive sizes, lazy loading |
| Video | `lite-youtube-embed` | Facade; the 4 YouTube embeds load a thumbnail until clicked |
| Host | Cloudflare Pages, GitHub-connected | Push to deploy, free tier, unlimited bandwidth |
| Analytics | Cloudflare Web Analytics | Free, cookieless — no cookie banner required |

### Brand tokens

Extracted from the live site's computed styles:

| Token | Value |
|---|---|
| `--gls-green` | `#59B062` |
| `--gls-yellow` | `#FFC421` |
| `--gls-green-dark` | `#2B3C26` |
| `--gls-ink` | `#242925` |
| `--gls-paper` | `#F1EFEE` |
| Heading font | Rubik |
| Body font | Source Sans Pro |

## Site structure

```
/                          Homepage — all sections, #contact-2026 anchor preserved
/our-work                  Case study index grid
/case-studies/<slug>       22 case studies
/404                       Not found
```

### URL standardisation

Case studies currently live under four different conventions. All migrate to
`/case-studies/<slug>`; the old paths 301 to the new ones.

| Current convention | Count |
|---|---|
| `/case-studies/<slug>` | 7 |
| `/case-study/<slug>` | 3 |
| `/case-study-<slug>` (root) | 5 |
| bare root slug | 7 |

### Case study inventory (22)

Already under `/case-studies/`:

1. `amazon-ad-videos-luxogear`
2. `bliss-bilingual-seo-rebuild`
3. `global-marketing-support-ziegler-group`
4. `how-alger-consulting-built-a-coaching-brand-the-calm-way`
5. `peterson-timber-digital-home-seo-success`
6. `shils-one-day-cost-advantage-filming-abroad-chiang-mai-thailand`
7. `why-a-geneva-ngo-interviewing-world-leaders-didnt-need-a-studio-for-a-credible-podcast`

Under `/case-study/`:

8. `5-years-of-remote-marketing-support-for-a-machinery-manufacturer`
9. `how-green-light-studio-helped-trifecta-wireless-find-the-right-marketing-direction-and-turn-the-business-around`
10. `rapid-website-development-for-a-mobile-app-launch-how-ancestree-got-ready-in-time`

Root-level `case-study-*`:

11. `case-study-boklua-view-resort-video`
12. `case-study-boklua-view-resort-website`
13. `case-study-helping-vps-hispeed-make-an-impact-at-digitech-2023`
14. `case-study-how-social-listening-helped-vps-hispeed-improve-marketing-and-customer-support`
15. `case-study-the-echo-asia-video-project`

Bare root slugs:

16. `1-9m-views-in-6-months-for-forestry-media-company`
17. `building-a-scalable-youtube-strategy-for-vps-hispeed`
18. `building-an-impactful-personal-brand`
19. `how-we-helping-namjai-village-get-seen`
20. `marketing-management-for-vps-hispeed-a-2-year-partnership`
21. `tackling-outdated-marketing-and-budget-constraints-bike-tour-asia-case-study`
22. `transforming-vps-hispeeds-website-for-a-modern-customer-focused-brand`

Final slugs are shortened during implementation and recorded in the redirect
map. Every original URL keeps a 301.

## Content model

Case studies are an Astro content collection: one markdown file per study in
`src/content/case-studies/`, rendered by a single `[slug].astro` template.

This mirrors how Duda already stores them — all 22 render through one shared
template bound to `blog.title`, confirmed by the identical `id="1554741311"` H1
across pages.

```yaml
---
title: "1.9M Views in 6 Months For Forestry Media Company"
client: "ForestNet Media"
summary: "One-paragraph teaser for the /our-work card and meta description."
heroImage: "./hero.jpg"
heroAlt: "Descriptive alt text"
services: ["Video Editing", "YouTube Management"]
results:
  - { value: "1.9M", label: "total views", delta: "+539%" }
  - { value: "+2.4K", label: "new subscribers" }
publishDate: 2026-06-10
featured: true
---

Body content in markdown. Pull quotes as blockquotes with attribution.
```

The schema is validated with Zod via `defineCollection`, so malformed frontmatter
fails the build instead of shipping broken.

Adding a case study after launch means adding one `.md` file plus its images, then
committing and pushing. Cloudflare rebuilds in roughly 30 seconds.

## Asset migration

All images currently live on Duda's CDN (`static.cdn-website.com`,
`ms-cdn.multiscreensite.com`). They must be downloaded to `src/assets/` while
the Duda subscription is still active.

Alt text is already present and good on many images (for example, "Truck decal
project showing side and back views of a green Ziegler truck") and is preserved
during extraction.

YouTube embeds stay as embeds — 4 on the homepage, referenced by video ID.

## Redirects

A `_redirects` file at the project root. Cloudflare Pages reads it natively.

**Every case study redirect is written out explicitly — one line per original
URL.** Pattern matching cannot be used here, for two reasons:

1. Slugs are being shortened during migration, so source and destination do not
   share a stem (`/case-study-the-echo-asia-video-project` becomes
   `/case-studies/echo-asia-video`). A `:slug` placeholder would carry the old
   slug through unchanged.
2. Cloudflare `_redirects` placeholders match whole path segments only. A rule
   like `/case-study-:slug` is invalid, because `case-study-` is a prefix
   *within* a segment rather than a segment of its own.

```
# Case studies — 22 explicit lines, one per original URL
/1-9m-views-in-6-months-for-forestry-media-company   /case-studies/forestnet-1-9m-views   301
/case-study/rapid-website-development-for-a-mobile-app-launch-how-ancestree-got-ready-in-time   /case-studies/ancestree-rapid-website   301
/case-study-the-echo-asia-video-project              /case-studies/echo-asia-video        301
# ...19 more

# Cut sections
/jake-take     /#contact-2026  301
/services/*    /#services      301
/events        /               301
/home-old      /               301

# Blog posts — 45 explicit lines
/why-your-marketing-isnt-working-and-what-to-do-instead   /   301
# ...44 more
```

Blog redirects are enumerated explicitly rather than using a catch-all, so that
genuinely unknown URLs still return a proper 404.

Total is roughly 75 static rules, well inside Cloudflare's free-tier limit of
2,000 static redirects per project. The `/services/*` splat is the only dynamic
rule (limit: 100).

The redirect map is generated from the crawl inventory during implementation, so
the list of source URLs cannot drift from what was actually migrated.

## Defects fixed in passing

| Defect | Fix |
|---|---|
| Homepage links to `/ cro-case-study-workwear-branding-sme-growth` (leading space) — currently 404s | Correct the link to the migrated case study |
| `/our-work` links to `/home-old#GetStarted` and `/home-old#contact` | Repoint to `/#contact-2026` |
| Stale sitemap missing several live case studies | Generated by `@astrojs/sitemap` from actual routes |
| Universal Analytics tag `UA-147403899-1` (dead since 2023) | Removed; replaced by Cloudflare Web Analytics |
| MailerLite popup script | Removed |

## Cutover sequence

Order matters. Duda is cancelled last.

1. Build and deploy to the `*.pages.dev` preview URL
2. Review side-by-side against the live Duda site
3. **Audit existing DNS records, especially MX** — email must not break
4. Move nameservers from Google Cloud DNS (`ns-cloud-a{1..4}.googledomains.com`)
   to Cloudflare
5. Point apex and `www` at Cloudflare Pages
6. Verify every redirect resolves
7. Submit the new sitemap to Google Search Console
8. Monitor for 48 hours
9. **Only then** cancel Duda

## Risks

| Risk | Mitigation |
|---|---|
| **Duda lapses before assets are captured** — images become unrecoverable | Asset download is the first implementation task, not the last. Cancellation is step 9 of cutover. |
| Nameserver move breaks email | Audit and replicate all MX/TXT/CNAME records before switching (step 3) |
| SEO dip from dropping the blog | Accepted trade-off. 301s pass equity to `/` rather than 404ing. |
| Editing shifts from a visual editor to markdown in git | Accepted knowingly. Claude Code handles the git mechanics. |

## Success criteria

- All 24 routable pages (homepage + `/our-work` + 22 case studies), plus the 404
  page, render and visually match the current site within reasonable tolerance
- Every pre-migration URL either resolves or 301s — zero new 404s
- Lighthouse performance score above 95 on the homepage and on a case study page
- Email continues to deliver through the nameserver change
- Hosting cost: $0/month
- Adding a new case study requires only a new markdown file
