// The case studies shown on the homepage, in this exact order. The same set
// leads the /our-work page, with everything else following behind.
//
// This is a deliberate editorial order chosen by the site owner, not something
// derived from dates or flags — so it lives here rather than in frontmatter,
// where the ordering would be invisible and easy to break.
export const FEATURED_SLUGS = [
  'forestnet-1-9m-views', // 1.9M Views in 6 Months For Forestry Media Company
  'ziegler-global-marketing', // A Corporate Marketing Team with Global Goals
  'machinery-manufacturer-5-years', // Fully (Remote) Managed Marketing for USA CNC Manufacturer
  'bike-tour-asia-marketing', // Boosting Internal Marketing Team for SE Asia Premium Tour Brand
  'peterson-timber-seo', // Peterson Timber
  'alger-consulting-coaching-brand', // How We Helped Alger Coaching Build Its Brand the Calm Way
  'luxogear-amazon-ad-videos', // Luxogear
  'echo-asia-video', // ECHO Asia
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
