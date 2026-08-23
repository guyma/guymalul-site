// Every open decision, as a LIVE example on the real pages, for a phone.
//
//   node tools/make-decisions-preview.mjs        (run it after a build)
//
// His words: "אני צריך לראות הכל בדוגמאות". So nothing here is a mockup - each
// variant is dist/index.html or the real post with one thing changed, written
// into dist/preview/. Never touches src/. Regenerated on every run.
//
// Everything applied here was MEASURED on 22.8 at 390px, and the numbers are
// in knowledge/research/hebrew-web-study.md section 8.

import fs from 'node:fs';
import path from 'node:path';

const HOME = 'dist/index.html';
const POST = 'dist/blog/transcripts-that-work/index.html';
for (const f of [HOME, POST]) {
  if (!fs.existsSync(f)) { console.error(f + ' is missing. Build with INCLUDE_DRAFTS=true first.'); process.exit(1); }
}
const home = fs.readFileSync(HOME, 'utf8');
const post = fs.readFileSync(POST, 'utf8');

const NOINDEX = '<meta name="robots" content="noindex">';

// ── the shared chrome, from the measurement ────────────────────────────────
// burger RIGHT: ynet, calcalist, mako, avilevi and tom even all put it there.
// 5 of 5. The theoretical "mirror the LTR convention" rule would put it left
// and describes nothing the Hebrew field actually does.
const CHROME_CSS = `
body{padding-top:64px}
.pv-bar{position:fixed;top:0;left:0;right:0;z-index:900;background:#fff;border-bottom:1px solid #eee6e3;
  display:flex;align-items:center;gap:12px;padding:0 16px;height:64px;font-family:Rubik,Arial,sans-serif}
.pv-brand{font-weight:700;color:#2b1f1c;font-size:16px;text-decoration:none;white-space:nowrap}
.pv-spacer{flex:1}
.pv-cta{background:#d4654e;color:#fff;text-decoration:none;font-weight:500;font-size:14px;
  padding:8px 15px;border-radius:999px;white-space:nowrap}
.pv-burger{width:38px;height:38px;border:1px solid #eee6e3;border-radius:10px;background:#fff;
  display:grid;place-items:center;cursor:pointer;padding:0;flex:none}
.pv-burger span{display:block;width:18px;height:2px;background:#2b1f1c;border-radius:2px;
  box-shadow:0 -6px 0 #2b1f1c,0 6px 0 #2b1f1c}
.pv-drawer{display:none;position:fixed;top:64px;left:0;right:0;z-index:899;background:#fff;
  border-bottom:1px solid #eee6e3;padding:8px 16px 16px;font-family:Rubik,Arial,sans-serif}
.pv-drawer.open{display:block}
.pv-drawer a{display:block;padding:12px 0;color:#2b1f1c;text-decoration:none;font-size:16px;
  border-bottom:1px solid #f7f2f0}
.pv-drawer a:last-child{border-bottom:0}
.pv-foot{background:#fef0ec;padding:28px 20px 34px;font-family:Rubik,Arial,sans-serif;
  color:#6b5a55;font-size:14px;line-height:2}
.pv-foot .pv-name{color:#2b1f1c;font-weight:700;font-size:16px;display:block;margin-bottom:8px}
.pv-foot a{color:#a84634;text-decoration:none}
.pv-foot .pv-links{display:flex;flex-wrap:wrap;gap:6px 18px}
.pv-tag{position:fixed;top:74px;inset-inline-end:10px;z-index:999;background:rgba(43,31,28,.92);
  color:#fff;font-family:Rubik,Arial,sans-serif;font-size:12px;font-weight:500;
  padding:7px 13px;border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25);
  white-space:nowrap}`;

const GLASS_CSS = `
.pv-bar{background:rgba(255,255,255,.72);
  -webkit-backdrop-filter:saturate(180%) blur(14px);backdrop-filter:saturate(180%) blur(14px);
  border-bottom:1px solid rgba(43,31,28,.10)}`;


