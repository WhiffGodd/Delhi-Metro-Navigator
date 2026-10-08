const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('typing selects stations, clears partial matches and syncs swapped selections', () => {
  const html = fs.readFileSync('index.html','utf8');
  const elements = {};
  for (const side of ['from','to']) for (const suffix of ['', '-search']) {
    elements['route-'+side+suffix] = {value:'', listeners:{},addEventListener(name, callback){this.listeners[name]=callback;}};
    assert.ok(html.includes(`id="route-${side}-search"`));
  }
  let changes=0;
  const stationsData=[{id:'rajiv_chowk',name:'Rajiv Chowk',lines:['Yellow Line','Blue Line']},{id:'vaishali',name:'Vaishali',lines:['Blue Line']}];
  const context={stationsData,document:{getElementById:id=>elements[id]},autoCheckAndHighlight:()=>changes++};
  vm.createContext(context);
  vm.runInContext(html.slice(html.indexOf('      function initStationTyping() {'),html.indexOf('      function populateDropdowns(stations) {')),context);
  vm.runInContext(html.slice(html.indexOf('      function syncStationInputs() {'),html.indexOf('      function autoCheckAndHighlight() {')),context);
  context.initStationTyping();
  elements['route-from-search'].value=' rajiv chowk ';
  elements['route-from-search'].listeners.input();
  assert.equal(elements['route-from'].value,'rajiv_chowk');
  elements['route-to-search'].value='Vaishali — Blue Line';
  elements['route-to-search'].listeners.input();
  assert.equal(elements['route-to'].value,'vaishali');
  elements['route-from-search'].value='Raj';
  elements['route-from-search'].listeners.input();
  assert.equal(elements['route-from'].value,'');
  assert.equal(changes,3);
  elements['route-from'].value='vaishali';elements['route-to'].value='rajiv_chowk';
  context.syncStationInputs();
  assert.equal(elements['route-from-search'].value,'Vaishali — Blue Line');
  assert.equal(elements['route-to-search'].value,'Rajiv Chowk — Yellow Line, Blue Line');
});
