// The blog collection.
//
// This path is `src/content.config.ts` at the src root - NOT the older
// `src/content/config.ts`. `z` comes from `astro/zod`, not a separately
// installed zod. Both were verified against the Astro 7 docs before writing.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // `[^_]*` keeps an underscore-prefixed file out of the build, which is the
  // idiomatic "not ready yet" without needing a flag.
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: z.object({
    /** Hebrew. What the reader sees. */
    title: z.string(),
    /** Hebrew. The meta description and the share card's text. */
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    /** The small coral label above the title. Deliberately NOT a taxonomy yet -
     *  the category vocabulary is deferred until 5-10 posts exist and the real
     *  buckets are visible. Until then this names the post's kind or origin. */
    kicker: z.string().optional(),

    /** The sentence under the title, set larger than body. */
    standfirst: z.string().optional(),

    tags: z.array(z.string()).default([]),

    /** Minutes. Written, not computed, so it can be honest about a long read. */
    readingTime: z.number().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