const BAR = `
<div class="pv-bar">
  <button class="pv-burger" aria-label="תפריט"><span></span></button>
  <span class="pv-spacer"></span>
  <a class="pv-cta" href="/dates/">להצטרף לסדנה</a>
  <a class="pv-brand" href="/">העובד הראשון שלך</a>
</div>
<nav class="pv-drawer">
  <a href="/blog/">הבלוג</a><a href="/dates/">מועדי סדנאות</a>
  <a href="/#faq">שאלות נפוצות</a><a href="mailto:guy@guymalul.co.il">צור קשר</a>
</nav>`;

const FOOT = `
<footer class="pv-foot">
  <span class="pv-name">גיא מלול</span>
  <div class="pv-links">
    <a href="/blog/">הבלוג</a><a href="/dates/">מועדי סדנאות</a>
    <a href="mailto:guy@guymalul.co.il">guy@guymalul.co.il</a>
    <a href="https://www.linkedin.com/in/guymalul/">LinkedIn</a>
    <a href="/accessibility/">הצהרת נגישות</a>
  </div>
</footer>`;

const BURGER_JS = `<script>document.addEventListener('click',function(e){
  if(e.target.closest('.pv-burger')) document.querySelector('.pv-drawer').classList.toggle('open');});</script>`;


// ── DECISION: how the post gets richer ─────────────────────────────────────
// Measured 23.8. Our post already carries 9 h2 sections - MORE than Tom Even's
// 7 - so the gap is not structure at the section level. It is:
//   vs Tom (7 h2 · 7 lists · 2 quotes · 0 images) -> we have 1 list
//   vs Avi (8 images · 10 lists · 5 quotes)       -> we have 1 image, 1 list
// And 54 paragraphs is the density problem: Tom breaks his up with lists.
//
// Both variants below are built from the post's OWN content - the three
// questions are its own h2s, the closing steps are its own sentences. Nothing
// here is invented copy; the real wording is the copywriter's job.

const RICH_CSS_TOM = `
article p{font-size:19px !important;line-height:1.92 !important}
.rich-list{background:#fef0ec;border-radius:14px;padding:20px 22px;margin:26px 0;
  font-family:Rubik,Arial,sans-serif}
.rich-list .k{color:#a84634;font-size:13px;font-weight:600;margin:0 0 10px;letter-spacing:.03em}
.rich-list ol{margin:0;padding-inline-start:1.2rem;color:#2b1f1c;font-size:17px;line-height:1.75}
.rich-list ol li{margin-bottom:8px}
.rich-list ol li:last-child{margin-bottom:0}
.rich-pull{border-inline-start:3px solid #d4654e;padding:4px 18px;margin:30px 0;
  font-family:Rubik,Arial,sans-serif;font-size:20px;line-height:1.55;color:#2b1f1c;font-weight:500}
.rich-note{background:#2b1f1c;color:#fff;border-radius:10px;padding:9px 13px;margin:22px 0;
  font-family:Rubik,Arial,sans-serif;font-size:12.5px;line-height:1.5}`;

const RICH_CSS_AVI = `
.rich-shot{margin:30px 0;font-family:Rubik,Arial,sans-serif}
.rich-shot .frame{border:2px dashed #f0c4b8;border-radius:14px;background:#fdf7f5;
  aspect-ratio:16/10;display:grid;place-items:center;text-align:center;padding:18px}
.rich-shot .frame span{color:#a84634;font-size:13.5px;font-weight:600;line-height:1.5;max-width:24em}
.rich-shot .cap{color:#7d6e69;font-size:13px;margin:8px 2px 0;line-height:1.55}
.rich-list{background:#fef0ec;border-radius:14px;padding:20px 22px;margin:26px 0;
  font-family:Rubik,Arial,sans-serif}
.rich-list .k{color:#a84634;font-size:13px;font-weight:600;margin:0 0 10px}
.rich-list ol{margin:0;padding-inline-start:1.2rem;color:#2b1f1c;font-size:17px;line-height:1.75}
.rich-list ol li{margin-bottom:8px}
.rich-note{background:#2b1f1c;color:#fff;border-radius:10px;padding:9px 13px;margin:22px 0;
  font-family:Rubik,Arial,sans-serif;font-size:12.5px;line-height:1.5}`;

// the three questions ARE the post's own h2s - this is a summary, not new copy
const THREE = `
<div class="rich-list">
  <p class="k">שלוש השאלות, לפני שמבקשים משהו</p>
  <ol>
    <li>מה השיחה הזאת בכלל</li>
    <li>מה אתה רוצה לקחת ממנה</li>
    <li>איך תדע שיצא טוב</li>
  </ol>
</div>`;

