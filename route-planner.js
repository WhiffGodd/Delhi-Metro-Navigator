function createMetroRouter(network) {
  const stations = new Map(network.stations.map(s => [s.id, s]));
  const graph = new Map([...stations.keys()].map(id => [id, []]));
  for (const [service, ids] of Object.entries(network.lineRoutes)) {
    const line = service.replace(" Branch", "").replace(" Loop", "");
    for (let i = 1; i < ids.length; i++) {
      const a = stations.get(ids[i - 1]), b = stations.get(ids[i]);
      if (!a || !b) throw new Error('The network contains an unknown station.');
      const rad = value => value * Math.PI / 180;
      const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
      const km = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
      const minutes = line === 'Walking transfer' ? 8 : km / 35 * 60 + 1.2;
      graph.get(a.id).push({id:b.id, line, minutes});
      if (!(network.oneWayLines || []).includes(service)) graph.get(b.id).push({id:a.id, line, minutes});
    }
  }
  return function findRoute(from, to, preference = 'fastest') {
    if (!stations.has(from) || !stations.has(to)) throw new Error('Choose valid starting and destination stations.');
    if (from === to) throw new Error('Choose two different stations for your journey.');
    if (!['fastest', 'fewest_interchanges'].includes(preference)) throw new Error('Choose a valid route preference.');
    // Track the arriving line as well as the station so transfer costs stay correct.
    const key = (id, line) => JSON.stringify([id, line]);
    const compare = (a, b) => preference === 'fewest_interchanges'
      ? a.transfers - b.transfers || a.minutes - b.minutes
      : a.minutes - b.minutes || a.transfers - b.transfers;
    const start = {id:from, line:null, minutes:0, transfers:0, previous:null};
    const best = new Map([[key(from, null), start]]);
    const pending = [start];
    let finish;
    while (pending.length) {
      pending.sort(compare);
      const current = pending.shift();
      if (best.get(key(current.id, current.line)) !== current) continue;
      if (current.id === to) { finish = current; break; }
      for (const edge of graph.get(current.id)) {
        const transfer = current.line !== null && current.line !== 'Walking transfer' && current.line !== edge.line ? 1 : 0;
        const next = {id:edge.id, line:edge.line,
          minutes:current.minutes + edge.minutes + (edge.line === 'Walking transfer' ? 0 : transfer * 5),
          transfers:current.transfers + transfer, previous:current};
        const stateKey = key(next.id, next.line);
        if (!best.has(stateKey) || compare(next, best.get(stateKey)) < 0) {
          best.set(stateKey, next);
          pending.push(next);
        }
      }
    }
    if (!finish) throw new Error('No connected route was found between these stations.');
    const states = [];
    for (let step = finish; step; step = step.previous) states.unshift(step);
    const stops = states.slice(1).filter(s => s.line !== 'Walking transfer').length;
    // Preserve the existing application's stop-based estimate model.
    const separateOperator = states.some(s => ['Aqua Line', 'Rapid Metro'].includes(s.line));
    const fare = separateOperator ? null : stops === 0 ? 0 : stops <= 2 ? 10 : stops <= 5 ? 20 : stops <= 12 ? 30 : stops <= 21 ? 40 : stops <= 32 ? 50 : 60;
    const segments = [];
    for (let i = 1; i < states.length; i++) {
      const step = states[i], last = segments[segments.length - 1];
      if (last && last.line === step.line) { last.to = step.id; last.stops++; }
      else segments.push({line:step.line, from:states[i - 1].id, to:step.id, stops:1});
    }
    return {originId:from, destId:to, originName:stations.get(from).name,
      destName:stations.get(to).name, totalTimeMins:Math.round(finish.minutes),
      totalStops:stops, fare, fareNote: separateOperator ? "Check operator fares. NMRC and Rapid Metro tickets are separate from Delhi Metro." : "Estimated fare", transfers:finish.transfers,
      pathStationIds:states.map(s => s.id), segments, estimated:true};
  };
}
async function fetchMetroRoute(localRouter, from, to, preference, bundled) {
  if (!bundled) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const params = new URLSearchParams({from, to, pref:preference});
      const response = await fetch('/api/route?' + params, {signal:controller.signal});
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.route && !data.route.error &&
            Array.isArray(data.route.pathStationIds) && data.route.pathStationIds.length > 1)
          return data.route;
      }
    } catch (error) {
      // Use the already-loaded graph if the API is unavailable.
    } finally {
      clearTimeout(timeout);
    }
  }
  return localRouter(from, to, preference);
}
if (typeof module !== 'undefined') module.exports = {createMetroRouter, fetchMetroRoute};
