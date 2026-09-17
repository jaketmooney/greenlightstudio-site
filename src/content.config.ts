// Astro 6 deprecated re-exporting `z` from 'astro:content'. Import Zod from
// 'astro/zod' instead. Note Zod 4 semantics: a .default() must match the
// OUTPUT type, not the input — the defaults below already do.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  // generateId is required: without it the glob loader derives ids from the
  // file path, producing "luxogear-amazon-ad-videos/index" rather than the
  // bare slug, and every generated URL would carry a trailing /index.
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/case-studies',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      summary: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      services: z.array(z.string()).default([]),
      results: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            delta: z.string().optional(),
          })
        )
        .default([]),
      publishDate: z.coerce.date(),
      featured: z.boolean().default(false),
      legacyPath: z.string(),
    }),
});

export const collections = { caseStudies };
