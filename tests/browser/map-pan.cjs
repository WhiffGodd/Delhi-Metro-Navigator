const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
 const file=path.join(root,req.url==='/'?'index.html':req.url.split('?')[0]);
 if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || undefined});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.waitForFunction(()=>document.getElementById('startup-screen').hidden);
 await page.locator('#map').scrollIntoViewIfNeeded();
 async function coverage(){return page.evaluate(()=>{
   const size=map.getSize(), box=map.getContainer().getBoundingClientRect();
   let visible=0, missing=0;
   for(const line of [...linePolylines,routePolyline,routeGlowPolyline].filter(Boolean)){
     const coords=line.getLatLngs(), path=line.getElement(), svg=path.ownerSVGElement;
     const rect=svg.getBoundingClientRect();
     for(let i=1;i<coords.length;i++){
       const a=map.latLngToLayerPoint(coords[i-1]),b=map.latLngToLayerPoint(coords[i]);
       const point=L.point((a.x+b.x)/2,(a.y+b.y)/2), p=map.layerPointToContainerPoint(point);
       if(p.x<15||p.x>size.x-15||p.y<15||p.y>size.y-15)continue;
       visible++;
       const insideSvg=getComputedStyle(svg).overflow==='visible'||(box.x+p.x>=rect.x&&box.x+p.x<=rect.right&&box.y+p.y>=rect.y&&box.y+p.y<=rect.bottom);
       if(!insideSvg||!path.isPointInStroke(new DOMPoint(point.x,point.y)))missing++;
     }
   }
   return {visible,missing};
 });}
 const result=[];
 for(const mobile of [false,true]){
   await page.setViewportSize(mobile?{width:390,height:844}:{width:1280,height:1000});
   for(const route of [false,true]){
     if(route){await page.selectOption('#route-from','vaishali');await page.selectOption('#route-to','hauz_khas');await page.locator('#roadmap-timeline').waitFor();}
     await page.waitForFunction(()=>!map._animatingZoom && !map._panAnim?._inProgress);
     await page.evaluate(()=>{map.stop();map.setView([28.6139,77.209],12,{animate:false});});
     await page.waitForFunction(()=>!map._animatingZoom && !map._panAnim?._inProgress);
     await page.locator('#map').scrollIntoViewIfNeeded();
     const box=await page.locator('#map').boundingBox();
     const x=box.x+box.width*.65, top=Math.max(box.y+70,100),bottom=Math.min(box.y+box.height-80,740);
     await page.mouse.move(x,bottom);await page.mouse.down();
     await page.mouse.move(x,top,{steps:12});
     result.push({mobile,route,direction:'up',...await coverage()});
     await page.mouse.move(x,bottom,{steps:12});
     result.push({mobile,route,direction:'down',...await coverage()});
     await page.mouse.up();
     await page.selectOption('#route-to','');
   }
 }
 console.log(JSON.stringify({result,errors}));
 {assert.deepEqual(errors,[]);for(const r of result){assert.ok(r.visible>0);assert.equal(r.missing,0,JSON.stringify(r));}}
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
