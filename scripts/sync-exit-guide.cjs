/* Run with Playwright installed, from the repository root. Reads public DMRC
   station pages once with two workers; stops on denied/rate-limited responses. */
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  await page.goto('https://delhimetrorail.com/',{waitUntil:'domcontentloaded',timeout:25000});
  const codes=JSON.parse(fs.readFileSync('data/station-codes.json','utf8'));
  const result={};
  const entries=Object.entries(codes);
  for(let offset=0;offset<entries.length;offset+=2){
   const batch=entries.slice(offset,offset+2);
   const data=await page.evaluate(async batch=>Promise.all(batch.map(async ([id,code])=>{
    const response=await fetch(`https://backend.delhimetrorail.com/api/v2/en/station/${code}`,{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error(`DMRC denied or failed request: ${response.status}`);
    const station=await response.json();
    const gates=(Array.isArray(station.gates)?station.gates:[]).map(g=>{
     const linked=(station.lifts||[]).filter(l=>[...(l.from_gate_code||[]),...(l.to_gate_code||[])].includes(g.gate_code));
     return {gate:g.gate_name,gateCode:g.gate_code,landmark:g.location||'',accessible:g.divyang_friendly===true,status:g.status||'unknown',
      lift:linked.some(l=>l.lift_type==='Lift')?true:null,escalator:linked.some(l=>l.lift_type==='Escalator')?true:null,
      walkMins:null,transitOptions:[],reason:g.location?`Exit towards ${g.location}.`:'Follow the signs for this gate.'};
    });
    return [id,{available:gates.length>0,allGates:gates,source:'dmrc',sourceUrl:`https://delhimetrorail.com/station/${code}`,checkedOn:'2026-10-08',
      reason:gates.length?'Gate destinations from DMRC’s station guide.':'DMRC does not list gate destinations for this station.',transitOptions:[]}];
   })),batch);
   for(const [id,entry] of data)result[id]=entry;
   if(offset%20===0)console.log(`Read ${Math.min(offset+2,entries.length)}/${entries.length} official station guides`);
   await new Promise(resolve=>setTimeout(resolve,150));
  }
  const network=JSON.parse(fs.readFileSync('data/stations.json','utf8'));
  for(const station of network.stations)if(!result[station.id])result[station.id]={available:false,allGates:[],reason:'Official gate details are not available in the bundled guide.',transitOptions:[]};
  fs.writeFileSync('data/exits.json',JSON.stringify(result,null,2)+'\n');
  const rows=['station\tgate\tlandmark\taccessible\tstatus\tsourceUrl\tcheckedOn'];
  for(const [id,entry] of Object.entries(result))for(const gate of entry.allGates)
    rows.push([id,gate.gate,gate.landmark,String(gate.accessible),gate.status,entry.sourceUrl,entry.checkedOn].map(s=>s.replace(/[\t\n\r]/g,' ')).join('\t'));
  fs.writeFileSync('data/exit-gates.tsv',rows.join('\n')+'\n');
  console.log(`Saved ${Object.values(result).filter(s=>s.available).length} station gate guides, ${Object.values(result).reduce((n,s)=>n+s.allGates.length,0)} gates.`);
 } finally {await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
