/* Published operator tariffs checked 2026-10-08. DMRC track distances are not
   available in this network: its slab selection remains explicitly estimated. */
(function(root) {
  const sources = {
    dmrc: 'https://delhimetrorail.com/fare',
    airport: 'https://delhimetrorail.com/fare-for-airport-express-line',
    aqua: 'https://www.nmrcnoida.com/Passenger-Information/Metro-Rail/Fare-Table'
  };
  const airportIds = ['new_delhi','shivaji_stadium','dhaula_kuan','delhi_aerocity','igi_airport','dwarka_sector_21','yashobhoomi_dwarka_sector_25'];
  const airportMatrix = [
    [11,21,43,54,64,64,75], [21,11,21,32,54,64,75],
    [43,21,11,21,32,54,64], [54,32,21,11,21,32,43],
    [64,54,32,21,11,21,32], [64,64,54,32,21,11,21],
    [75,75,64,43,32,21,11]
  ];
  function distance(a,b) {
    const rad=n=>n*Math.PI/180;
    const h=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;
    return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)));
  }
  function dmrcFare(km) {
    const index=km<=2?0:km<=5?1:km<=12?2:km<=21?3:km<=32?4:5;
    return {weekday:[11,21,32,43,54,64][index],holiday:[11,11,21,32,43,54][index]};
  }
  function aquaFare(stops) {
    const index=stops<=1?0:stops===2?1:stops<=6?2:stops<=9?3:stops<=16?4:5;
    return {weekday:[10,15,20,30,40,50][index],holiday:[10,10,15,20,30,40][index]};
  }
  function priceJourney(ids, lines, stations) {
    const byId=stations instanceof Map?stations:new Map(stations.map(s=>[s.id,s]));
    if (lines.length!==ids.length-1) throw new Error('Fare calculation requires a line for every journey segment.');
    const groups=[];
    for(let i=0;i<lines.length;i++) {
      const line=lines[i].replace(' Branch','').replace(' Loop','');
      const operator=line==='Walking transfer'?'walk':line==='Airport Express'?'airport':line==='Aqua Line'?'aqua':line==='Rapid Metro'?'rapid':'dmrc';
      const last=groups.at(-1);
      if(last&&last.operator===operator) {last.ids.push(ids[i+1]);last.stops++;}
      else groups.push({operator,ids:[ids[i],ids[i+1]],stops:1});
    }
    const breakdown=groups.map(group=>{
      const from=group.ids[0],to=group.ids.at(-1);
      const base={operator:group.operator,from,to,fromName:byId.get(from).name,toName:byId.get(to).name,estimated:false};
      if(group.operator==='walk') return {...base,name:'Walking connection',weekday:0,holiday:0,note:'No metro ticket charged for this walk.'};
      if(group.operator==='airport') {
        const a=airportIds.indexOf(from),b=airportIds.indexOf(to);
        if(a<0||b<0) throw new Error('Airport station is missing from the published tariff.');
        return {...base,name:'Airport Express',weekday:airportMatrix[a][b],holiday:airportMatrix[a][b],source:sources.airport,note:'Published single-journey QR fare.'};
      }
      if(group.operator==='aqua') return {...base,name:'NMRC Aqua Line',...aquaFare(group.stops),source:sources.aqua,note:'Published station-count fare. Separate NMRC ticket.'};
      if(group.operator==='rapid') return {...base,name:'Rapid Metro',weekday:20,holiday:20,source:sources.dmrc,note:'₹20 fare listed on DMRC’s official fare page; confirm at the station.'};
      let km=0;
      for(let i=1;i<group.ids.length;i++) km+=distance(byId.get(group.ids[i-1]),byId.get(group.ids[i]));
      return {...base,name:'Delhi Metro',...dmrcFare(km),source:sources.dmrc,estimated:true,note:'Official distance slabs; selected using approximate station-coordinate distance. Exact ticket fare may differ.'};
    });
    const paid=breakdown.filter(b=>b.operator!=='walk');
    return {weekday:breakdown.reduce((sum,b)=>sum+b.weekday,0),holiday:breakdown.reduce((sum,b)=>sum+b.holiday,0),
      estimated:paid.some(b=>b.estimated)||paid.length>1,breakdown,checkedOn:'2026-10-08',
      note:paid.length>1?'Total adds the operator components shown below. Confirm the final ticket price, especially when interchanging with Airport Express.':paid.some(b=>b.estimated)?'Estimate based on official fare slabs; the exact station-pair price is not available offline.':'Published single-journey operator tariff. Smart-card discounts are not included.'};
  }
  const api={priceJourney,dmrcFare,aquaFare,airportIds,airportMatrix,sources};
  if(typeof module!=='undefined') module.exports=api;
  else root.MetroFares=api;
})(typeof globalThis!=='undefined'?globalThis:this);
