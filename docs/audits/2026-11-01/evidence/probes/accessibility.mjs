import { chromium, devices } from '/home/user/DR-SOMPO/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const dir='/home/user/.cache/dr-sompo-full-audit';
const axe=readFileSync('/home/user/.cache/dr-sompo-audit-tools/node_modules/axe-core/axe.min.js','utf8');
const browser=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const paths=['/','/services','/about','/research','/patient-info','/contact','/services/antenatal','/services/delivery','/services/general','/services/oncology','/services/fertility-assessment','/services/laparoscopy'];
const results=[];
for(const width of [390,1440]){
 const context=await browser.newContext(width===390?{...devices['iPhone 13'],viewport:{width,height:844}}:{viewport:{width,height:1000}});
 for(const path of paths){
  const page=await context.newPage();await page.goto('http://127.0.0.1:3010'+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(500);
  await page.addScriptTag({content:axe});
  const report=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']},resultTypes:['violations','incomplete']}));
  const result={path,width,violations:report.violations,incomplete:report.incomplete,testEngine:report.testEngine};
  results.push(result);writeFileSync(dir+'/accessibility.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify({path,width,violations:report.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length,examples:v.nodes.slice(0,3).map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:report.incomplete.map(v=>({id:v.id,count:v.nodes.length}))}));
  await page.close();
 }
 await context.close();
}
await browser.close();
