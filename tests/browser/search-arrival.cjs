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
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'chrome'});
 try {
 for (const [name,viewport] of [['desktop',{width:1280,height:950}],['mobile',{width:390,height:844}]]) {
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.PREVIEW_URL || `http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(()=>document.getElementById('startup-screen').hidden);
  assert.equal(await page.locator('#route-from').isVisible(),false);
  assert.equal(await page.locator('#route-to').isVisible(),false);
  await page.locator('#route-from-search').fill('sector 51');
  await page.waitForSelector('#route-from-suggestions [role="option"]');
  const suggestions = await page.locator('#route-from-suggestions').innerText();
  assert.match(suggestions,/Noida Sector 51/);
  assert.ok(!suggestions.includes('Samaypur Badli'));
  await page.locator('#route-from-suggestions [role="option"]').first().click();
  assert.equal(await page.locator('#route-from').inputValue(),'noida_sector_51');
  await page.locator('#route-from-search').fill('rajiv');
  await page.locator('#route-from-search').press('ArrowDown');
  await page.locator('#route-from-search').press('Enter');
  assert.equal(await page.locator('#route-from').inputValue(),'rajiv_chowk');
  await page.locator('#route-to-search').fill('New Delhi');
  await page.waitForFunction(()=>document.querySelector('#route-results-container').textContent.includes('Smart exit · New Delhi'));
  const text=await page.locator('#route-results-container').innerText();
  assert.match(text,/₹11/); assert.match(text,/Listed exit: Gate No. 1/); assert.match(text,/New Delhi Railway Station/);
  await page.evaluate(()=>openStationDetails(stationsData.find(s=>s.id==='rajiv_chowk')));
  await page.waitForFunction(()=>document.querySelector('#station-meta-box').textContent.includes('Gate No. 1'));
  await page.evaluate(()=>closeDetailsPanel());
  await page.locator('#route-to-search').fill('Vaishali');
  await page.waitForFunction(()=>document.querySelector('#route-results-container').textContent.includes('Smart exit · Vaishali'));
    await page.locator('#exit-destination').fill('sector 3');
  assert.match(await page.locator('#exit-recommendation-result').innerText(),/Gate No. 2/);
  await page.locator('#route-from-search').fill('New Delhi');
  await page.locator('#route-to-search').fill('Rajiv Chowk');
  await page.waitForFunction(()=>document.querySelector('#smart-exit-panel')?.textContent.includes('Smart exit · Rajiv Chowk'));
  await page.locator('#exit-destination').fill('palika');
  assert.match(await page.locator('#exit-recommendation-result').innerText(),/Suggested: Gate No. 6/);
  await page.locator('#exit-step-free').check();
  assert.match(await page.locator('#exit-recommendation-result').innerText(),/No matching gate is listed as accessible/);
  await page.locator('#exit-step-free').uncheck();
  await page.locator('#exit-destination').fill('zzzzunknown');
  assert.match(await page.locator('#exit-recommendation-result').innerText(),/No listed exit matches/);
  await page.locator('#route-from-search').fill('Rajiv Chowk');
  await page.locator('#route-to-search').fill('New Delhi');
  await page.waitForFunction(()=>document.querySelector('#route-results-container').textContent.includes('Smart exit · New Delhi'));
  await page.locator('#route-results-container').scrollIntoViewIfNeeded();
  await page.screenshot({path:`/tmp/metro-arrival-${name}.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false);
  await page.locator('#route-from-search').fill('New Delhi');
  await page.locator('#route-to-search').fill('IGI Airport (Terminal 3)');
  await page.waitForFunction(()=>document.querySelector('.journey-fare-info')?.textContent.includes('Airport Express'));
  assert.match(await page.locator('.journey-fare-info').innerText(),/₹64/);
  await page.locator('#route-from-search').fill('Noida Sector 51');
  await page.locator('#route-to-search').fill('Depot Station');
  await page.waitForFunction(()=>document.querySelector('.journey-fare-info')?.textContent.includes('NMRC Aqua Line'));
  const aquaFare=await page.locator('.journey-fare-info').innerText();
  assert.match(aquaFare,/₹50/);assert.match(aquaFare,/₹40/);
  assert.match(await page.locator('#smart-exit-panel').innerText(),/Gate destinations are not published/);
  assert.deepEqual(errors,[]);
  await page.close();
  console.log(`${name}: single station fields, fare, offline exits, drawer and overflow checks passed`);
 }
 } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
