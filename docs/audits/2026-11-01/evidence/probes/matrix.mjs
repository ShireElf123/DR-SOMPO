import { chromium, devices } from '/home/user/DR-SOMPO/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
const dir = '/home/user/.cache/dr-sompo-full-audit';
mkdirSync(dir + '/screens', { recursive: true });
const routes = ['/', '/services', '/about', '/research', '/patient-info', '/contact', '/services/antenatal', '/services/delivery', '/services/general', '/services/oncology', '/services/fertility-assessment', '/services/laparoscopy'];
const widths = [320, 360, 390, 430, 640, 768, 1024, 1440];
const browser = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const jobs = routes.flatMap(path => widths.map(width => ({path, width})));
const results = [];
writeFileSync(dir + '/matrix.jsonl', '');
const inspect = () => {
  const r = e => { const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,right:b.right,bottom:b.bottom}; };
  const rendered = e => { for(let n=e;n;n=n.parentElement) { const s=getComputedStyle(n); if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0||n.getAttribute('aria-hidden')==='true') return false; } return true; };
  const text = e => e.innerText?.replace(/\s+/g,' ').trim().slice(0,150);
  const headings = [...document.querySelectorAll('main h1,main h2,main h3')].map(e=>{
    const box=r(e);const clips=[];
    for(let n=e.parentElement;n && n!==document.body;n=n.parentElement) {
      const s=getComputedStyle(n);if(!['hidden','clip','auto','scroll'].includes(s.overflowY)&&!['hidden','clip','auto','scroll'].includes(s.overflowX))continue;
      const c=r(n);
      const cut={top:Math.max(0,c.y-box.y),bottom:Math.max(0,box.bottom-c.bottom),left:Math.max(0,c.x-box.x),right:Math.max(0,box.right-c.right)};
      if(Object.values(cut).some(v=>v>2)) clips.push({tag:n.tagName,class:n.className,box:c,cut});
    }
    return {tag:e.tagName,text:text(e),box,rendered:rendered(e),clips};
  });
  const ids = new Map(); [...document.querySelectorAll('[id]')].forEach(e=>ids.set(e.id,(ids.get(e.id)||0)+1));
  const invalidRefs = [...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')].flatMap(e=>['aria-labelledby','aria-describedby','aria-controls'].flatMap(attr=>(e.getAttribute(attr)||'').split(/\s+/).filter(Boolean).filter(id=>!document.getElementById(id)).map(id=>({tag:e.tagName,id:e.id,attr,missing:id}))));
  const rootWidth=document.documentElement.clientWidth;
  const overflows=[...document.querySelectorAll('main a,main p,main h1,main h2,main h3,header a,header button')].filter(rendered).filter(e=>!e.closest('[class*="marquee"]')).map(e=>({tag:e.tagName,text:text(e),box:r(e)})).filter(e=>e.box.w && (e.box.x < -1 || e.box.right > rootWidth+1));
  const links=[...document.querySelectorAll('a[href]')].map(e=>({text:text(e),href:e.getAttribute('href')}));
  const jsonld=[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>{try{return JSON.parse(e.textContent)}catch{return {invalid:true}}});
  return {
    dimensions:{client:rootWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,inner:innerWidth,scale:visualViewport?.scale,height:document.documentElement.scrollHeight},
    title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,robots:[...document.querySelectorAll('meta[name=robots]')].map(e=>e.content),ogUrl:document.querySelector('meta[property="og:url"]')?.content,ogTitle:document.querySelector('meta[property="og:title"]')?.content,
    headings,overflows,invalidRefs,duplicateIds:[...ids].filter(([id,count])=>count>1),links,jsonld,
    inputs:[...document.querySelectorAll('input,select,textarea')].filter(rendered).map(e=>({id:e.id,type:e.type,font:getComputedStyle(e).fontSize,box:r(e)})),
    brokenImages:[...document.images].filter(e=>e.complete&&!e.naturalWidth).map(e=>({src:e.currentSrc||e.src,alt:e.alt})),
  };
};
async function worker() {
  for(let job; (job=jobs.shift());) {
    const {path,width}=job;
    const context=await browser.newContext(width<768 ? {...devices['iPhone 13'],viewport:{width,height:844},screen:{width,height:844}} : {viewport:{width,height:1000}});
    const page=await context.newPage();const errors=[],responses=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',res=>{if(res.status()>=400)responses.push({url:res.url(),status:res.status()})});
    await page.route('**/api/enquiry',route=>route.abort());
    try {
      const response=await page.goto('http://127.0.0.1:3010'+path,{waitUntil:'networkidle',timeout:30000});
      await page.evaluate(()=>document.fonts.ready);
      const initial=await page.evaluate(inspect);
      const label=(path==='/'?'home':path.slice(1).replaceAll('/','-'))+'-'+width;
      if(width===390 || width===1440 || initial.headings.some(h=>h.tag==='H1'&&h.clips.length)) await page.screenshot({path:dir+'/screens/'+label+'.png',scale:'css'});
      // Scroll the actual document to load lower-page content, not just its hero.
      const height=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<height;y+=1000) {await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(35);}
      await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
      await page.waitForTimeout(500);
      const end=await page.evaluate(inspect);
      const footerTargets=await page.evaluate(()=>[...document.querySelectorAll('footer a')].filter(e=>e.getBoundingClientRect().width).map(e=>{
        const b=e.getBoundingClientRect();const x=b.x+b.width/2,y=b.y+b.height/2;const hit=document.elementFromPoint(x,y);return {text:e.textContent.trim(),x,y,visible:y>=0&&y<=visualViewport.height,covered:hit&&!e.contains(hit)&&hit!==e,cover:hit?.outerHTML.slice(0,200)};
      }));
      const result={path,width,status:response.status(),errors,responses,initial,end,footerTargets};
      results.push(result);appendFileSync(dir+'/matrix.jsonl',JSON.stringify(result)+'\n');
      console.log(JSON.stringify({path,width,status:result.status,root:initial.dimensions.document,clippedHeadings:initial.headings.filter(h=>h.clips.length).map(h=>({text:h.text,cuts:h.clips.map(c=>c.cut)})),errors}));
    } catch(error) { const result={path,width,failure:error.message};results.push(result);appendFileSync(dir+'/matrix.jsonl',JSON.stringify(result)+'\n');console.log(JSON.stringify(result)); }
    await context.close();
  }
}
await Promise.all([worker(),worker()]);
writeFileSync(dir+'/matrix.json',JSON.stringify(results,null,2));
await browser.close();