const NOTE = (t) => `<div class="rich-note">${t}</div>`;

// pulled verbatim from the post's own text
const PULL = `<p class="rich-pull">ישיבת עבודה משאירה החלטות. שיחה כזאת משאירה הבנה, ושפה.</p>`;

const SHOT = (what, cap) => `
<figure class="rich-shot">
  <div class="frame"><span>${what}</span></div>
  <figcaption class="cap">${cap}</figcaption>
</figure>`;

function enrich(html, mode) {
  const css = mode === 'tom' ? RICH_CSS_TOM : RICH_CSS_AVI;
  let out = html;

  // put the summary list after the first h2, where a reader is deciding whether to stay
  const h2s = [...out.matchAll(/<\/h2>/g)].map((m) => m.index + m[0].length);
  if (h2s.length) {
    const note = NOTE(mode === 'tom'
      ? 'הצעה בדרך של תום: מבנה. רשימת סיכום, ציטוטים שנשלפים, שורה אווירית יותר. אפס תמונות.'
      : 'הצעה בדרך של אבי: תמונות. המסגרות המקווקוות הן מקומות — כל אחת אומרת מה תראה.');
    out = out.slice(0, h2s[0]) + note + THREE + out.slice(h2s[0]);
  }

  if (mode === 'tom') {
    // one more pull quote, from a sentence the post already has
    const marks = [...out.matchAll(/<\/h2>/g)].map((m) => m.index + m[0].length);
    if (marks[4]) out = out.slice(0, marks[4]) + PULL + out.slice(marks[4]);
  } else {
    // an image at every second section boundary, each one named
    const SHOTS = [
      ['צילום מסך של השיחה בקבוצה — השאלה כפי שנשאלה', 'הרגע שממנו הפוסט התחיל.'],
      ['צילום מסך: התמלול הגולמי, לפני שנגעו בו', 'זה מה שיוצא מהכלי. אף אחד לא יכול לעבוד עם זה.'],
      ['צילום מסך: אותה בקשה בלי פירוט, והתשובה שקיבל', 'למה זה נכשל — בתמונה, לא בהסבר.'],
      ['צילום מסך: הבקשה אחרי שלוש השאלות', 'אותו תמלול, בקשה אחרת, תוצאה אחרת.'],
    ];
    const marks = [...out.matchAll(/<\/h2>/g)].map((m) => m.index + m[0].length);
    for (let i = SHOTS.length - 1; i >= 0; i--) {
      const at = marks[(i + 1) * 2];
      if (at) out = out.slice(0, at) + SHOT(SHOTS[i][0], SHOTS[i][1]) + out.slice(at);
    }
  }
  return out.replace('</head>', '<style>' + css + '</style></head>');
}

// ── build one variant page ─────────────────────────────────────────────────
const TAG = (label) => `<a class="pv-tag" href="/preview/">${label} — לחזרה</a>`;

function make(base, { css = '', headExtra = '', bar = true, foot = true, body = '', tag }) {
  let out = base;
  if (bar) {
    out = out.replace(/<header[\s\S]*?<\/header>/i, '');
    out = out.replace(/<body([^>]*)>/i, (m) => m + BAR);
  }
  if (foot) out = out.replace(/<footer[\s\S]*?<\/footer>/i, '');
  out = out.replace('</body>', body + (foot ? FOOT : '') + TAG(tag) + BURGER_JS + '</body>');
  out = out.replace('</head>', NOINDEX + '<style>' + CHROME_CSS + css + '</style>' + headExtra + '</head>');
  return out;
}

