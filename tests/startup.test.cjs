const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(fetch){const nodes=new Map();const context={AbortController,TypeError,setTimeout,clearTimeout,fetch,document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{textContent:''});return nodes.get(id)}}};vm.createContext(context);vm.runInContext(fs.readFileSync('ui-enhancements.js','utf8'),context);return context;}
const response=(body,type='application/json')=>({ok:true,headers:{get:()=>type},json:async()=>body});
test('returns station data after a transient connection failure',async()=>{let calls=0;const app=setup(async()=>{if(++calls===1)throw new TypeError('Network error');return response({success:true,stations:[{id:'test'}]})});assert.equal((await app.fetchStationNetwork()).stations.length,1);assert.equal(calls,2)});
test('reports missing Java backend when a static host returns HTML',async()=>{const app=setup(async()=>response(null,'text/html'));await assert.rejects(app.fetchStationNetwork(),/not connected to the Java metro server/)});
test('bounds retries and permits a fresh successful attempt',async()=>{let online=false,calls=0;const app=setup(async()=>{calls++;if(!online)throw new TypeError('offline');return response({success:true,stations:[{id:'test'}]})});await assert.rejects(app.fetchStationNetwork(),/did not respond/);assert.equal(calls,2);online=true;assert.equal((await app.fetchStationNetwork()).success,true)});
test('rejects invalid station payloads',async()=>{const app=setup(async()=>response({success:true,stations:[]}));await assert.rejects(app.fetchStationNetwork(),/no station network/)});
