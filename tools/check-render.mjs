import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import puppeteer from 'puppeteer-core';
const ROOT='C:/dev/guymalul-site/dist';
const CHROME=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(p=>fs.existsSync(p));
const srv=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]);const f=path.join(ROOT,p);
 if(fs.existsSync(f)&&fs.statSync(f).isFile()){res.writeHead(200,{'content-type':f.endsWith('.css')?'text/css':'text/html; charset=utf-8'});return res.end(fs.readFileSync(f));}
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){if(!p.endsWith('/')){res.writeHead(301,{location:p+'/'});return res.end();}
  const i=path.join(f,'index.html'); if(fs.existsSync(i)){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});return res.end(fs.readFileSync(i));}}
 res.writeHead(404);res.end('404');});
await new Promise(r=>srv.listen(4477,r));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new'});
const missing = [];
const broken = [];
console.log('page                          body font              h1 font                bodyMargin  overflowX  sticky?');
// EVERY route. The first version of this file loaded five pages and NONE of
// the three that actually carry a sticky bar (/prework/, the questionnaire,
// /thanks/) - so it reported "STICKS" about pages with a different element
// entirely. Measuring the wrong page is worse than not measuring.
const REQUIRED = ['/','/dates/','/accessibility/','/prework/','/prework/questionnaire/','/thanks/','/blog/'];
// present only when the build included drafts. Measured if there, never demanded.
const OPTIONAL = ['/blog/transcripts-that-work/'];
for(const u of [...REQUIRED, ...OPTIONAL]){
  const p=await b.newPage(); await p.setViewport({width:390,height:844});
  const resp = await p.goto('http://localhost:4477'+u,{waitUntil:'networkidle0'});
  if (!resp || resp.status() !== 200) {
    console.log(u.padEnd(30) + (REQUIRED.includes(u)?'MISSING - HTTP ':'absent (draft, not built) - HTTP ') + (resp ? resp.status() : 'no response') + '. Not a styling result; the page is not in this build.');
    if(REQUIRED.includes(u)) missing.push(u + ' (HTTP ' + (resp ? resp.status() : 'none') + ')');
    await p.close();
    continue;
  }
  await p.evaluate(()=>document.fonts.ready);
  const r=await p.evaluate(async()=>{
    const cs=getComputedStyle(document.body);
    const h1=document.querySelector('h1');
    const sticky=[...document.querySelectorAll('*')].filter(e=>['sticky','fixed'].includes(getComputedStyle(e).position));
    let stuck='n/a';
    if(sticky.length){const el=sticky[0];const before=el.getBoundingClientRect().top;
      window.scrollTo(0,1200); await new Promise(r=>requestAnimationFrame(r));
      const after=el.getBoundingClientRect().top;
      stuck = Math.abs(after-before)<5 ? 'STICKS' : 'DOES NOT ('+Math.round(before)+'->'+Math.round(after)+')';}
    return{font:cs.fontFamily.split(',')[0], h1font:h1?getComputedStyle(h1).fontFamily.split(',')[0]:'-',
      margin:cs.margin, ox:getComputedStyle(document.documentElement).overflowX+'/'+cs.overflowX, stuck};
  });
  console.log(u.padEnd(30)+r.font.padEnd(22)+r.h1font.padEnd(23)+r.margin.padEnd(12)+r.ox.padEnd(11)+r.stuck);

// #6 (Copilot, round 2): this tool MEASURED the defects and never failed on
// them. A 200 page rendering in Times New Roman with an 8px body margin - the
// exact defect it exists to catch, and one that actually shipped on /blog/ -
// still exited 0. A diagnostic nobody reads is a diagnostic nobody runs.
//
// The sticky column is deliberately NOT gated: three pages genuinely do not
// stick, that matches the live site, and it is measured for the record only.
if (r.font !== 'Rubik') broken.push(u + ' body font is ' + r.font + ', expected Rubik - the page is not getting the site CSS');
if (r.h1font !== '-' && r.h1font !== 'Rubik') broken.push(u + ' h1 font is ' + r.h1font + ', expected Rubik');
if (r.margin !== '0px') broken.push(u + ' body margin is ' + r.margin + ', expected 0px - the reset is missing');
  await p.close();
}
await b.close(); srv.close();


if (broken.length) {
  console.error('');
  console.error(broken.length + ' page(s) render WRONG:');
  for (const x of broken) console.error('   - ' + x);
}

if (missing.length) {
  console.error('');
  console.error(missing.length + ' page(s) could not be measured because they are not in this build:');
  for (const m of missing) console.error('   - ' + m);
  console.error('Build with INCLUDE_DRAFTS=true if these are drafts. A 404 renders in');
  console.error('Times New Roman with an 8px body margin - indistinguishable from the very');
  console.error('defect this tool hunts, and it reported one as the other.');
  process.exit(1);
}


if (broken.length) process.exit(1);