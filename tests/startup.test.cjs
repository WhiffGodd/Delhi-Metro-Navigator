const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(fetch){const nodes=new Map();const context={AbortController,TypeError,setTimeout,clearTimeout,fetch,document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{textContent:''});return nodes.get(id)}}};vm.createContext(context);vm.runInContext(fs.readFileSync('ui-enhancements.js','utf8'),context);return context;}
const response=(body,type='application/json')=>({ok:true,headers:{get:()=>type},json:async()=>body});
test('returns station data after a transient connection failure',async()=>{let calls=0;const app=setup(async()=>{if(++calls===1)throw new TypeError('Network error');return response({success:true,stations:[{id:'test'}]})});assert.equal((await app.fetchLiveStationNetwork()).stations.length,1);assert.equal(calls,2)});
test('reports missing Java backend when a static host returns HTML',async()=>{const app=setup(async()=>response(null,'text/html'));await assert.rejects(app.fetchLiveStationNetwork(),/not connected to the Java metro server/)});
test('bounds retries and permits a fresh successful attempt',async()=>{let online=false,calls=0;const app=setup(async()=>{calls++;if(!online)throw new TypeError('offline');return response({success:true,stations:[{id:'test'}]})});await assert.rejects(app.fetchLiveStationNetwork(),/did not respond/);assert.equal(calls,2);online=true;assert.equal((await app.fetchLiveStationNetwork()).success,true)});
test('rejects invalid station payloads',async()=>{const app=setup(async()=>response({success:true,stations:[]}));await assert.rejects(app.fetchLiveStationNetwork(),/no station network/)});

const bundled = JSON.parse(fs.readFileSync('data/stations.json', 'utf8'));
test('loads bundled stations on static hosts returning HTML or 404', async () => {
  for (const missing of [response(null, 'text/html'), {ok:false}]) {
    const urls = [];
    const app = setup(async url => { urls.push(url); return url === 'data/stations.json' ? response(bundled) : missing; });
    const data = await app.fetchStationNetwork();
    assert.equal(data.source, 'bundled');
    assert.equal(data.stations.length, bundled.stations.length);
    assert.deepEqual(urls, ['/api/stations', 'data/stations.json']);
  }
});
test('prefers live server data without requesting the bundle', async () => {
  const app = setup(async url => { assert.equal(url, '/api/stations'); return response(bundled); });
  assert.equal((await app.fetchStationNetwork()).source, undefined);
});
test('loads bundled data after bounded API connection retries', async () => {
  let calls = 0;
  const app = setup(async url => { if (url === 'data/stations.json') return response(bundled); calls++; throw new TypeError('offline'); });
  assert.equal((await app.fetchStationNetwork()).source, 'bundled');
  assert.equal(calls, 2);
});
test('reports failure when neither data source is available', async () => {
  const app = setup(async () => ({ok:false}));
  await assert.rejects(app.fetchStationNetwork(), /server or bundled network/);
});
test('rejects a broken bundled network', async () => {
  const app = setup(async url => url === 'data/stations.json' ? response({success:true,stations:[]}) : {ok:false});
  await assert.rejects(app.fetchStationNetwork(), /server or bundled network/);
});
test('bundled network has unique stations and valid line coordinates', () => {
  const stations = new Map(bundled.stations.map(s => [s.id, s]));
  assert.ok(stations.size > 200);
  assert.equal(stations.size, bundled.stations.length);
  assert.ok(Object.keys(bundled.lineRoutes).length >= 9);
  for (const s of stations.values()) {
    assert.ok(s.name && s.lines.length && s.firstTrain && s.lastTrain);
    assert.ok(Number.isFinite(s.lat) && s.lat >= -90 && s.lat <= 90);
    assert.ok(Number.isFinite(s.lng) && s.lng >= -180 && s.lng <= 180);
  }
  for (const route of Object.values(bundled.lineRoutes)) {
    assert.ok(route.length >= 2);
    for (const id of route) assert.ok(stations.has(id), id);
  }
});
