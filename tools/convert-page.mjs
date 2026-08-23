// Convert a hand-written HTML page into an .astro page on Base.astro.
//
// Mechanical on purpose: every page goes through the identical transform, so
// "nothing changed" is provable rather than asserted.
//
// THE ONE THING THAT IS NOT MECHANICAL, and it is trap #2 from the research:
// an inline <style> inside an .astro file is SCOPED by default. These pages
// were written with global CSS, so every extracted block is emitted as
// `<style is:global>`. Without that, six pages silently lose their styling.
//
//   node tools/convert-page.mjs <source.html> <src/pages/target.astro>

import fs from 'node:fs';
import path from 'node:path';

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.error('usage: node tools/convert-page.mjs <source.html> <target.astro>');
  process.exit(1);
}

const html = fs.readFileSync(src, 'utf8');

// WHAT THIS TOOL DOES NOT HANDLE, and refuses rather than mangles.
//
// Copilot's finding, and it is correct: this converter drops or corrupts
// several HTML shapes. The tempting fix is to teach it all of them. That is
// over-engineering a ONE-TIME tool for six known pages, none of which
// contains any of these. The right size is a loud stop, so the day someone
// points it at a seventh page it says so instead of shipping a quiet defect.
//
// Round 2 corrected the SHAPE of this guard: a blacklist can only refuse what
// somebody thought of. This is a CLOSED WHITELIST - every element in <head>
// and every script must be on a known-handled list, or the conversion stops.
// The six sources contain exactly: title, meta, link, style, and comments.
const refusals = [];

const HEAD_OK = new Set(['title', 'meta', 'link', 'style']);
const headBlock = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if (!headBlock) {
  refusals.push('no <head> at all');
} else {
  // Two pages carry an inline data-URI favicon whose value CONTAINS <svg> and
  // <text>. Scanning raw head text reports those as dropped head elements - a
  // false refusal. Quoted attribute values are removed before any tag is read.
  const stripped = headBlock[1]
    .replace(/<!--[sS]*?-->/g, '')
    .replace(/="[^"]*"/g, '=""')
    .replace(/='[^']*'/g, "=''");
  for (const m of stripped.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)/g)) {
    const tag = m[1].toLowerCase();
    if (!HEAD_OK.has(tag)) {
      refusals.push('<' + tag + '> in <head> - this converter reads only title, meta, link and style, so it would be DROPPED');
    }
  }
}

// <body> is re-emitted bare, so any attribute on it is lost.
const bodyTag = html.match(/<body([^>]*)>/i);
if (bodyTag && bodyTag[1].trim()) {
  refusals.push('<body> carries attributes (' + bodyTag[1].trim() + ') - the converter emits a bare body');
}

// Inline scripts are re-emitted as `is:inline` with NO attributes at all. That
// silently turns a module into a classic script and structured data into
// executable JavaScript, so a script may carry no attribute except src.
for (const m of html.matchAll(/<script([^>]*)>/gi)) {
  const a = m[1].trim();
  if (!a) continue;                       // a bare inline script is handled
  if (/^src\s*=/i.test(a)) continue;      // src scripts are left alone in place
  refusals.push('<script ' + a.slice(0, 60) + '> - every attribute is dropped on re-emission, including type');
}

if (refusals.length) {
  console.error('REFUSING ' + src + ' - this converter cannot do it faithfully:');
  for (const r of refusals) console.error('   - ' + r);
  console.error('Convert it by hand, or teach the converter first. Do not proceed.');
  process.exit(1);
}

const pick = (re) => { const m = html.match(re); return m ? m[1] : null; };

// Decode the entities the source HTML carries. Without this a source &quot; is
// passed verbatim into an Astro attribute and Astro escapes the & AGAIN,
// shipping &amp;quot; in the rendered meta. Only a head-meta comparison sees it.
const decode = (s) => (s ?? '')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&');

// The delimiter is CAPTURED and matched with a backreference. The previous
// version used [^"']* for the value, which truncates at the first Hebrew
// geresh: "מספיק להאכיל את הצ'אט" was cut to "מספיק להאכיל את הצ".
const attr = (name, kind = 'name') => {
  const m = html.match(
    new RegExp(`<meta\\s+${kind}=["']${name}["']\\s+content=(["'])([\\s\\S]*?)\\1`, 'i'),
  );
  return m ? decode(m[2]) : null;
};

