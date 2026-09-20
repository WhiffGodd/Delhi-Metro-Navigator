const {test}=require('node:test');
const assert=require('node:assert/strict');
const {journeyProgress}=require('../journey-companion.js');
const roadmap=[{stationName:'Start'},{stationName:'Change',hasTransfer:true,transferTo:'Yellow Line'},{stationName:'End'}];
test('companion distinguishes upcoming transfers, transfer now and arrival',()=>{
 const start=journeyProgress(roadmap,0);
 assert.equal(start.next.stationName,'Change');assert.equal(start.remaining,2);assert.equal(start.untilTransfer,1);assert.equal(start.arrived,false);
 const transfer=journeyProgress(roadmap,1);assert.equal(transfer.untilTransfer,0);assert.equal(transfer.transfer.transferTo,'Yellow Line');
 const end=journeyProgress(roadmap,2);assert.equal(end.remaining,0);assert.equal(end.arrived,true);assert.equal(end.next,undefined);assert.equal(end.transfer,null);
});
test('direct journeys have no transfer warning',()=>{
 const p=journeyProgress([roadmap[0],roadmap[2]],0);assert.equal(p.transfer,null);assert.equal(p.untilTransfer,null);assert.equal(p.total,1);
});
