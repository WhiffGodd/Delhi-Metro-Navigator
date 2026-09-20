const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {createMetroRouter, fetchMetroRoute} = require('../route-planner.js');
const network = JSON.parse(fs.readFileSync('data/stations.json', 'utf8'));
const route = createMetroRouter(network);
test('same-line trip has expected stations, stops and no transfers', () => {
  const r = route('rajiv_chowk', 'hauz_khas');
  assert.equal(r.totalStops, 9);
  assert.equal(r.transfers, 0);
  assert.equal(r.segments[0].line, 'Yellow Line');
  assert.equal(r.pathStationIds[0], 'rajiv_chowk');
  assert.equal(r.pathStationIds.at(-1), 'hauz_khas');
  assert.ok(Number.isFinite(r.totalTimeMins) && r.totalTimeMins > 0);
});
test('reverse route and cross-line trip are connected', () => {
  assert.deepEqual(route('hauz_khas', 'rajiv_chowk').pathStationIds, route('rajiv_chowk', 'hauz_khas').pathStationIds.slice().reverse());
  const r = route('rithala', 'hauz_khas');
  assert.ok(r.transfers >= 1);
  assert.equal(r.segments.reduce((sum, s) => sum + s.stops, 0), r.totalStops);
});
test('Vaishali branch is reachable and routes through Yamuna Bank', () => {
  const r = route('vaishali', 'yamuna_bank');
  assert.equal(r.totalStops, 7);
  assert.equal(r.transfers, 0);
});
test('every listed station is reachable with valid adjacent hops for both preferences', () => {
  const edges = new Set();
  for (const [service, ids] of Object.entries(network.lineRoutes)) for (let i=1;i<ids.length;i++) {
    edges.add(JSON.stringify([ids[i-1],ids[i]])); if (!(network.oneWayLines || []).includes(service)) edges.add(JSON.stringify([ids[i],ids[i-1]]));
  }
  for (const preference of ['fastest','fewest_interchanges']) for (const station of network.stations) {
    if (station.id === 'rajiv_chowk') continue;
    const r = route('rajiv_chowk', station.id, preference);
    assert.equal(r.pathStationIds.at(-1), station.id);
    for (let i=1;i<r.pathStationIds.length;i++) assert.ok(edges.has(JSON.stringify([r.pathStationIds[i-1],r.pathStationIds[i]])));
  }
});
test('fewest transfers prioritizes a direct route even when longer', () => {
  const n = {stations:[['a',0,0],['b',0,0.01],['x',1,1],['d',0,0.02]].map(([id,lat,lng])=>({id,name:id,lat,lng})),
    lineRoutes:{Direct:['a','x','d'],First:['a','b'],Second:['b','d']}};
  const find = createMetroRouter(n);
  assert.equal(find('a','d','fastest').transfers, 1);
  assert.equal(find('a','d','fewest_interchanges').transfers, 0);
  assert.ok(find('a','d','fewest_interchanges').totalTimeMins > find('a','d','fastest').totalTimeMins);
});
test('rejects invalid, identical and disconnected destinations', () => {
  assert.throws(()=>route('bad','hauz_khas'), /valid/);
  assert.throws(()=>route('hauz_khas','hauz_khas'), /different/);
  const isolated = createMetroRouter({...network,stations:[...network.stations,{id:'isolated'}]});
  assert.throws(()=>isolated('rajiv_chowk','isolated'), /No connected route/);
});
test('static route planning makes no API request', async () => {
  const r = await fetchMetroRoute(route,'rajiv_chowk','hauz_khas','fastest',true);
  assert.equal(r.totalStops, 9);
});
test('failed and malformed route APIs fall back; valid API remains preferred', async () => {
  const source = fs.readFileSync('route-planner.js','utf8');
  for (const fetch of [async()=>({ok:false}),async()=>{throw new TypeError('offline');},async()=>({ok:true,json:async()=>({success:true,route:{error:'bad'}})})]) {
    const ctx = {fetch,AbortController,URLSearchParams,setTimeout,clearTimeout}; vm.createContext(ctx); vm.runInContext(source,ctx);
    assert.equal((await ctx.fetchMetroRoute(route,'rajiv_chowk','hauz_khas','fastest',false)).totalStops, 9);
  }
  const expected = {pathStationIds:['a','b']};
  const ctx = {fetch:async()=>({ok:true,json:async()=>({success:true,route:expected})}),AbortController,URLSearchParams,setTimeout,clearTimeout};
  vm.createContext(ctx); vm.runInContext(source,ctx);
  assert.equal(await ctx.fetchMetroRoute(()=>assert.fail('fallback called'),'a','b','fastest',false),expected);
});
test('inline page scripts compile and route planner dependency exists', () => {
  const html = fs.readFileSync('index.html','utf8');
  assert.ok(html.includes('src="route-planner.js"'));
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});

test('Blue branch through journeys do not count a line change at Yamuna Bank', () => {
  assert.equal(route('vaishali', 'rajiv_chowk').transfers, 0);
});

test('Aqua and Rapid network coverage and directed loop', () => {
  assert.equal(network.stations.length, 260);
  assert.equal(network.lineRoutes['Aqua Line'].length, 21);
  assert.equal(new Set([...network.lineRoutes['Rapid Metro'], ...network.lineRoutes['Rapid Metro Loop']]).size, 11);
  assert.deepEqual(route('rapid_belvedere_towers', 'rapid_phase_2').pathStationIds,
    ['rapid_belvedere_towers','rapid_cyber_city','rapid_moulsari_avenue','rapid_phase_3','rapid_phase_2']);
  assert.equal(route('rapid_phase_2','rapid_belvedere_towers').totalStops, 1);
});
test('cross NCR journeys use the walking connection and separate fares', () => {
  for (const [from,to] of [['depot_station','rapid_sector_55_56'],['rapid_sector_55_56','depot_station']]) {
    const r = route(from,to,'fewest_interchanges');
    assert.equal(r.transfers,3);
    assert.equal(r.fare,null);
    assert.ok(['noida_sector_51','noida_sector_52','sikanderpur'].every(id=>r.pathStationIds.includes(id)));
    assert.equal(r.totalStops,r.pathStationIds.length-2);
  }
  const walk = route('noida_sector_51','noida_sector_52');
  assert.equal(walk.totalStops,0);assert.equal(walk.totalTimeMins,8);assert.equal(walk.fare,0);
});
