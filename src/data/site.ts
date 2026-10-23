// Shared by SiteHeader and SiteFooter so the two never drift apart.

// Section anchors on the homepage. On any other page these resolve back to the
// homepage first, so they work sitewide. How Tos is a dropdown of the how-to
// pages, static pages in public/how-to/ (built outside Astro). The header shows
// `label` in the dropdown; the footer has no dropdown and lists `long` instead.
export interface NavLink {
  href: string;
  label: string;
  long?: string;
}
export interface NavItem {
  href?: string;
  label: string;
  children?: NavLink[];
}

export const NAV: NavItem[] = [
  { href: '/#projects', label: 'Our Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#team', label: 'About' },
  {
    label: 'How Tos',
    children: [
      { href: '/how-to/ai-animated-videos/', label: 'Animated videos', long: 'How-to: animated videos' },
      { href: '/how-to/ai-product-renders/', label: '3D product renders', long: 'How-to: 3D product renders' },
    ],
  },
  { href: '/#contact-2026', label: 'Contact' },
];

// Order and targets taken from the live site's header social hub.
// NOTE: the site's linked address is hello@, not jacob@. All 50 mailto:
// links across the archived pages use hello@; jacob@ appears once, as
// plain text in the homepage contact section only.
// Rendered as icon glyphs with no visible text, so the accessible name
// comes from aria-label.
export const SOCIAL = [
  {
    href: 'mailto:hello@greenlightstudio.co',
    label: 'Email',
    path: 'M1.5 4.5h21v15h-21v-15Zm1.8 1.8v.4l8.7 5.6 8.7-5.6v-.4H3.3Zm17.4 3-8.7 5.6-8.7-5.6v8.4h17.4v-8.4Z',
  },
  {
    href: 'https://www.facebook.com/greenlightstudio.co/',
    label: 'Facebook',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
  },
  {
    href: 'https://www.youtube.com/@greenlightyourmarketing',
    label: 'YouTube',
    path: 'M23.5 6.9a3 3 0 0 0-2.12-2.13C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.52A3 3 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13C24 15.21 24 12 24 12s0-3.21-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z',
  },
  {
    href: 'https://www.linkedin.com/company/green-light-marketing-solutions/',
    label: 'LinkedIn',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  },
];
