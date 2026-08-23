// The feed. @astrojs/rss defaults trailingSlash to true, which matches the
// directory URL shape the site now uses.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
// A draft is not published. A PREVIEW build opts in explicitly with
// INCLUDE_DRAFTS=true, so 'draft: true' can stay true while the text is
// still being fixed and the owner can still look at it behind the gate.
const SHOW_DRAFTS = import.meta.env.INCLUDE_DRAFTS === 'true';
  const posts = (await getCollection('blog', ({ data }) => SHOW_DRAFTS || !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'הבלוג של גיא מלול',
    description: 'איך באמת עובדים עם AI בעסק קטן. מה שנלמד מהשולחן, בלי הייפ.',
    site: context.site,
    customData: '<language>he-IL</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
    })),
  });
}
