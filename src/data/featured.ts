// Every case study, in the order the homepage slider and /our-work show them:
// most relevant to the target buyer (a marketing lead at a manufacturer or
// B2B company) first. The top four are the site owner's own order; the rest
// rank by industry fit, then service fit (ongoing support alongside a team),
// then strength of result. Studies from the same client (VPS HiSpeed, Namjai)
// are spread out so they don't sit side by side. A case study missing from
// this list still appears, after these, newest first (see restAfterFeatured).
//
// This is a deliberate editorial order, not something derived from dates or
// flags — so it lives here rather than in frontmatter, where the ordering
// would be invisible and easy to break.
export const FEATURED_SLUGS = [
  'forestnet-1-9m-views', // ForestNet Media: industry media, retainer, 1.9M views
  'machinery-manufacturer-5-years', // Digital Wood Carver: US manufacturer, 6 years
  'ziegler-global-marketing', // Ziegler Group: alongside a corporate marketing team
  'peterson-timber-seo', // Peterson Timber: logging, #1 on Google
  'vps-hispeed-marketing-management', // VPS HiSpeed: 2+ year managed marketing
  'trifecta-wireless-turnaround', // Trifecta Wireless: two-year decline reversed
  'bike-tour-asia-marketing', // Bike Tour Asia: supporting an internal team
  'vps-hispeed-digitech-2023', // VPS HiSpeed: trade show
  'luxogear-amazon-ad-videos', // LuxoGear: product videos
  'echo-asia-video', // ECHO Asia: NGO brand video
  'vps-hispeed-youtube-strategy', // VPS HiSpeed: YouTube strategy
  'ancestree-rapid-website', // AncesTREE: wood-industry website
  'vps-hispeed-website-redesign', // VPS HiSpeed: website
  'geneva-ngo-podcast', // Geneva Institute: NGO podcast
  'vps-hispeed-social-listening', // VPS HiSpeed: social listening
  'namjai-village-visibility', // Namjai Village
  'bliss-bilingual-seo-rebuild', // Bliss Clean & Care: local service
  'namjai-podcast-content-machine', // Namjai Village
  'impactful-personal-brand', // Ronnie Teja: personal brand
  'shils-filming-chiang-mai', // Shil Shanghavi: speaker
  'alger-consulting-coaching-brand', // Alger Coaching
  'boklua-view-resort-website', // Boklua View Resort
  'boklua-view-resort-video', // Boklua View Resort
] as const;

type Entry = { id: string };

/** The featured entries, in FEATURED_SLUGS order. Throws if a slug is missing. */
export function featuredInOrder<T extends Entry>(all: T[]): T[] {
  const byId = new Map(all.map((e) => [e.id, e]));
  return FEATURED_SLUGS.map((slug) => {
    const entry = byId.get(slug);
    if (!entry) {
      throw new Error(
        `featured.ts lists "${slug}" but no case study has that id. ` +
          `Fix the slug or remove it from FEATURED_SLUGS.`
      );
    }
    return entry;
  });
}

/** Everything not featured, newest first. */
export function restAfterFeatured<T extends Entry & { data: { publishDate: Date } }>(
  all: T[]
): T[] {
  const featured = new Set<string>(FEATURED_SLUGS);
  return all
    .filter((e) => !featured.has(e.id))
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}
