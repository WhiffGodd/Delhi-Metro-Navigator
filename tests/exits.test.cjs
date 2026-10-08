const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {getStoredExitRecommendation}=require('../route-planner.js');
const guide=JSON.parse(fs.readFileSync('data/exits.json','utf8'));
test('official exit snapshot covers 239 stations and 724 gates',()=>{
 assert.equal(Object.values(guide).filter(s=>s.available).length,239);
 assert.equal(Object.values(guide).reduce((sum,s)=>sum+s.allGates.length,0),724);
 const rows=fs.readFileSync('data/exit-gates.tsv','utf8').trim().split('\n').slice(1);
 assert.equal(rows.length,724);
 for(const [id,entry] of Object.entries(guide))for(const g of entry.allGates){
  assert.equal(entry.source,'dmrc');assert.ok(entry.sourceUrl.startsWith('https://delhimetrorail.com/station/'));
  assert.ok(rows.some(row=>row.startsWith(id+'\t'+g.gate+'\t'+g.landmark+'\t')));
  assert.equal(g.walkMins,null);
 }
});
test('landmark matching and accessibility change the suggestion',()=>{
 assert.equal(getStoredExitRecommendation(guide,'rajiv_chowk','Palika').bestGate,'Gate No. 6');
 assert.equal(getStoredExitRecommendation(guide,'rajiv_chowk','Palika',true).available,false);
 assert.equal(getStoredExitRecommendation(guide,'hauz_khas','kalu sarai').bestGate,'Gate No. 4');
 assert.equal(getStoredExitRecommendation(guide,'vaishali','sector 3').bestGate,'Gate No. 2');
 assert.equal(getStoredExitRecommendation(guide,'new_delhi','zzzzunknown').available,false);
});
test('closed gates never become a recommendation',()=>{
 const fixture={station:{allGates:[{gate:'Gate 1',landmark:'Market',status:'close',accessible:true},{gate:'Gate 2',landmark:'Road',status:'open',accessible:false}]}};
 assert.equal(getStoredExitRecommendation(fixture,'station').bestGate,'Gate 2');
 assert.equal(getStoredExitRecommendation(fixture,'station','market').available,false);
 assert.equal(getStoredExitRecommendation(fixture,'station','',true).available,false);
});
test('unsupported stations report missing data without guessing a gate',()=>{
 const r=getStoredExitRecommendation(guide,'noida_sector_51');assert.equal(r.available,false);assert.equal(r.bestGate,undefined);
});
