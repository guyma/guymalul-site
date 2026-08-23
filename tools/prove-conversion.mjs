// PROVE the Astro conversion changed nothing a visitor can see.
//
// Two independent proofs, because neither alone is enough - his ruling 21.8:
//   1. DOM  - the rendered text and element structure, built vs live.
//   2. PIXELS - screenshots at three widths, pixel-diffed. This is what catches
//      a scoped style that stopped applying, a font that failed, or Hebrew
//      words glued together by compressHTML's 'jsx' mode. A DOM diff is
//      structurally blind to all three.
//
//   node tools/prove-conversion.mjs

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const ROOT = 'C:/dev/guymalul-site/dist';
const OUT = 'C:/dev/guymalul-site/tools/proof';
const PORT = 4455;
const LIVE = 'https://guymalul.co.il';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));

// built path -> the live URL it must match
const PAGES = [
  ['/',                          '/'],
  ['/dates/',                    '/dates.html'],
  ['/accessibility/',            '/accessibility.html'],
  ['/prework/',                  '/prework/'],
  ['/prework/questionnaire/',    '/prework/questionnaire/'],
  ['/thanks/',                   '/thanks/'],
];

// #3 (Copilot): the harness compared built /dates/ against live /dates.html
// and never once requested the BUILT /dates.html. A missing stub or a typo
// would report every comparison clean while every bookmark broke on deploy.
const LEGACY_URLS = ['/dates.html', '/accessibility.html'];

// desktop + tablet as plain viewports; mobile gets a REAL device descriptor,
// per the design profile: never a bare viewport resize.
const VIEWS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '768',  width: 768,  height: 1024, mobile: false },
  { name: '390',  width: 390,  height: 844, mobile: true,
    dpr: 3, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  { name: '360',  width: 360, height: 800, mobile: true,
    dpr: 3, ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' },
];

fs.mkdirSync(OUT, { recursive: true });

// #4 (Copilot, round 2): the declarations were too loose to be assertions.
// normLinks dropped EVERY canonical regardless of where it pointed, the og:url
// allowance accepted any value on /dates/, and the legacy stub check only asked
// whether SOME refresh tag existed - never where it sent the visitor. A stub
// pointing at the wrong route, or a canonical naming another page, passed all
// three. Each is now checked against the one value it is allowed to hold.
const EXPECTED_CANONICAL = new Map([
  ['/', 'https://guymalul.co.il/'],
  ['/dates/', 'https://guymalul.co.il/dates/'],
  ['/accessibility/', 'https://guymalul.co.il/accessibility/'],
  ['/prework/', 'https://guymalul.co.il/prework/'],
  ['/prework/questionnaire/', 'https://guymalul.co.il/prework/questionnaire/'],
  ['/thanks/', 'https://guymalul.co.il/thanks/'],
]);
const EXPECTED_OG_URL = new Map([['/dates/', 'https://guymalul.co.il/dates/']]);
const LEGACY_TARGET = new Map([
  ['/dates.html', '/dates/'],
  ['/accessibility.html', '/accessibility/'],
]);

// #3 (Copilot, round 2): linksChanged was COUNTED and PRINTED and never judged.
// The report showed 4, 5, 3 and 1 changed links on a passing run. That is the
// exact defect class that already shipped once - seven href="index.html" links
// on subpages resolving to themselves, including the cancellation-terms link a
// buyer follows before paying. A count is not a verdict.
//
// So every rewrite is declared as an old -> new PAIR, and any link that moved
// to something not on this list fails the run.
const INTENDED_LINKS = new Map([
  ['dates.html', '/dates/'],
  ['/dates.html', '/dates/'],
  ['https://guymalul.co.il/dates.html', 'https://guymalul.co.il/dates/'],
  ['accessibility.html', '/accessibility/'],
  ['/accessibility.html', '/accessibility/'],
  ['https://guymalul.co.il/accessibility.html', 'https://guymalul.co.il/accessibility/'],
  ['index.html', '/'],
  ['/index.html', '/'],
]);
const unintendedLinkChanges = (built, live) => {
  const bad = [];
  const n = Math.max(built.length, live.length);
  for (let i = 0; i < n; i++) {
    const b = built[i], l = live[i];
    if (b === l) continue;
    if (b === undefined || l === undefined) { bad.push(`a link was ADDED or REMOVED (live ${l} / built ${b})`); continue; }
    // an anchor keeps its fragment through the rewrite: index.html#faq -> /#faq
    const [lBase, lHash] = [l.split('#')[0], l.includes('#') ? '#' + l.split('#').slice(1).join('#') : ''];
    const want = INTENDED_LINKS.get(lBase);
    const expected = want === undefined ? undefined
      : want === '/' && lHash ? '/' + lHash
      : want + lHash;
    if (expected !== b) bad.push(`${l}  ->  ${b}  (expected ${expected ?? 'no change at all'})`);
  }
  return bad;
};

// The THREE head differences this migration intends, declared precisely so
// that anything else still fails. Blanket-ignoring <link> would hide a lost
// stylesheet, which is exactly the class of defect this harness exists for.
//
//   1. an absolute icon path. MANDATORY, not cosmetic: the live pages sit at
//      the root so relative 'favicon.svg' resolves to /favicon.svg. Under
//      directory URLs the same relative href on /dates/ resolves to
//      /dates/favicon.svg - a 404. Same for apple-touch-icon.
//   2. rel=canonical, added. It is the MECHANISM that enforces his one-URL
//      ruling: it tells a crawler /dates/ is the real page, not the stub.
//   3. Astro's own extracted CSS bundle.
const normIcon = (h) => (h ?? '').replace(/^\.?\//, '');
const normLinks = (rels) =>
  rels
    .filter((r) => !r.startsWith('canonical|'))
    .filter((r) => !/^stylesheet\|\/_astro\//.test(r))
    .map((r) => r.replace(/\|\/(favicon\.svg|apple-touch-icon\.png)$/, '|$1'))
    .join(',');


// GitHub-Pages-shaped static server over dist/
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, p);
  // never serve outside dist/. Without this, ../../.env is readable - and this
  // machine's .env holds a live payment-provider key.
  if (!path.resolve(f).startsWith(path.resolve(ROOT))) { res.writeHead(403); return res.end('no'); }
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    const ext = path.extname(f).toLowerCase();
    // every non-CSS asset used to be served as text/html, so an image or an
    // external script could never be proved by this harness.
    const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml',
      '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'content-type': TYPES[ext] ?? 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(f));
  }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { location: p + '/' }); return res.end(); }
    const i = path.join(f, 'index.html');
    if (fs.existsSync(i)) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(fs.readFileSync(i)); }
  }
  res.writeHead(404); res.end('404');
});
await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });

