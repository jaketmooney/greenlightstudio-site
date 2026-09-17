export const BASE = 'https://www.greenlightstudio.co';

// { old: legacy path, slug: new slug under /case-studies/ }
export const CASE_STUDIES = [
  { old: '/case-studies/amazon-ad-videos-luxogear',                     slug: 'luxogear-amazon-ad-videos' },
  { old: '/case-studies/bliss-bilingual-seo-rebuild',                   slug: 'bliss-bilingual-seo-rebuild' },
  { old: '/case-studies/global-marketing-support-ziegler-group',        slug: 'ziegler-global-marketing' },
  { old: '/case-studies/how-alger-consulting-built-a-coaching-brand-the-calm-way', slug: 'alger-consulting-coaching-brand' },
  { old: '/case-studies/peterson-timber-digital-home-seo-success',      slug: 'peterson-timber-seo' },
  { old: '/case-studies/shils-one-day-cost-advantage-filming-abroad-chiang-mai-thailand', slug: 'shils-filming-chiang-mai' },
  { old: '/case-studies/why-a-geneva-ngo-interviewing-world-leaders-didnt-need-a-studio-for-a-credible-podcast', slug: 'geneva-ngo-podcast' },
  { old: '/case-study/5-years-of-remote-marketing-support-for-a-machinery-manufacturer', slug: 'machinery-manufacturer-5-years' },
  { old: '/case-study/how-green-light-studio-helped-trifecta-wireless-find-the-right-marketing-direction-and-turn-the-business-around', slug: 'trifecta-wireless-turnaround' },
  { old: '/case-study/rapid-website-development-for-a-mobile-app-launch-how-ancestree-got-ready-in-time', slug: 'ancestree-rapid-website' },
  { old: '/case-study-boklua-view-resort-video',                        slug: 'boklua-view-resort-video' },
  { old: '/case-study-boklua-view-resort-website',                      slug: 'boklua-view-resort-website' },
  { old: '/case-study-helping-vps-hispeed-make-an-impact-at-digitech-2023', slug: 'vps-hispeed-digitech-2023' },
  { old: '/case-study-how-social-listening-helped-vps-hispeed-improve-marketing-and-customer-support', slug: 'vps-hispeed-social-listening' },
  { old: '/case-study-the-echo-asia-video-project',                     slug: 'echo-asia-video' },
  { old: '/1-9m-views-in-6-months-for-forestry-media-company',          slug: 'forestnet-1-9m-views' },
  { old: '/building-a-scalable-youtube-strategy-for-vps-hispeed',       slug: 'vps-hispeed-youtube-strategy' },
  { old: '/building-an-impactful-personal-brand',                       slug: 'impactful-personal-brand' },
  { old: '/how-we-helping-namjai-village-get-seen',                     slug: 'namjai-village-visibility' },
  { old: '/marketing-management-for-vps-hispeed-a-2-year-partnership',  slug: 'vps-hispeed-marketing-management' },
  { old: '/tackling-outdated-marketing-and-budget-constraints-bike-tour-asia-case-study', slug: 'bike-tour-asia-marketing' },
  { old: '/transforming-vps-hispeeds-website-for-a-modern-customer-focused-brand', slug: 'vps-hispeed-website-redesign' },
  { old: '/turning-ideas-into-impact-building-namjais-podcast-content-machine', slug: 'namjai-podcast-content-machine' },
];

export const PAGES = [
  { old: '/',         slug: 'home',     kind: 'home' },
  { old: '/our-work', slug: 'our-work', kind: 'index' },
  ...CASE_STUDIES.map((c) => ({ ...c, kind: 'case-study' })),
];

// Legacy URLs that are cut and 301 to a destination.
export const CUT_REDIRECTS = [
  { from: '/jake-take',  to: '/#contact-2026' },
  { from: '/services/*', to: '/#services'     },
  { from: '/events',     to: '/'              },
  { from: '/home-old',   to: '/'              },
];