const title = decode(pick(/<title>([\s\S]*?)<\/title>/i)?.trim());
const description = attr('description');
const ogUrl = attr('og:url', 'property');
const ogImage = attr('og:image', 'property');
const ogImageAlt = attr('og:image:alt', 'property');
const ogType = attr('og:type', 'property') || 'website';
// only two of the six pages carry a share card. Adding og tags to a page that
// never had them is a CHANGE, and neither a pixel diff nor a body-DOM diff can
// see it - astro check found this, not the proof harness.
const hasShare = /property=["']og:/.test(html);
const ogTitle = attr('og:title', 'property');
const ogDescription = attr('og:description', 'property');
const twitterTitle = attr('twitter:title');
const twitterDescription = attr('twitter:description');
const robots = attr('robots');
// Two pages carry their own inline data-URI favicon, and THREE carry no
// apple-touch-icon at all. Read both from the source rather than assuming
// either - Copilot found the favicon half; the proof harness found the rest.
// MANDATORY, not cosmetic: the live pages all sit at the root, so a bare
// 'favicon.svg' resolves to /favicon.svg. The SAME relative href on a page
// served from /dates/ resolves to /dates/favicon.svg - a 404. data: and
// absolute URLs are left alone.
const absIcon = (h) =>
  h.startsWith('data:') || h.startsWith('http') || h.startsWith('/')
    ? h
    : '/' + (h.startsWith('./') ? h.slice(2) : h);
const linkHref = (rel) => {
  const m = html.match(
    new RegExp('<link\\s+rel=["\']' + rel + '["\'][^>]*?href=(["\'])([\\s\\S]*?)\\1', 'i'),
  );
  return m ? decode(m[2]) : null;
};
const favicon = linkHref('icon');
// Three pages carry NO apple-touch-icon and /thanks/ carries no favicon at
// all. The layout emitted both unconditionally - the identical defect to the
// OG card that shipped onto four pages that never had one. Pass what the
// source actually has; the layout emits nothing when there is nothing.
const appleTouchIcon = linkHref('apple-touch-icon');

if (!title) { console.error(`no <title> in ${src}`); process.exit(1); }

// every <style> block in the head, concatenated in order
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);

// every inline <script> in the body, in order (src= scripts are left alone)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) { console.error(`no <body> in ${src}`); process.exit(1); }
let body = bodyMatch[1];

const scripts = [];
body = body.replace(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi, (_, code) => {
  scripts.push(code);
  return '';
});

// internal links move to the unified URL shape - his ruling 21.8.
// The old URLs stay alive through astro.config redirects; these are the links
// we control and they point at the canonical shape.
const RELINK = [
  [/href="accessibility\.html"/g, 'href="/accessibility/"'],
  [/href="https:\/\/guymalul\.co\.il\/accessibility\.html"/g, 'href="https://guymalul.co.il/accessibility/"'],
  [/href="dates\.html"/g, 'href="/dates/"'],
  [/href="https:\/\/guymalul\.co\.il\/dates\.html"/g, 'href="https://guymalul.co.il/dates/"'],
  [/href="\/dates\.html"/g, 'href="/dates/"'],
  [/href="\/accessibility\.html"/g, 'href="/accessibility/"'],
  // index.html was MISSING from this table, and it is the one that bites: a
  // page at /dates/ linking href="index.html" resolves to /dates/index.html -
  // itself - not to the landing page. Seven of them, including the
  // cancellation-terms link a buyer follows before paying.
  [/href="index\.html#/g, 'href="/#'],
  [/href="index\.html"/g, 'href="/"'],
  [/href="\/index\.html"/g, 'href="/"'],
];
let relinked = 0;
for (const [re, to] of RELINK) {
  const before = body;
  body = body.replace(re, to);
  if (body !== before) relinked += (before.match(re) || []).length;
}

// Values are passed as JS EXPRESSIONS, not as quoted attributes.
//
// Why: a quoted attribute cannot hold a real " so the value has to be encoded
// back to &quot; - and Astro then treats that as a literal string and escapes
// the & on output, shipping &amp;quot;. Round-tripping through entities is the
// bug. JSON.stringify hands Astro the exact decoded string and Astro encodes it
// correctly once, on render.
const expr = (s) => `{${JSON.stringify(s)}}`;
const props = [
  `  title=${expr(title)}`,
  description && `  description=${expr(description)}`,
  ogUrl && `  canonical=${expr(ogUrl.replace(/dates\.html/, 'dates/').replace(/accessibility\.html/, 'accessibility/'))}`,
  ogImage && `  ogImage=${expr(ogImage)}`,
  ogImageAlt && `  ogImageAlt=${expr(ogImageAlt)}`,
  ogTitle && `  ogTitle=${expr(ogTitle)}`,
  ogDescription && `  ogDescription=${expr(ogDescription)}`,
  twitterTitle && `  twitterTitle=${expr(twitterTitle)}`,
  twitterDescription && `  twitterDescription=${expr(twitterDescription)}`,
  ogType !== 'website' && `  ogType=${expr(ogType)}`,
  robots?.includes('noindex') && `  noindex`,
  favicon && `  favicon=${expr(absIcon(favicon))}`,
  appleTouchIcon && `  appleTouchIcon=${expr(absIcon(appleTouchIcon))}`,
  hasShare && `  share`,
].filter(Boolean).join('\n');

const depth = dest.split(/[\\/]/).filter(Boolean).length - 2; // src/pages/... -> layouts
const up = '../'.repeat(Math.max(1, depth));

const out = `---
import Base from '${up}layouts/Base.astro';
---

<Base
${props}
>
${styles.map((s) => `  <style is:global>${s}</style>`).join('\n')}
${body.trim()}
${scripts.map((s) => `  <script is:inline>${s}</script>`).join('\n')}
</Base>
`;

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);

console.log(`${src}  ->  ${dest}`);
console.log(`   title:   ${title.slice(0, 60)}`);
console.log(`   styles:  ${styles.length} block(s), ${styles.join('').length} chars, emitted is:global`);
console.log(`   scripts: ${scripts.length} inline block(s), emitted is:inline`);
console.log(`   links rewritten to the unified shape: ${relinked}`);