const snapshot = async (page) => page.evaluate(() => {
  // the visible text a reader actually gets, whitespace normalised
  const text = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
  // the element skeleton - tag names in document order
  const tags = [...document.body.querySelectorAll('*')]
    .filter((el) => !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName))
    .map((el) => el.tagName.toLowerCase());
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  // #4 (Copilot): only href was compared, so deleting every data-ends would look
  // identical - and data-ends is what stops a finished workshop still selling.
  const dataEnds = [...document.querySelectorAll('[data-ends]')].map((e) => e.getAttribute('data-ends'));
  const iconHref = document.querySelector('link[rel="icon"]')?.getAttribute('href') ?? null;
  const linkRels = [...document.querySelectorAll('link[rel]')].map((l) => l.getAttribute('rel') + '|' + l.getAttribute('href'));
  // HEAD META. astro check caught a change here that neither the pixel diff nor
  // the body-DOM diff could see: Base was emitting og tags onto four pages that
  // never carried one. A proof that cannot see the head is not a proof.
  const meta = {};
  for (const m of document.querySelectorAll('meta[name], meta[property]')) {
    const k = m.getAttribute('name') || m.getAttribute('property');
    if (k === 'viewport') continue;              // formatting-only difference
    meta[k] = m.getAttribute('content');
  }
  return { text, tags, links, meta, dataEnds, iconHref, linkRels, title: document.title };
});

const shoot = async (url, view, file) => {
  const p = await browser.newPage();
  if (view.mobile) {
    await p.emulate({ name: 'iPhone 14', userAgent: view.ua,
      viewport: { width: view.width, height: view.height, deviceScaleFactor: view.dpr, isMobile: true, hasTouch: true } });
  } else {
    await p.setViewport({ width: view.width, height: view.height, deviceScaleFactor: 1 });
  }
  await p.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  const snap = await snapshot(p);
  await p.screenshot({ path: file, fullPage: true });
  await p.close();
  return snap;
};

// #4 (Copilot): two BLANK screenshots diff to zero pixels, so a total render
// failure - a font that never loaded, a crashed page, a capture taken before
// paint - reports as a perfect PASS. The pixel count alone cannot tell
// "identical" from "nothing there". Measure how much of the image is not the
// background, and require the pair to actually carry a page.
const inkRatio = (png) => {
  let ink = 0;
  const { data, width, height } = png;
  const bg = [data[0], data[1], data[2]];
  for (let i = 0; i < data.length; i += 4) {
    if (Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) > 24) ink++;
  }
  return +(ink / (width * height)).toFixed(4);
};

