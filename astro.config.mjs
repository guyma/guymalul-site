// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://guymalul.co.il',

  // ONE url shape, Astro's own. The owner's ruling 21.8: the site used to mix
  // /dates.html with /prework/, and preserving that inconsistency was the wrong
  // thing to preserve. 'directory' also dissolves the @astrojs/sitemap defect
  // that emits 404ing URLs under 'preserve'.
  build: { format: 'directory' },

  // NOT the v7 default 'jsx'. That mode glues Hebrew words together across
  // newlines, and a DOM diff is structurally blind to it - only a screenshot
  // catches it.
  compressHTML: true,

  integrations: [
    sitemap({
      // #6 (Copilot): every generated route was submitted, including the two
      // that are deliberately out of search. /thanks/ was simultaneously
      // submitted AND marked noindex, which is a contradiction a crawler reads.
      filter: (page) =>
        !page.includes('/thanks/') && !page.includes('/prework/questionnaire/'),
    }),
  ],

  // NOTE on the two URLs that move (/dates.html, /accessibility.html):
  // Astro's `redirects` option was tried first and REJECTED after building it.
  // Under build.format 'directory' it emits dist/accessibility.html/index.html
  // - a DIRECTORY named accessibility.html - so /accessibility.html only
  // resolves via a host-provided 301 to /accessibility.html/, then a meta
  // refresh: three hops, and the first one depends on GitHub Pages' directory
  // behaviour, which is an assumption rather than a guarantee.
  // The stubs in public/ are copied byte-for-byte, so /accessibility.html is a
  // real FILE. Two hops, no assumption. See public/accessibility.html.
});
