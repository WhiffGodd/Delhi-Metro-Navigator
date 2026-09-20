const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {createMetroRouter}=require('../route-planner.js');
const network=JSON.parse(fs.readFileSync('data/stations.json','utf8'));
const app=vm.createContext({document:{addEventListener(){}}});
const html=fs.readFileSync('index.html','utf8');
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(match[1],app);
app.network=network;
vm.runInContext('stationsData = network.stations',app);
const route=createMetroRouter(network);
for(const [from,to] of [['rajiv_chowk','hauz_khas'],['vaishali','hauz_khas'],['hauz_khas','vaishali'],['yamuna_bank','vaishali']]) {
  test(`roadmap includes every station and connected legs: ${from} to ${to}`,()=>{
    const trip=route(from,to);
    const roadmap=app.enrichFallbackRoadmap(trip.pathStationIds,trip.segments);
    assert.deepEqual(Array.from(roadmap,s=>s.stationId),trip.pathStationIds);
    assert.equal(roadmap.filter(s=>s.hasTransfer).length,trip.transfers);
    for(let i=1;i<trip.segments.length;i++) {
      const segment=trip.segments[i];
      const transfer=roadmap.find(s=>s.stationId===segment.from);
      assert.equal(transfer.hasTransfer,true);
      assert.equal(transfer.transferTo,segment.line);
      assert.equal(transfer.transferFrom,trip.segments[i-1].line);
    }
    const legs=app.enrichFallbackLegs(trip.pathStationIds,roadmap);
    assert.equal(legs.reduce((sum,leg)=>sum+leg.stopsCount,0),trip.totalStops);
    for(let i=1;i<legs.length;i++) assert.equal(legs[i-1].toStationId,legs[i].fromStationId);
    const markup=app.generateRoadmapHtml(roadmap,trip.totalStops);
    assert.equal((markup.match(/data-step-index=/g)||[]).length,trip.pathStationIds.length);
    for(const step of roadmap) assert.ok(markup.includes(step.stationName));
    assert.match(markup,/START/);
    assert.match(markup,/DESTINATION/);
  });
}
test('boarding at an interchange uses the actual departing train line',()=>{
  const trip=route('rajiv_chowk','yamuna_bank');
  const roadmap=app.enrichFallbackRoadmap(trip.pathStationIds,trip.segments);
  assert.equal(roadmap[0].currentLine,'Blue Line');
  assert.equal(roadmap.filter(s=>s.hasTransfer).length,0);
});

test('walking roadmap describes the separate station connection without boarding a train',()=>{
  for(const [from,to] of [['depot_station','rapid_sector_55_56'],['rapid_sector_55_56','depot_station'],['noida_sector_51','noida_sector_52']]) {
    const trip=route(from,to,'fewest_interchanges');
    const roadmap=app.enrichFallbackRoadmap(trip.pathStationIds,trip.segments);
    assert.equal(roadmap.filter(s=>s.hasTransfer).length,trip.transfers);
    const legs=app.enrichFallbackLegs(trip.pathStationIds,roadmap);
    assert.equal(legs.reduce((n,l)=>n+l.stopsCount,0),trip.totalStops);
    assert.match(app.generateLegsHtml(legs,[]),/Walk from/);
    assert.match(app.generateRoadmapHtml(roadmap,trip.totalStops),/Separate operator ticket required/);
    assert.doesNotMatch(app.generateRoadmapHtml(roadmap,trip.totalStops),/Board Walking transfer/);
  }
});
