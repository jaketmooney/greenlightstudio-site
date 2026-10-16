// The rotating results in the homepage hero's green card. Three slots, one
// per list: a headline number, an outcome, a short client quote. Every few
// seconds one slot swaps to its next item, left to right, so the card never
// changes all at once.
//
// Every line is backed by the linked case study (or, for quotes, copied word
// for word from it or from testimonials.ts). Quotes from Steve Krupp, Scott
// Stoodley and Beth Tichenor are left out: Jake keeps them off the homepage.
//
// Order matters: the three lists run in step, so the items at the same
// position, and at the next one, must all be different clients. Otherwise
// the card could show ForestNet twice at once. `clashes()` checks this and
// the hero fails the build if it finds one. Keep the three lists the same
// length.

export type ResultIcon =
  | 'play' | 'book' | 'globe' | 'search' | 'users' | 'trend' | 'phone'
  | 'check' | 'calendar' | 'mic' | 'cap' | 'stage' | 'quote';

interface Base {
  /** Case study slug; the item links to it. */
  slug: string;
  /** Short client name shown under the item. */
  client: string;
}
export interface Stat extends Base { icon: ResultIcon; value: string; label: string }
export interface Outcome extends Base { icon: ResultIcon; text: string }
export interface Quote extends Base { text: string; name: string }

export const STATS: Stat[] = [
  { icon: 'play', value: '1.9M', label: 'views in 6 months', client: 'ForestNet Media', slug: 'forestnet-1-9m-views' },
  { icon: 'book', value: '800+', label: 'leads from one ebook', client: 'Digital Wood Carver', slug: 'machinery-manufacturer-5-years' },
  { icon: 'globe', value: '15+', label: 'countries supported', client: 'Ziegler Group', slug: 'ziegler-global-marketing' },
  { icon: 'search', value: '#1', label: 'on Google for local logging searches', client: 'Peterson Timber', slug: 'peterson-timber-seo' },
  { icon: 'users', value: '+11%', label: 'customer base in 6 weeks', client: 'Trifecta Wireless', slug: 'trifecta-wireless-turnaround' },
  { icon: 'play', value: '81K+', label: 'YouTube views', client: 'VPS HiSpeed', slug: 'vps-hispeed-youtube-strategy' },
  { icon: 'phone', value: '15', label: 'Reels from one 6-hour shoot', client: 'Shil Shanghavi', slug: 'shils-filming-chiang-mai' },
];

export const OUTCOMES: Outcome[] = [
  { icon: 'globe', text: 'Global marketing, from fragmented to unified', client: 'Ziegler Group', slug: 'ziegler-global-marketing' },
  { icon: 'search', text: 'Page 1 on Google within weeks of launch', client: 'Peterson Timber', slug: 'peterson-timber-seo' },
  { icon: 'trend', text: 'Profitable again after a two-year decline', client: 'Trifecta Wireless', slug: 'trifecta-wireless-turnaround' },
  { icon: 'play', text: 'More views in 6 months than the previous 9 years', client: 'ForestNet Media', slug: 'forestnet-1-9m-views' },
  { icon: 'calendar', text: '5+ years running their day-to-day marketing', client: 'Digital Wood Carver', slug: 'machinery-manufacturer-5-years' },
  { icon: 'cap', text: 'First online course, reaching hundreds of students', client: 'Alger Consulting', slug: 'alger-consulting-coaching-brand' },
  { icon: 'mic', text: 'Brand, website and podcast live in four months', client: 'Namjai Village', slug: 'namjai-village-visibility' },
];

export const QUOTES: Quote[] = [
  { text: 'Green Light Studio has become the team for us.', name: 'Diederik De Gee', client: 'VPS HiSpeed', slug: 'vps-hispeed-digitech-2023' },
  { text: '…a team that can adapt quickly while consistently delivering high-quality content.', name: 'Anthony Robinson', client: 'ForestNet Media', slug: 'forestnet-1-9m-views' },
  { text: 'Our Product Listing now has great video content … with improved conversion.', name: 'David Mertens', client: 'LuxoGear', slug: 'luxogear-amazon-ad-videos' },
  { text: "They're proactive, quick to respond, and always ready for anything.", name: 'Paulina Lewandowska', client: 'Ziegler Group', slug: 'ziegler-global-marketing' },
  { text: 'The Pod is lending legitimacy to our organization, and we are reaching new people.', name: 'Trey Cason', client: 'Geneva Institute', slug: 'geneva-ngo-podcast' },
  { text: "Jake took over things I didn't have time for…", name: 'Burl Tichenor', client: 'Digital Wood Carver', slug: 'machinery-manufacturer-5-years' },
  { text: '…our branding and media finally do justice to the amazing experiences we offer!', name: 'Daniel Senicar', client: 'Bike Tour Asia', slug: 'bike-tour-asia-marketing' },
];

/** Positions where the card would show one client twice at once. */
export function clashes(): string[] {
  const lists = [STATS, OUTCOMES, QUOTES];
  const n = Math.max(...lists.map((l) => l.length));
  const at = (list: Base[], i: number) => list[i % list.length].client;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    // The slots advance left to right, so these three combinations are what
    // a visitor sees between position i and position i + 1.
    const views = [
      [at(STATS, i), at(OUTCOMES, i), at(QUOTES, i)],
      [at(STATS, i + 1), at(OUTCOMES, i), at(QUOTES, i)],
      [at(STATS, i + 1), at(OUTCOMES, i + 1), at(QUOTES, i)],
    ];
    for (const v of views) if (new Set(v).size < v.length) out.push(`position ${i}: ${v.join(' / ')}`);
  }
  return out;
}
