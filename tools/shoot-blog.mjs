import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import puppeteer from 'puppeteer-core';
const ROOT='C:/dev/guymalul-site/dist', OUT='C:/dev/guymalul-site/tools/proof';
const CHROME=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(p=>fs.existsSync(p));
const srv=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]);const f=path.join(ROOT,p);
 if(fs.existsSync(f)&&fs.statSync(f).isFile()){res.writeHead(200,{'content-type':f.endsWith('.css')?'text/css':f.endsWith('.xml')?'application/xml':'text/html; charset=utf-8'});return res.end(fs.readFileSync(f));}
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){if(!p.endsWith('/')){res.writeHead(301,{location:p+'/'});return res.end();}
  const i=path.join(f,'index.html'); if(fs.existsSync(i)){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});return res.end(fs.readFileSync(i));}}
 res.writeHead(404);res.end('404');});
await new Promise(r=>srv.listen(4466,r));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new'});
for(const [name,url,view] of [
  ['post-desktop','/blog/transcripts-that-work/',{w:1440,h:1000,m:false}],
  ['post-mobile','/blog/transcripts-that-work/',{w:390,h:900,m:true}],
  ['blogindex','/blog/',{w:1440,h:1000,m:false}],
]){
  const p=await b.newPage();
  if(view.m){await p.emulate({name:'iPhone 14',userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',viewport:{width:view.w,height:view.h,deviceScaleFactor:2,isMobile:true,hasTouch:true}});}
  else await p.setViewport({width:view.w,height:view.h});
  const resp = await p.goto('http://localhost:4466'+url,{waitUntil:'networkidle0'});
  // #6 (Copilot, round 2): this screenshotted a 404 successfully and said
  // nothing. A picture of an error page is worse than no picture - it gets
  // looked at and believed.
  if (!resp || resp.status() !== 200) {
    console.error('REFUSING to shoot ' + url + ' - HTTP ' + (resp ? resp.status() : 'no response') + '. Build with INCLUDE_DRAFTS=true if it is a draft.');
    process.exit(1);
  }
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:path.join(OUT,name+'.png')});
  const m=await p.evaluate(()=>{const px=e=>e?parseFloat(getComputedStyle(e).fontSize):null;
    const ps=[...document.querySelectorAll('.prose p')].filter(x=>x.textContent.trim().length>120);
    const bp=ps[0]; let cpl=null;
    if(bp){const r=document.createRange();r.selectNodeContents(bp);
      const tops=new Set([...r.getClientRects()].map(x=>Math.round(x.top)));
      cpl=tops.size?Math.round(bp.textContent.trim().length/tops.size):null;}
    const h1=document.querySelector('h1');
    return{h1:px(h1),body:bp?px(bp):null,col:bp?Math.round(bp.getBoundingClientRect().width):null,
      lh:bp?+(parseFloat(getComputedStyle(bp).lineHeight)/px(bp)).toFixed(2):null,cpl,
      overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1};});
  console.log(name.padEnd(14), JSON.stringify(m));
  await p.close();
}
await b.close(); srv.close();
