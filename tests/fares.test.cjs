const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const fares=require('../fare-engine.js');
const {createMetroRouter}=require('../route-planner.js');
const network=JSON.parse(fs.readFileSync('data/stations.json','utf8'));
const route=createMetroRouter(network);
const price=(from,to)=>{const r=route(from,to);const lines=r.segments.flatMap(s=>Array(s.stops).fill(s.line));return fares.priceJourney(r.pathStationIds,lines,network.stations);};
test('published Airport Express matrix includes all pairs and is symmetric',()=>{
 for(let i=0;i<7;i++)for(let j=0;j<7;j++)assert.equal(fares.airportMatrix[i][j],fares.airportMatrix[j][i]);
 const r=price('new_delhi','igi_airport');assert.equal(r.weekday,64);assert.equal(r.estimated,false);
 const extended=price('new_delhi','yashobhoomi_dwarka_sector_25');assert.equal(extended.weekday,75);
});
test('Aqua Line published weekday and holiday boundaries',()=>{
 for(const [stops,weekday,holiday]of [[1,10,10],[2,15,10],[3,20,15],[6,20,15],[7,30,20],[9,30,20],[10,40,30],[16,40,30],[17,50,40]])assert.deepEqual(fares.aquaFare(stops),{weekday,holiday});
 const r=price('noida_sector_51','depot_station');assert.equal(r.weekday,50);assert.equal(r.holiday,40);assert.equal(r.estimated,false);
});
test('DMRC holiday fares and coordinate estimates are explicit',()=>{
 assert.deepEqual(fares.dmrcFare(6),{weekday:32,holiday:21});
 const r=price('rajiv_chowk','hauz_khas');assert.equal(r.estimated,true);assert.match(r.breakdown[0].note,/approximate/);
});
test('mixed operators show separate components and walking costs nothing',()=>{
 const r=price('rajiv_chowk','pari_chowk');assert.ok(r.weekday>0);assert.ok(r.breakdown.some(b=>b.operator==='aqua'));assert.ok(r.breakdown.some(b=>b.operator==='dmrc'));
 assert.equal(r.weekday,r.breakdown.reduce((sum,p)=>sum+p.weekday,0));
 const walk=price('noida_sector_51','noida_sector_52');assert.equal(walk.weekday,0);
 const rapid=price('sikanderpur','rapid_cyber_city');assert.equal(rapid.weekday,20);assert.equal(rapid.breakdown[0].operator,'rapid');
});
test('every network station has visible fare components for an example journey',()=>{
 for(const station of network.stations){if(station.id==='rajiv_chowk')continue;const r=price('rajiv_chowk',station.id);assert.ok(Number.isFinite(r.weekday));assert.ok(Number.isFinite(r.holiday));assert.ok(r.breakdown.length);}
});