const diffPng = (a, b, out) => {
  const A = PNG.sync.read(fs.readFileSync(a));
  const B = PNG.sync.read(fs.readFileSync(b));
  if (A.width !== B.width || A.height !== B.height) {
    return { sizeMismatch: `${A.width}x${A.height} vs ${B.width}x${B.height}` };
  }
  const d = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, d.data, A.width, A.height, { threshold: 0.12 });
  if (n > 0) fs.writeFileSync(out, PNG.sync.write(d));
  return { diffPx: n, ink: Math.min(inkRatio(A), inkRatio(B)), total: A.width * A.height, pct: +((n / (A.width * A.height)) * 100).toFixed(3) };
};

const rows = [];
for (const [builtPath, livePath] of PAGES) {
  const row = { page: builtPath, views: {} };
  for (const v of VIEWS) {
    const slug = builtPath.replace(/[\/]/g, '_') || '_root';
    const fBuilt = path.join(OUT, `${slug}${v.name}-built.png`);
    const fLive = path.join(OUT, `${slug}${v.name}-live.png`);
    try {
      const sBuilt = await shoot(`http://localhost:${PORT}${builtPath}`, v, fBuilt);
      const sLive = await shoot(`${LIVE}${livePath}`, v, fLive);
      const px = diffPng(fBuilt, fLive, path.join(OUT, `${slug}${v.name}-DIFF.png`));
      row.views[v.name] = px;
      if (v.name === '1440') {
        row.dom = {
          titleSame: sBuilt.title === sLive.title,
          textSame: sBuilt.text === sLive.text,
          textLen: [sBuilt.text.length, sLive.text.length],
          tagsSame: sBuilt.tags.join(',') === sLive.tags.join(','),
          tagCount: [sBuilt.tags.length, sLive.tags.length],
          linksChanged: sBuilt.links.filter((h, i) => h !== sLive.links[i]).length,
          linksUnintended: unintendedLinkChanges(sBuilt.links, sLive.links),
          dataEndsSame: sBuilt.dataEnds.join(',') === sLive.dataEnds.join(','),
          dataEndsCount: [sBuilt.dataEnds.length, sLive.dataEnds.length],
          iconSame: normIcon(sBuilt.iconHref) === normIcon(sLive.iconHref),
          linkRelsSame: normLinks(sBuilt.linkRels) === normLinks(sLive.linkRels),
          canonical: (sBuilt.linkRels.find((r) => r.startsWith('canonical|')) ?? '').slice('canonical|'.length),
          ogUrlBuilt: sBuilt.meta['og:url'] ?? null,
        };
        const kb = Object.keys(sBuilt.meta), kl = Object.keys(sLive.meta);
        row.dom.metaAdded = kb.filter((k) => !kl.includes(k));
        row.dom.metaRemoved = kl.filter((k) => !kb.includes(k));
        row.dom.metaChanged = kb.filter((k) => kl.includes(k) && sBuilt.meta[k] !== sLive.meta[k]);
        if (!sBuilt.textSame && sBuilt.text !== sLive.text) {
          // find the first divergence, so a difference is inspectable
          let i = 0; while (i < sBuilt.text.length && sBuilt.text[i] === sLive.text[i]) i++;
          row.dom.firstTextDiff = { at: i, built: sBuilt.text.slice(i, i + 70), live: sLive.text.slice(i, i + 70) };
        }
      }
    } catch (e) { row.views[v.name] = { error: e.message.slice(0, 60) }; }
  }
  rows.push(row);
  const d = row.dom || {};
  console.log(`\n${builtPath}`);
  console.log(`   DOM   title:${d.titleSame ? 'same' : 'DIFFERS'}  text:${d.textSame ? 'same' : 'DIFFERS'} ${d.textLen?.join(' vs ')}  tags:${d.tagsSame ? 'same' : 'DIFFERS'} ${d.tagCount?.join(' vs ')}  links changed:${d.linksChanged}`);
  console.log(`   HEAD  meta added:${(d.metaAdded||[]).length ? d.metaAdded.join(',') : 'none'}  removed:${(d.metaRemoved||[]).length ? d.metaRemoved.join(',') : 'none'}  changed:${(d.metaChanged||[]).length ? d.metaChanged.join(',') : 'none'}`);
  for (const v of VIEWS) {
    const r = row.views[v.name] || {};
    console.log(`   ${v.name.padStart(4)}  ${r.error ? 'ERROR ' + r.error : r.sizeMismatch ? 'SIZE ' + r.sizeMismatch : `${r.diffPx} px differ (${r.pct}%)`}`);
  }
  if (d.firstTextDiff) {
    console.log(`   first text divergence at char ${d.firstTextDiff.at}:`);
    console.log(`      built: ${d.firstTextDiff.built}`);
    console.log(`      live : ${d.firstTextDiff.live}`);
  }
}

