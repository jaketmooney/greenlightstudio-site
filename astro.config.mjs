import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://greenlightstudio.co',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which strips whitespace between
  // inline elements using JSX rules — "<span>hello</span> <em>world</em>"
  // renders as "helloworld". This site is being rebuilt for visual parity with
  // the live Duda site, so keep the pre-v7 HTML-aware behaviour.
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
