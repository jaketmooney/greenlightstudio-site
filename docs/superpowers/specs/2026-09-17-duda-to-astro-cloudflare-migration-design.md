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
- 23 case study pages
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
| Framework | Astro 7, `output: 'static'` | Ships zero JS by default; content collections are native. Astro 5 carries a critical AVIF RCE advisory (GHSA-26w7-cxv4-gfx2) and 9 others; v7 clears them. |
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
/case-studies/<slug>       23 case studies
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
| bare root slug | 8 |

### Case study inventory (23)

All 23 confirmed HTTP 200 on 2026-09-17.

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
23. `turning-ideas-into-impact-building-namjais-podcast-content-machine`

Final slugs are shortened during implementation and recorded in the redirect
map. Every original URL keeps a 301.

### Missing case study: workwear / CRO

The homepage advertises a "389% Conversion Growth" workwear case study linking
to `/ cro-case-study-workwear-branding-sme-growth` (with a leading space). The
same path appears in the sitemap.

Verified 2026-09-17: the URL returns **404 with or without the leading space**.
The page does not exist. The broken link is therefore not a typo to repair — the
target content is absent.

Default disposition: remove the dead card from the homepage. If the content
exists somewhere off-site, it can be added later as a normal case study. This is
a content decision for the site owner, not a technical blocker.

## Content model

Case studies are an Astro content collection: one markdown file per study in
`src/content/case-studies/`, rendered by a single `[slug].astro` template.

This mirrors how Duda already stores them — all 23 render through one shared
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
# Case studies — 23 explicit lines, one per original URL
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
| Homepage advertises a workwear case study whose target 404s (page does not exist — see above) | Remove the dead card; re-add if the content resurfaces |
| `/our-work` links to `/home-old#GetStarted` and `/home-old#contact` | Repoint to `/#contact-2026` |
| Stale sitemap missing several live case studies | Generated by `@astrojs/sitemap` from actual routes |
| Universal Analytics tag `UA-147403899-1` (dead since 2023) | Removed; replaced by Cloudflare Web Analytics |
| MailerLite popup script | Removed |

## DNS and email (audited 2026-09-17)

**Registrar:** Squarespace (inherited from the Google Domains acquisition).
**Nameservers:** Google Cloud DNS — `ns-cloud-a{1..4}.googledomains.com`.

Nameservers are changed at Squarespace. The zone records themselves currently
live on the Google Cloud DNS side.

Current records:

| Type | Value |
|---|---|
| MX | Google Workspace — `aspmx.l.google.com` (1), `alt1`/`alt2` (5), `alt3`/`alt4` (10) |
| SPF | `v=spf1 include:_spf.google.com include:_spf.mlsend.com ~all` |
| DKIM | `google._domainkey` — RSA key present |
| DMARC | `v=DMARC1; p=reject; pct=100; rua=mailto:...@dmarc.postmarkapp.com` |
| CAA | none |
| Subdomains | `www` only |

### Critical: DMARC is `p=reject`

The policy is strict and correctly configured. The consequence for this
migration is that **if SPF or DKIM fail to replicate exactly through the
nameserver change, outbound mail bounces rather than being filtered to spam.**
Inbound mail is unaffected. This is the highest-consequence step in the project.

`_spf.mlsend.com` is MailerLite. MailerLite is being removed from the *website*,
but the SPF include must be retained if newsletters still send through it. It
must not be treated as dead configuration to clean up.

### Registrar transfer is out of scope

Changing nameservers is sufficient, free, and reversible within minutes.
Transferring the registrar from Squarespace to Cloudflare Registrar is a
separate, slower, harder-to-reverse operation with no benefit to this project.
It can be considered independently later.

## Cutover sequence

Order matters. Duda is cancelled last.

1. Build and deploy to the `*.pages.dev` preview URL
2. Review side-by-side against the live Duda site
3. **Capture a full screenshot/export of the current DNS zone** as a known-good
   reference. Cloudflare's import scan is used for speed, but is diffed against
   this reference rather than trusted outright.
4. Add the domain to Cloudflare, let it scan, then **manually verify MX, SPF,
   DKIM and DMARC** against the step 3 reference
5. Change nameservers at Squarespace to the assigned Cloudflare pair
6. Point apex and `www` at Cloudflare Pages
7. **Send and receive a test email in both directions**, and confirm the
   Postmark DMARC digest shows no new failures, before proceeding
8. Verify every redirect resolves
9. Submit the new sitemap to Google Search Console
10. Monitor for 48 hours
11. **Only then** cancel Duda

## Risks

| Risk | Mitigation |
|---|---|
| **Duda lapses before assets are captured** — images become unrecoverable | Asset download is the first implementation task, not the last. Cancellation is step 11 of cutover. |
| **Nameserver move breaks outbound email.** DMARC is `p=reject`, so an SPF or DKIM mismatch bounces mail rather than filtering it | Capture the zone as a reference before switching (cutover step 3), verify records manually against it (step 4), and send/receive test mail before proceeding (step 7) |
| SPF `include:_spf.mlsend.com` dropped as "unused" when MailerLite is removed from the site | MailerLite is removed from the *page* only. The SPF include is retained; noted explicitly in the DNS section. |
| SEO dip from dropping the blog | Accepted trade-off. 301s pass equity to `/` rather than 404ing. |
| Editing shifts from a visual editor to markdown in git | Accepted knowingly. Claude Code handles the git mechanics. |

## Success criteria

- All 25 routable pages (homepage + `/our-work` + 23 case studies), plus the 404
  page, render and visually match the current site within reasonable tolerance
- Every pre-migration URL either resolves or 301s — zero new 404s
- Lighthouse performance score above 95 on the homepage and on a case study page
- Email continues to deliver through the nameserver change
- Hosting cost: $0/month
- Adding a new case study requires only a new markdown file