// #3 (Copilot): prove the OLD urls still resolve. Nothing tested them before -
// the harness compared built /dates/ against live /dates.html and never once
// requested the built /dates.html, so a missing stub would report clean.
console.log('\nlegacy URLs (the ones already shared in WhatsApp and mail):');
const legacyBad = [];
for (const u of LEGACY_URLS) {
  const res = await fetch(`http://localhost:${PORT}${u}`, { redirect: 'manual' });
  const ok = res.status === 200;
  const body = ok ? await res.text() : '';
  const m = body.match(/content=["']?0;s*url=([^"'>]+)/i);
  const dest = m ? m[1].trim() : null;
  const want = LEGACY_TARGET.get(u);
  const points = dest === want;
  console.log(`   ${u.padEnd(24)} ${res.status} ${points ? 'redirects to ' + dest : 'WRONG or MISSING target: ' + (dest ?? 'none') + ', expected ' + want}`);
  if (!ok || !points) legacyBad.push(u);
}

await browser.close();
server.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(rows, null, 2));
console.log(`\nshots and diffs: ${OUT}`);

// ---------------------------------------------------------------------------

// #2 (Copilot) BLOCKER: every difference was written to report.json and the
// process still exited 0, so this could never gate anything.
const bad = [];
for (const r of rows) {
  const d = r.dom ?? {};
  if (d.textSame === false) bad.push(`${r.page}: text differs`);
  const wantOg = EXPECTED_OG_URL.get(r.page);
  if (wantOg !== undefined && d.ogUrlBuilt !== wantOg) {
    bad.push(`${r.page}: og:url is ${d.ogUrlBuilt || "ABSENT"}, expected ${wantOg}`);
  }
  const wantCanon = EXPECTED_CANONICAL.get(r.page);
  if (wantCanon !== undefined && d.canonical !== wantCanon) {
    bad.push(`${r.page}: canonical is ${d.canonical || 'ABSENT'}, expected ${wantCanon}`);
  }
  if (d.titleSame === false) bad.push(`${r.page}: the page TITLE differs`);
  for (const c of (d.linksUnintended ?? [])) bad.push(`${r.page}: unintended link change - ${c}`);
  if (d.tagsSame === false) bad.push(`${r.page}: tag structure differs`);
  if (d.dataEndsSame === false) bad.push(`${r.page}: data-ends differ - the date-hiding layer`);
  if (d.iconSame === false) bad.push(`${r.page}: favicon differs`);
  if (d.linkRelsSame === false) bad.push(`${r.page}: <link> tags differ`);
  if ((d.metaAdded ?? []).length || (d.metaRemoved ?? []).length) bad.push(`${r.page}: head meta added or removed`);
  for (const [v, x] of Object.entries(r.views)) {
    if (x.error) bad.push(`${r.page} @${v}: ${x.error}`);
    if (x.sizeMismatch) bad.push(`${r.page} @${v}: size mismatch ${x.sizeMismatch}`);
    if (x.diffPx > 0) bad.push(`${r.page} @${v}: ${x.diffPx} pixels differ`);
    if (x.ink !== undefined && x.ink < 0.005) bad.push(`${r.page} @${v}: the capture is effectively BLANK (ink ${x.ink}) - a zero-pixel diff between two empty pages is not a pass`);
  }
}
for (const u of legacyBad) bad.push(`legacy URL ${u} does not resolve to a redirect stub`);

// og:url on /dates/ is the ONE intended head change - his ruling on unifying
// the URL shape. Anything else is a failure, not a note in a report.
// og:url on /dates/ is the ONE intended head change - his ruling on unifying the
// URL shape. It is checked against its exact expected value, never merely
// tolerated: an og:url naming another page would have passed the old allowance.
const INTENDED = new Set(['/dates/|og:url']);
for (const r of rows) {
  for (const k of (r.dom?.metaChanged ?? [])) {
    if (!INTENDED.has(`${r.page}|${k}`)) bad.push(`${r.page}: head meta ${k} changed`);
  }
}

if (bad.length) {
  console.error('\nFAILED - ' + bad.length + ' difference(s) that were not intended:');
  for (const b of bad) console.error('   ' + b);
  process.exit(1);
}
console.log('\nPASS - nothing differs except what was intended.');