const write = (slug, html) => {
  const dir = path.join('dist', 'preview', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
};

// ── the variants ───────────────────────────────────────────────────────────
const H1 = (px) => `<style>main h1{font-size:${px}px !important;line-height:1.14 !important}</style>`;

// The "block on the home page" he asked about: one section in the BODY of the
// landing page, showing the newest post, so a reader who is interested but not
// ready to buy has somewhere to go instead of leaving. Both avilevi and Tom Even
// surface their writing from the home page this way.
const BLOG_BLOCK = `
<section class="pv-blogwrap">
  <p class="pv-blogkick">מהבלוג</p>
  <a class="pv-card" href="/blog/transcripts-that-work/">
    <span class="pv-card__shot"><span>תמונת הפוסט — 356×200<br>אין לנו אחת עדיין</span></span>
    <span class="pv-card__body">
      <span class="pv-card__t">תמלול, סיכום שיחה, הקלטה: איך מוציאים מהם משהו שימושי</span>
      <span class="pv-card__d">יום אחרי הסדנה, אחד החברים בקבוצה שאל שאלה טובה. עניתי לו, ובגדול התשובה היא גם וגם.</span>
      <span class="pv-card__m">21 באוגוסט 2026 · 7 דקות קריאה</span>
    </span>
  </a>
  <a class="pv-blogall" href="/blog/">לכל הפוסטים ←</a>
</section>`;
const BLOG_BLOCK_CSS = `
.pv-blogwrap{padding:36px 16px 40px;font-family:Rubik,Arial,sans-serif;background:#fff}
.pv-blogkick{display:flex;align-items:center;gap:10px;color:#a84634;font-weight:500;
  font-size:14px;margin:0 0 14px}
.pv-blogkick::before{content:"";width:26px;height:3px;background:#d4654e;border-radius:2px;flex:none}
.pv-card{display:block;text-decoration:none;background:rgba(212,101,78,.04);
  border:1px solid rgba(212,101,78,.12);border-radius:16px;overflow:hidden;padding:0}
.pv-card__shot{display:grid;place-items:center;height:200px;background:#fdf7f5;
  border-bottom:1px solid rgba(212,101,78,.10);text-align:center;padding:16px}
.pv-card__shot span{color:#a84634;font-size:13px;font-weight:600;line-height:1.5}
.pv-card__body{display:block;padding:16px 18px 18px}
.pv-card__t{display:block;color:#2b1f1c;font-size:18px;font-weight:700;line-height:1.35;margin-bottom:8px}
.pv-card__d{display:block;color:#6b5a55;font-size:15px;line-height:1.65;margin-bottom:10px}
.pv-card__m{display:block;color:#7d6e69;font-size:13px}
.pv-blogall{display:inline-block;margin-top:16px;color:#a84634;font-weight:600;
  font-size:15px;text-decoration:none}`;

const PAGES = [
  ['chrome-on',  make(home, { tag: 'מסגרת מלאה' })],
  ['chrome-off', make(home, { tag: 'בלי הדר', bar: false, foot: false })],
  ['chrome-glass', make(home, { tag: 'הדר שקוף', css: GLASS_CSS })],

  ['h1-43',      make(home, { tag: 'h1 = 43px (היום)', headExtra: H1(43) })],
  ['h1-36',      make(home, { tag: 'h1 = 36px (תום אבן)', headExtra: H1(36) })],
  ['h1-28',      make(home, { tag: 'h1 = 28px', headExtra: H1(28) })],


  ['post-plain', make(post, { tag: 'הפוסט כמו שהוא' })],
  ['post-tom',   enrich(make(post, { tag: 'עשיר בדרך של תום' }), 'tom')],
  ['post-avi',   enrich(make(post, { tag: 'עשיר בדרך של אבי' }), 'avi')],
  ['block-on',   make(home, { tag: 'עם בלוק בלוג בעמוד הבית', css: BLOG_BLOCK_CSS, body: BLOG_BLOCK })],
  ['block-off',  make(home, { tag: 'בלי בלוק' })],
];
for (const [slug, html] of PAGES) { write(slug, html); console.log('  /preview/' + slug + '/'); }

// ── the gallery ────────────────────────────────────────────────────────────
const GROUPS = [
  { n: 1, title: 'המסגרת', sub: 'כותרת עם המבורגר ופוטר אחיד',
    why: 'לבן על לבן — רואים טיפה את הטקסט מאחורה כשגוללים. הכרעתך 23.8. ההמבורגר בימין אצל 5 מתוך 5 שמדדתי.',
    opts: [['chrome-glass', 'לבן שקוף', 'הכרעתך'], ['chrome-on', 'לבן מלא', ''], ['chrome-off', 'בלי — כמו היום', '']] },
    { n: 3, title: 'גודל הכותרת', sub: 'מה שמאריך לך את העמוד',
    why: 'שלך 43px. תום אבן 36. אבי לוי 24. העמוד שלך 10,234px, שלו 6,573.',
    opts: [['h1-43', '43px — היום', ''], ['h1-36', '36px', 'המלצה'], ['h1-28', '28px', '']] },
  { n: 5, title: 'הפוסט', sub: 'אותה שאלה, על עמוד הכתבה',
    why: 'לפוסט שלך כבר 9 כותרות משנה — יותר מתום. הפער הוא רשימות (1 מול 7 אצלו) ותמונות (1 מול 8 אצל אבי). ו-54 פסקאות זו הצפיפות: תום שובר אותן ברשימות.',
    opts: [['post-tom', 'בדרך של תום', ''], ['post-avi', 'בדרך של אבי', ''], ['post-plain', 'כמו שהוא היום', '']] },
  { n: 5, title: 'הקישור לבלוג מעמוד הבית', sub: 'מה שקראתי לו "בלוק"',
    why: 'בלוק אחד בגוף עמוד הבית שמראה את הפוסט האחרון — למי שהתעניין ועוד לא מוכן לקנות, שיהיה לאן ללכת במקום לצאת. גם אבי וגם תום מציפים את הכתיבה שלהם מעמוד הבית.',
    opts: [['block-on', 'עם בלוק', ''], ['block-off', 'רק בפוטר', '']] },
];

const gallery = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>הדוגמאות</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
body{margin:0;background:#fff;color:#6b5a55;font-family:Rubik,Arial,sans-serif;font-size:16px;line-height:1.7}
.w{max-width:34rem;margin:0 auto;padding:28px 18px 64px}
h1{color:#2b1f1c;font-size:27px;line-height:1.2;margin:0 0 6px;font-weight:700}
.lede{margin:0 0 26px;font-size:15px}
.g{border-top:1px solid #eee6e3;padding-top:20px;margin-top:24px}
.g h2{color:#2b1f1c;font-size:19px;margin:0 0 2px;font-weight:700}
.g h2 .n{color:#a84634;font-variant-numeric:tabular-nums}
.g .sub{color:#7d6e69;font-size:13.5px;margin:0 0 8px}
.g .why{background:#fef0ec;border-radius:11px;padding:11px 13px;font-size:13.5px;margin:0 0 12px;line-height:1.6}
.opts{display:flex;flex-wrap:wrap;gap:8px}
.opts a{flex:1 1 44%;display:block;text-decoration:none;border:1px solid #eee6e3;border-radius:12px;
  padding:13px 14px;background:#fff;color:#2b1f1c;font-weight:600;font-size:15px}
.opts a.rec{border-color:#d4654e;border-width:2px}
.opts a .pill{display:inline-block;margin-top:5px;border:1px solid #d4654e;border-radius:999px;
  color:#a84634;font-size:11.5px;font-weight:600;padding:1px 8px}
.tip{background:#2b1f1c;color:#fff;border-radius:12px;padding:13px 15px;font-size:13.5px;margin:22px 0 0;line-height:1.6}
</style></head><body><div class="w">
<h1>הדוגמאות</h1>
<p class="lede">כל החלטה על העמוד האמיתי שלך, לא מוקאפ. בכל דוגמה יש כפתור בפינה שמחזיר לכאן.</p>
${GROUPS.map((g) => `
<div class="g">
  <h2><span class="n">${g.n}.</span> ${g.title}</h2>
  <p class="sub">${g.sub}</p>
  <div class="why">${g.why}</div>
  <div class="opts">${g.opts.map(([slug, label, rec]) => `
    <a class="${rec ? 'rec' : ''}" href="/preview/${slug}/">${label}${rec ? `<br><span class="pill">${rec}</span>` : ''}</a>`).join('')}
  </div>
</div>`).join('')}
<div class="tip">גלול לעומק בכל דוגמה — האנימציה והצ׳אבי מופיעים רק כשמגיעים אליהם, בדיוק כמו אצלו.</div>
</div></body></html>`;
fs.mkdirSync('dist/preview', { recursive: true });
fs.writeFileSync('dist/preview/index.html', gallery);
console.log('  /preview/     the gallery, ' + GROUPS.length + ' decisions');
