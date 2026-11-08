import { createRequire, stripTypeScriptTypes } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const require=createRequire('/home/user/DR-SOMPO/package.json');
const source=readFileSync('/home/user/DR-SOMPO/app/api/enquiry/route.ts','utf8');
const compiled=stripTypeScriptTypes(source).replace('import { NextResponse } from "next/server";', 'const { NextResponse } = require("next/server");').replace(/export\s+(?=(?:async\s+)?function|const)/g, '') + '\nmodule.exports = { POST, GET, runtime };';
const now=Date.parse('2026-11-01T12:00:00Z');
class AuditDate extends Date {constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
const fakeEnv={}; const deliveries=[];
const fakeFetch=async(url,options)=>{deliveries.push({url,payload:JSON.parse(options.body)});return new Response('',{status:200})};
const mod={exports:{}};
new Function('require','module','exports','process','fetch','Date',compiled)(require,mod,mod.exports,{env:fakeEnv},fakeFetch,AuditDate);
const base={name:'Audit Test',contactMethod:'Email',contact:'audit@example.invalid',preferred:'Any time',consent:true,startedAt:now-5000};
const cases=[
 ['unconfigured-delivery',base,false],
 ['valid-mocked-delivery',base,true],
 ['null-json',null,true],
 ['missing-consent',{...base,consent:false},true],
 ['overflow-calendar-date',{...base,preferredDate:'2026-11-31',preferredSlot:'Early morning'},true],
 ['phone-with-no-digits',{...base,contactMethod:'Telephone',contact:'---------'},true],
 ['no-client-timestamp',{...base,startedAt:undefined},true],
 ['second-immediate-request',{...base,startedAt:undefined},true],
 ['third-immediate-request',{...base,startedAt:undefined},true],
];
const results=[];
for(const [label,body,connected] of cases){
 if(connected)fakeEnv.ENQUIRY_WEBHOOK_URL='https://audit.invalid/never-requested';else delete fakeEnv.ENQUIRY_WEBHOOK_URL;
 const count=deliveries.length;
 try { const res=await mod.exports.POST(new Request('http://audit.local/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));results.push({label,status:res.status,body:await res.json(),forwarded:deliveries.length>count,forwardedData:deliveries.length>count?deliveries.at(-1).payload:null}); }
 catch(e){results.push({label,uncaught:e.message});}
}
writeFileSync('/home/user/.cache/dr-sompo-full-audit/api.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
console.log('All fetches were stubbed in an isolated module context. No external endpoint was contacted.');
