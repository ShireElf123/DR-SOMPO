import { chromium, devices } from '/home/user/DR-SOMPO/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const dir='/home/user/.cache/dr-sompo-full-audit';
const browser=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
const phone={...devices['iPhone 13'],viewport:{width:390,height:844}};
const goto=async(page,path)=>{await page.goto('http://127.0.0.1:3010'+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)};
const fill=async page=>{
 await page.locator('#enq-name').fill('Audit Test');
 await page.locator('main form').getByText('Email',{exact:true}).click();
 await page.locator('#enq-contact').fill('audit@example.invalid');
 await page.locator('input[name="consent"]').check();
};
const state=page=>page.evaluate(()=>({url:location.href,sy:scrollY,x:scrollX,width:document.documentElement.scrollWidth,active:document.activeElement?.outerHTML.slice(0,250)}));
async function run(name,options,fn){
 const context=await browser.newContext(options);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/enquiry',r=>r.fulfill({status:503,json:{ok:false,error:'Audit: no delivery attempted.'}}));
 try{const detail=await fn(page,context);results.push({name,detail,errors});console.log(JSON.stringify({name,detail,errors}));}
 catch(error){results.push({name,failure:error.message,errors});console.log(JSON.stringify({name,failure:error.message,errors}));}
 await context.close();writeFileSync(dir+'/interactions.json',JSON.stringify(results,null,2));
}
await run('services-overview-prefill',phone,async page=>{
 await goto(page,'/services');
 await page.locator('#obstetrics').getByRole('link',{name:'Enquire about this'}).click();await page.waitForURL('**/contact?service=antenatal');
 await page.locator('#enq-service').waitFor();
 const before=await page.locator('#enq-service').evaluate(e=>({value:e.value,selected:e.selectedOptions[0]?.textContent,options:[...e.options].map(o=>o.value)}));
 let payload;await page.route('**/api/enquiry',async r=>{payload=r.request().postDataJSON();await r.fulfill({status:503,json:{ok:false,error:'Audit only'}})});
 await fill(page);await page.locator('button[type=submit]').click();await page.locator('main [role=alert]').waitFor();
 return {url:page.url(),displayed:before,postedService:payload?.service};
});
await run('detail-page-prefill',phone,async page=>{
 await goto(page,'/services/antenatal');await page.getByRole('link',{name:'Request this appointment',exact:true}).click();await page.waitForURL('**/contact?service=*');
 return await page.locator('#enq-service').evaluate(e=>({value:e.value,selected:e.selectedOptions[0]?.textContent}));
});
for(const desktop of [false,true])await run('back-restoration-'+(desktop?'desktop':'phone'),desktop?{viewport:{width:1440,height:1000}}:phone,async page=>{
 await goto(page,'/services');const link=page.locator('#surgery').getByRole('link',{name:'Full details',exact:true});await link.scrollIntoViewIfNeeded();await page.waitForTimeout(500);const before=await state(page);await link.click();await page.waitForURL('**/services/laparoscopy');await page.waitForTimeout(1200);await page.goBack();await page.waitForURL('**/services');await page.waitForTimeout(1300);return {before,after:await state(page)};
});
await run('home-faq-plus-is-inert',phone,async page=>{
 await goto(page,'/');const section=page.locator('section[aria-labelledby="faq-teaser-heading"]');const plus=section.locator('li span').filter({hasText:/^\+$/}).first();await plus.scrollIntoViewIfNeeded();
 const before={url:page.url(),text:await section.innerText(),expanded:await section.locator('[aria-expanded]').count()};await plus.click();await page.waitForTimeout(600);const after={url:page.url(),text:await section.innerText(),expanded:await section.locator('[aria-expanded]').count()};
 await page.screenshot({path:dir+'/screens/home-faq-inert.png',scale:'css'});return {unchanged:before.text===after.text && before.url===after.url,before,after};
});
await run('sticky-book-reloads-and-clears-form',phone,async page=>{
 await goto(page,'/contact');await page.locator('#enq-name').fill('Audit Test');await page.locator('#enq-message').fill('Non-clinical audit note');await page.locator('#enq-message').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const before=await state(page);let documentRequests=0;page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())documentRequests++});
 await page.locator('a[href="/contact"]').filter({has:page.locator('span.sr-only')}).click();await page.waitForLoadState('networkidle');await page.waitForTimeout(600);
 return {before,after:await state(page),name:await page.locator('#enq-name').inputValue(),message:await page.locator('#enq-message').inputValue(),documentRequests};
});
await run('validation-error-offscreen',phone,async page=>{
 await goto(page,'/contact');await fill(page);await page.locator('#enq-name').fill('A');await page.locator('button[type=submit]').click();await page.waitForTimeout(500);
 const error=await page.locator('#enq-name-error').boundingBox();return {state:await state(page),error,errorVisible: error.y>=0&&error.y+error.height<=844,alerts:await page.locator('main [role=alert]').count()};
});
await run('server-date-error-not-rendered',phone,async page=>{
 await goto(page,'/contact');await fill(page);await page.route('**/api/enquiry',r=>r.fulfill({status:422,json:{ok:false,errors:{preferredDate:'AUDIT DATE ERROR: please choose a current date.'}}}));
 await page.locator('button[type=submit]').click();await page.locator('main [role=alert]').waitFor();
 return {dateErrorDisplayed:await page.getByText('AUDIT DATE ERROR: please choose a current date.',{exact:true}).count(),alert:await page.locator('main [role=alert]').innerText()};
});
await run('no-js-native-submit-uses-get',{...phone,javaScriptEnabled:false},async page=>{
 await goto(page,'/contact');await page.locator('#enq-name').fill('Audit Privacy Test');await page.locator('#enq-contact').fill('0000000000');await page.locator('#enq-message').fill('Synthetic non-clinical audit note');await page.locator('input[name=consent]').check();
 let request;page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())request={method:r.method(),url:r.url()}});
 await page.locator('button[type=submit]').click();await page.waitForURL('**/contact?*');return {request,url:page.url(),form:await page.locator('form').evaluate(f=>({method:f.method,action:f.action}))};
});
await run('international-timezone-calendar',{...phone,timezoneId:'Pacific/Auckland'},async page=>{
 await goto(page,'/contact');return await page.evaluate(()=>({now:new Date().toString(),tz:Intl.DateTimeFormat().resolvedOptions().timeZone,days:[...document.querySelectorAll('form fieldset:first-of-type button')].map(e=>e.innerText)}));
});
await run('faq-accessibility-collapsed-panels',phone,async(page,context)=>{
 await goto(page,'/patient-info');await page.locator('#faqs').scrollIntoViewIfNeeded();await page.waitForTimeout(800);
 const ax=await page.locator('#faqs').ariaSnapshot();writeFileSync(dir+'/faq-accessibility.txt',ax);
 const before=await page.locator('#faq-button-1').getAttribute('aria-expanded');const panelBox=await page.locator('#faq-panel-1').boundingBox();const panelOpacity=await page.locator('#faq-panel-1').evaluate(e=>getComputedStyle(e).opacity);
 await page.locator('#faq-button-1').click();await page.waitForTimeout(650);
 return {initiallyExpanded:before,collapsedPanelBox:panelBox,panelOpacity,collapsedAnswerInAX:ax.includes('Please bring your ID or passport'),afterExpanded:await page.locator('#faq-button-1').getAttribute('aria-expanded'),afterHeight:(await page.locator('#faq-panel-1').boundingBox()).height};
});
await run('live-reduced-motion-cursor',{viewport:{width:1440,height:1000}},async page=>{
 await goto(page,'/');await page.mouse.move(400,200);await page.waitForTimeout(400);
 const cursor=page.locator('body > div[aria-hidden="true"]').filter({has:page.locator('[class*="transition-[width"]')});
 const before=await cursor.locator('div').first().evaluate(e=>({opacity:getComputedStyle(e).opacity,transform:e.style.transform}));await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(900,500);await page.waitForTimeout(700);
 const after=await cursor.locator('div').first().evaluate(e=>({opacity:getComputedStyle(e).opacity,transform:e.style.transform}));return {before,after,lenis:await page.locator('html').getAttribute('class')};
});
await run('anchor-navigation',phone,async page=>{
 await goto(page,'/services');await page.getByRole('link',{name:'Minimally invasive & open surgery',exact:true}).first().click();await page.waitForTimeout(1200);const services=await page.locator('#surgery').boundingBox();
 await goto(page,'/services/laparoscopy');await page.locator('a[href="#section-2"]').click();await page.waitForTimeout(1200);return {servicesTarget:services,detailTarget:await page.locator('#section-2').boundingBox(),url:page.url()};
});
await run('mobile-menu-landscape-resize',phone,async page=>{
 await goto(page,'/');await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(600);await page.setViewportSize({width:844,height:390});
 const dialog=page.getByRole('dialog');await page.waitForTimeout(250);const box=await dialog.boundingBox();await dialog.getByRole('link',{name:'Contact',exact:true}).click();await page.waitForURL('**/contact');await page.waitForTimeout(1000);
 return {dialogBox:box,menuClosed:await page.getByRole('dialog').count()===0,bodyOverflow:await page.locator('body').evaluate(e=>getComputedStyle(e).overflow),url:page.url()};
});
await run('404-response',{viewport:{width:1440,height:1000}},async page=>{
 const response=await page.goto('http://127.0.0.1:3010/this-page-does-not-exist',{waitUntil:'networkidle'});return {status:response.status(),title:await page.title(),heading:await page.locator('h1').innerText(),robots:await page.locator('meta[name=robots]').evaluateAll(els=>els.map(e=>e.content))};
});
await browser.close();
