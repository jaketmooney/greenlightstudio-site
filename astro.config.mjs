import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://greenlightstudio.co',
  output: 'static',

  // Astro's directory build format emits /our-work/index.html, and Cloudflare
  // 307s /our-work to /our-work/. Enforcing 'always' keeps internal links,
  // redirect targets and the sitemap on the same form, so nothing takes an
  // extra hop.
  trailingSlash: 'always',
  // Astro 7 defaults compressHTML to 'jsx', which strips whitespace between
  // inline elements using JSX rules — "<span>hello</span> <em>world</em>"
  // renders as "helloworld". This site is being rebuilt for visual parity with
  // the live Duda site, so keep the pre-v7 HTML-aware behaviour.
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
