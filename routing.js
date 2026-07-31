class MetroRouter {
  constructor(metroData) {
    this.metroData = metroData;
    this.graph = {};
    this.buildGraph();
  }

  // Haversine distance in km
  getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Build full multi-graph from metro data
  buildGraph() {
    this.graph = {};
    const city = this.metroData.delhi;
    if (!city) return;

    // 1. Add station nodes and travel edges per line
    city.lines.forEach(line => {
      const stations = line.stations;
      const S = stations.length;

      for (let i = 0; i < S; i++) {
        const station = stations[i];
        const nodeId = `${station.name}||${line.id}`;

        if (!this.graph[nodeId]) {
          this.graph[nodeId] = {
            stationName: station.name,
            lineId: line.id,
            lineName: line.name,
            lineColor: line.color,
            coords: station.coords,
            edges: []
          };
        }

        // Edge → next station
        if (i < S - 1) {
          const next = stations[i + 1];
          const nextId = `${next.name}||${line.id}`;
          const dist = this.getDistanceKm(
            station.coords[0], station.coords[1],
            next.coords[0], next.coords[1]
          );
          this.graph[nodeId].edges.push({
            target: nextId,
            time: next.travelTime,
            distance: dist,
            type: "travel",
            lineId: line.id
          });
        }

        // Edge ← previous station
        if (i > 0) {
          const prev = stations[i - 1];
          const prevId = `${prev.name}||${line.id}`;
          const dist = this.getDistanceKm(
            station.coords[0], station.coords[1],
            prev.coords[0], prev.coords[1]
          );
          this.graph[nodeId].edges.push({
            target: prevId,
            time: station.travelTime, // time of this segment is stored on current station
            distance: dist,
            type: "travel",
            lineId: line.id
          });
        }
      }
    });

    // 2. Add bidirectional transfer edges between same station on different lines
    const nodes = Object.keys(this.graph);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = this.graph[nodes[i]];
        const n2 = this.graph[nodes[j]];

        if (n1.stationName === n2.stationName && n1.lineId !== n2.lineId) {
          n1.edges.push({
            target: nodes[j],
            time: 300,      // 5 min transfer walk
            distance: 0,
            type: "transfer",
            lineId: "transfer"
          });
          n2.edges.push({
            target: nodes[i],
            time: 300,
            distance: 0,
            type: "transfer",
            lineId: "transfer"
          });
        }
      }
    }
  }

  // DMRC fare brackets by distance
  calculateFare(distanceKm) {
    if (distanceKm <= 2)  return 10;
    if (distanceKm <= 5)  return 20;
    if (distanceKm <= 12) return 30;
    if (distanceKm <= 21) return 40;
    if (distanceKm <= 32) return 50;
    return 60;
  }

  // Dijkstra pathfinder with preference-based weights
  findRoute(sourceStation, targetStation, preference = "fastest") {
    this.buildGraph(); // refresh graph with current data

    const dist = {};
    const prev = {};
    const visited = new Set();

    // Min-heap priority queue (simple array + sort — fine for <1000 nodes)
    const pq = [];

    const startNodes = Object.keys(this.graph).filter(n => this.graph[n].stationName === sourceStation);
    const endNodes   = new Set(Object.keys(this.graph).filter(n => this.graph[n].stationName === targetStation));

    if (!startNodes.length || !endNodes.size) return null;

    // Crowd stats from running simulation
    const stationStates = (typeof window !== "undefined" && window.sim)
      ? window.sim.stationStates
      : {};

    Object.keys(this.graph).forEach(n => {
      dist[n] = Infinity;
      prev[n] = null;
    });

    startNodes.forEach(n => {
      dist[n] = 0;
      pq.push({ node: n, cost: 0 });
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const { node: u } = pq.shift();

      if (visited.has(u)) continue;
      visited.add(u);

      if (endNodes.has(u)) break;

      const nodeData = this.graph[u];

      for (const edge of nodeData.edges) {
        const v = edge.target;
        if (visited.has(v)) continue;

        const crowdPercent = stationStates[nodeData.stationName]?.crowdPercent ?? 20;
        let weight = 0;

        switch (preference) {
          case "fastest":
            weight = edge.time;
            break;

          case "cheapest":
            // Weight by distance — but add a small flat penalty per transfer
            // to avoid degenerate routes that transfer endlessly to save 0.01 km
            weight = edge.type === "transfer"
              ? 3.0   // flat 3.0 km equivalent penalty for transfers in cheapest mode
              : edge.distance;
            break;

          case "least_crowded": {
            // Penalise crowded departure station
            const crowdMultiplier = 1 + (crowdPercent / 100) * 3;
            weight = edge.time * crowdMultiplier;
            break;
          }

          case "fewest_interchanges":
            weight = edge.time + (edge.type === "transfer" ? 25000 : 0);
            break;

          case "accessible": {
            // Penalty for transfers at stations with simulated lift issues
            // Currently: Kashmere Gate Violet-line platform has lift maintenance
            let accessPenalty = 0;
            if (edge.type === "transfer") {
              const badTransferStations = ["Kashmere Gate", "Anand Vihar ISBT"];
              if (badTransferStations.includes(nodeData.stationName)) {
                accessPenalty = 3600; // 1 hour: effectively forces a re-route
              } else {
                accessPenalty = 60; // slight penalty for any transfer (prefer direct)
              }
            }
            weight = edge.time + accessPenalty;
            break;
          }

          default:
            weight = edge.time;
        }

        const alt = dist[u] + weight;
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
          pq.push({ node: v, cost: alt });
        }
      }
    }

    // Pick the end node with the lowest cost
    let bestEnd = null;
    let minCost = Infinity;
    for (const n of endNodes) {
      if (dist[n] < minCost) {
        minCost = dist[n];
        bestEnd = n;
      }
    }

    if (!bestEnd || dist[bestEnd] === Infinity) return null;

    // Reconstruct path
    const pathNodes = [];
    let cur = bestEnd;
    while (cur !== null) {
      pathNodes.unshift(cur);
      cur = prev[cur];
    }

    return this.formatRouteResult(pathNodes, preference);
  }

  // Build a clean directions + metrics object from the raw node path
  formatRouteResult(pathNodes, preference) {
    let totalTime = 0;
    let totalDistance = 0;
    let totalChanges = 0;

    // Build route coordinate array for map drawing
    const route = pathNodes.map(nodeId => {
      const n = this.graph[nodeId];
      return {
        stationName: n.stationName,
        lineId: n.lineId,
        lineColor: n.lineColor,
        coords: n.coords
      };
    });

    // Accumulate totals
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const nodeData = this.graph[pathNodes[i]];
      const edge = nodeData.edges.find(e => e.target === pathNodes[i + 1]);
      if (edge) {
        totalTime += edge.time;
        totalDistance += edge.distance;
        if (edge.type === "transfer") totalChanges++;
      }
    }

    // Build step-by-step directions
    const directions = [];
    let i = 0;

    while (i < pathNodes.length) {
      const startNode = this.graph[pathNodes[i]];
      let j = i;

      // Walk forward while we stay on the same line (no transfer edge)
      while (j < pathNodes.length - 1) {
        const curNode = this.graph[pathNodes[j]];
        const edge = curNode.edges.find(e => e.target === pathNodes[j + 1]);
        if (!edge || edge.type === "transfer") break;
        j++;
      }

      // If we moved at least one station, record a "board" step
      if (j > i) {
        const endNode = this.graph[pathNodes[j]];
        const segTime = this.calcSegmentTime(pathNodes.slice(i, j + 1));

        directions.push({
          type: "board",
          lineId: startNode.lineId,
          lineName: startNode.lineName,
          lineColor: startNode.lineColor,
          startStation: startNode.stationName,
          endStation: endNode.stationName,
          stationsCount: j - i,
          durationMins: Math.max(1, Math.round(segTime / 60))
        });
      }

      // If a transfer edge follows, record it
      if (j < pathNodes.length - 1) {
        const fromNode = this.graph[pathNodes[j]];
        const toNode   = this.graph[pathNodes[j + 1]];
        const edge     = fromNode.edges.find(e => e.target === pathNodes[j + 1]);

        if (edge && edge.type === "transfer") {
          // Check accessibility alerts
          let liftAlert = null;
          if (preference === "accessible") {
            const badStations = ["Kashmere Gate", "Anand Vihar ISBT"];
            if (badStations.includes(fromNode.stationName)) {
              liftAlert = `⚠️ ${fromNode.stationName}: Lift under maintenance on some platforms. Allow extra time.`;
            }
          }

          directions.push({
            type: "transfer",
            stationName: fromNode.stationName,
            fromLineName: fromNode.lineName,
            toLineName: toNode.lineName,
            toLineColor: toNode.lineColor,
            liftAlert: liftAlert
          });

          i = j + 1; // skip past the transfer
        } else {
          i = j;
        }
      } else {
        i = j + 1; // advance past the last boarding segment
      }
    }

    const fare = this.calculateFare(totalDistance);
    const durationMins = Math.round(totalTime / 60);

    return {
      path: route,
      fare,
      durationMins: durationMins < 1 ? 1 : durationMins,
      interchanges: totalChanges,
      distanceKm: parseFloat(totalDistance.toFixed(2)),
      directions,
      accessibility: preference === "accessible" ? "verified-lift-only" : "standard"
    };
  }

  // Sum up travel time along a sub-path (array of nodeId strings)
  calcSegmentTime(segNodes) {
    let t = 0;
    for (let i = 0; i < segNodes.length - 1; i++) {
      const n = this.graph[segNodes[i]];
      const e = n.edges.find(edge => edge.target === segNodes[i + 1]);
      if (e) t += e.time;
    }
    return t;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = MetroRouter;
} else {
  window.MetroRouter = MetroRouter;
}
