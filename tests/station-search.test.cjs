const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('planner suggestions filter typed words and do not use native datalists', () => {
 const html=fs.readFileSync('index.html','utf8');
 const stationsData=JSON.parse(fs.readFileSync('data/stations.json','utf8')).stations;
 const context={stationsData};vm.createContext(context);
 for (const [start,end] of [['      function findStationMatches(query)', '      function initStationTyping()'],['      function stationSearchText(s)', '      function handleSearch(query)']])
  vm.runInContext(html.slice(html.indexOf(start),html.indexOf(end)),context);
 const matches=context.findStationMatches('sector 51');
 assert.ok(matches.some(s=>s.id==='noida_sector_51'));
 assert.ok(matches.every(s=>s.name.toLowerCase().includes('51')));
 assert.equal(context.findStationMatches('zzzzunknown').length,0);
 assert.equal(context.findStationMatches('').length,0);
 assert.ok(!html.includes('list="station-options"'));
});
