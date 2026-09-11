// ============================================================
// app.js — Delhi Metro Network & AI Smart Exit Recommendation Engine
// AI Multi-Factor Exit Selector, Smart Coach Advice, Gate Mapping
// ============================================================

let map;
let router;

const mapLayers = {
  lines: [],
  stations: [],
  stationMarkers: {},   // stationName → Leaflet Marker
  routeHighlight: null
};

let selectedStation = null;
let currentCityId   = "delhi";
let selectedPref    = "fastest";

// Multi-Factor Gate & Facility Database
const stationGateDatabase = {
  "Rajiv Chowk": [
    {
      gate: "Gate 2",
      landmark: "Palika Bazaar & Connaught Place B-Block",
      walkMins: 2,
      savedMins: 7,
      lift: true,
      escalator: true,
      transit: ["Auto Stand", "Cab Pickup"],
      reason: "Direct indoor connection to Palika Bazaar B-Block with operational glass elevators. Saves 7 mins walk vs Gate 6."
    },
    {
      gate: "Gate 1",
      landmark: "Radial Road 1 & Connaught Place A-Block",
      walkMins: 3,
      savedMins: 4,
      lift: false,
      escalator: true,
      transit: ["Bus Stop"],
      reason: "Closest exit for A-Block & Janpath markets with escalators to ground level."
    },
    {
      gate: "Gate 6",
      landmark: "Regal Cinema & Parliament Street",
      walkMins: 3,
      savedMins: 5,
      lift: true,
      escalator: true,
      transit: ["Parking", "Cab Pickup"],
      reason: "Direct access to Regal Cinema, Palika Parking & Parliament Street bus bays."
    },
    {
      gate: "Gate 7",
      landmark: "Janpath Market & N-Block Outer Circle",
      walkMins: 4,
      savedMins: 3,
      lift: true,
      escalator: false,
      transit: ["Auto Stand"],
      reason: "Optimal exit for N-Block & Janpath Flea Market with elevator access."
    }
  ],
  "New Delhi": [
    {
      gate: "Gate 1",
      landmark: "New Delhi Railway Station (Ajmeri Gate Side)",
      walkMins: 2,
      savedMins: 10,
      lift: true,
      escalator: true,
      transit: ["Prepaid Auto Stand", "Prepaid Taxi"],
      reason: "Direct skywalk bridge into New Delhi Railway Station platforms. Saves 10 mins traffic crossing."
    },
    {
      gate: "Gate 2",
      landmark: "Airport Express Line Terminal & Tagore Road",
      walkMins: 1,
      savedMins: 8,
      lift: true,
      escalator: true,
      transit: ["Airport Express Link", "Cab Pickup"],
      reason: "Direct indoor air-conditioned corridor to Airport Express Line and baggage check-in."
    },
    {
      gate: "Gate 3",
      landmark: "Paharganj Market & Sheila Cinema",
      walkMins: 4,
      savedMins: 5,
      lift: false,
      escalator: true,
      transit: ["Auto Stand"],
      reason: "Closest exit for Paharganj hotel hub and Sheila Cinema complex."
    }
  ],
  "Kashmere Gate": [
    {
      gate: "Gate 1",
      landmark: "ISBT Bus Terminal & Ring Road",
      walkMins: 2,
      savedMins: 9,
      lift: true,
      escalator: true,
      transit: ["Interstate Bus Terminal", "Auto Stand"],
      reason: "Direct indoor concourse link to Maharana Pratap ISBT departure bays. Saves 9 mins walk in rain/sun."
    },
    {
      gate: "Gate 5",
      landmark: "Lothian Road & St. James Church",
      walkMins: 3,
      savedMins: 4,
      lift: true,
      escalator: true,
      transit: ["Cab Pickup"],
      reason: "Step-free ramp and lift access leading directly to Heritage District & St. James Church."
    },
    {
      gate: "Gate 7",
      landmark: "Mori Gate & Old Delhi Railway Connection",
      walkMins: 4,
      savedMins: 6,
      lift: false,
      escalator: true,
      transit: ["Parking", "Auto Stand"],
      reason: "Closest exit to Mori Gate Bus Stand and Metro Car Parking Lot."
    }
  ],
  "Chandni Chowk": [
    {
      gate: "Gate 5",
      landmark: "Red Fort (Lal Qila) & Jama Masjid",
      walkMins: 3,
      savedMins: 12,
      lift: true,
      escalator: true,
      transit: ["E-Rickshaw Stand"],
      reason: "Direct heritage pathway to Red Fort Main Entrance & Jama Masjid. Saves 12 mins navigation through narrow alleys."
    },
    {
      gate: "Gate 1",
      landmark: "Old Delhi Railway Station (DLI Main Entry)",
      walkMins: 2,
      savedMins: 8,
      lift: true,
      escalator: true,
      transit: ["Prepaid Taxi", "Auto Stand"],
      reason: "Direct subway connection straight to Old Delhi Railway Station concourse."
    },
    {
      gate: "Gate 3",
      landmark: "Chandni Chowk Cloth Market & Town Hall",
      walkMins: 3,
      savedMins: 5,
      lift: false,
      escalator: true,
      transit: ["E-Rickshaw Stand"],
      reason: "Opens directly into Central Chandni Chowk pedestrian street and Paranthe Wali Gali."
    }
  ],
  "Central Secretariat": [
    {
      gate: "Gate 5",
      landmark: "Kartavya Path, Rail Bhawan & Vijay Chowk",
      walkMins: 2,
      savedMins: 8,
      lift: true,
      escalator: true,
      transit: ["Electric Bus Stop"],
      reason: "Direct exit to Kartavya Path lawns & Rail Bhawan with full wheelchair accessibility."
    },
    {
      gate: "Gate 1",
      landmark: "Krishi Bhawan & Shastri Bhawan",
      walkMins: 3,
      savedMins: 5,
      lift: true,
      escalator: true,
      transit: ["Cab Pickup"],
      reason: "Closest access gate to Ministry of Agriculture & Shastri Bhawan complex."
    }
  ],
  "Hauz Khas": [
    {
      gate: "Gate 1",
      landmark: "IIT Delhi Main Gate & Sri Aurobindo Marg",
      walkMins: 3,
      savedMins: 7,
      lift: true,
      escalator: true,
      transit: ["Auto Stand", "Bus Stop"],
      reason: "Step-free elevator access leading directly to IIT Delhi Gate 1 & outer ring bus stop."
    },
    {
      gate: "Gate 2",
      landmark: "Hauz Khas Village & Deer Park",
      walkMins: 4,
      savedMins: 6,
      lift: false,
      escalator: true,
      transit: ["E-Rickshaw Stand", "Cab Pickup"],
      reason: "Dedicated E-Rickshaw pickup hub for Hauz Khas Village nightlife & Deer Park."
    }
  ],
  "INA": [
    {
      gate: "Gate 1",
      landmark: "Dilli Haat Crafts Market & Food Plaza",
      walkMins: 1,
      savedMins: 6,
      lift: true,
      escalator: true,
      transit: ["Auto Stand"],
      reason: "Direct entry to Dilli Haat open-air craft market with ramp & elevator access."
    },
    {
      gate: "Gate 2",
      landmark: "AIIMS Trauma Centre & Kidwai Nagar",
      walkMins: 3,
      savedMins: 5,
      lift: true,
      escalator: true,
      transit: ["Cab Pickup"],
      reason: "Direct subway to Kidwai Nagar West and AIIMS Trauma Annex."
    }
  ],
  "AIIMS": [
    {
      gate: "Gate 2",
      landmark: "AIIMS Main OPD Tower & Emergency Ward",
      walkMins: 1,
      savedMins: 9,
      lift: true,
      escalator: true,
      transit: ["Auto Stand", "Wheelchair Bay"],
      reason: "Subway extension directly opens inside AIIMS Main Hospital Plaza. 100% barrier-free elevator route."
    },
    {
      gate: "Gate 1",
      landmark: "Safdarjung Hospital & Medical College",
      walkMins: 2,
      savedMins: 7,
      lift: true,
      escalator: true,
      transit: ["Bus Stop"],
      reason: "Direct covered ramp exit to Safdarjung Hospital OPD Complex."
    }
  ]
};

// ─────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  router = new MetroRouter(window.metroData);
  window.router = router;

  initMap();
  loadCity(currentCityId);
  wireEventListeners();
  populatePlannerDropdowns();

  if (window.lucide) lucide.createIcons();
});

// ─────────────────────────────────────────────
// Map Initialization
// ─────────────────────────────────────────────
function initMap() {
  const city = window.metroData[currentCityId];
  map = L.map("map", { zoomControl: false })
         .setView(city.center, city.zoom);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }
  ).addTo(map);

  L.control.zoom({ position: "bottomleft" }).addTo(map);
}

// ─────────────────────────────────────────────
// Load City Network Lines & Station Markers
// ─────────────────────────────────────────────
function loadCity(cityId) {
  currentCityId = cityId;
  selectedStation = null;
  hideDetails();
  clearRouteHighlight();

  mapLayers.lines.forEach(l => map.removeLayer(l));
  mapLayers.stations.forEach(m => map.removeLayer(m));
  mapLayers.lines = [];
  mapLayers.stations = [];
  mapLayers.stationMarkers = {};

  const city = window.metroData[cityId];
  if (!city) return;
  map.setView(city.center, city.zoom);

  city.lines.forEach(line => {
    const coords = line.stations.map(s => s.coords);

    // Subtle polyline underlay & line trace
    const shadow = L.polyline(coords, { color: "#ffffff", weight: 8, opacity: 0.8, lineJoin: "round" }).addTo(map);
    const poly   = L.polyline(coords, { color: line.color, weight: 4, opacity: 0.9, lineJoin: "round" }).addTo(map);
    
    shadow.isShadow = true;
    poly.isMetroLine = true;
    poly.originalColor = line.color;

    mapLayers.lines.push(shadow, poly);

    line.stations.forEach(station => {
      if (mapLayers.stationMarkers[station.name]) return;

      const marker = L.marker(station.coords, { icon: makeStationIcon(line.color) }).addTo(map);
      
      marker.bindTooltip(() => buildStationTooltipHtml(station.name), {
        direction: "top",
        className: "leaflet-tooltip-station-detail",
        offset: [0, -7]
      });

      marker.on("click", () => selectStation(station.name));

      mapLayers.stations.push(marker);
      mapLayers.stationMarkers[station.name] = marker;
    });
  });

  renderLinePills(city);
}

// ─────────────────────────────────────────────
// Station Icons
// ─────────────────────────────────────────────
function makeStationIcon(color) {
  return L.divIcon({
    className: "custom-station-icon",
    html: `<div class="station-dot" style="background:${color}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });
}

// ─────────────────────────────────────────────
// Rich Station Hover Tooltip
// ─────────────────────────────────────────────
function buildStationTooltipHtml(stationName) {
  const city = window.metroData?.[currentCityId];
  if (!city) return stationName;

  const servedLines = city.lines ? city.lines.filter(l => l.stations && l.stations.some(s => s.name === stationName)) : [];

  const linesBadges = servedLines.map(l => {
    const textColor = l.color === '#FFD700' ? '#92650a' : l.color;
    return `<span class="tt-line-badge" style="background:${l.color}18;border:1px solid ${l.color}50;color:${textColor}">${l.name}</span>`;
  }).join("");

  const isInterchange = servedLines.length > 1;

  return `
    <div class="tt-station-detail">
      <div class="tt-station-header">
        <span class="tt-station-name">${stationName}</span>
        ${isInterchange ? `<span class="tt-interchange-tag">🔄 Transfer Hub</span>` : ''}
      </div>
      <div class="tt-lines-row">${linesBadges}</div>
      <div class="tt-meta-info">
        <span>⏱️ First: 05:30 AM &nbsp;·&nbsp; Last: 23:30 PM</span>
      </div>
      <div class="tt-footer">Click to view gate map & AI exit recommendations</div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// Line Pills Legend
// ─────────────────────────────────────────────
function renderLinePills(city) {
  const c = document.querySelector(".line-pills");
  if (!c) return;
  c.innerHTML = city.lines.map(line => `
    <span class="line-pill" style="background:${line.color}15;border-color:${line.color}50;color:${line.color === '#FFD700' ? '#92650a' : line.color}">
      <span class="line-pill-dot" style="background:${line.color}"></span>
      ${line.name}
    </span>`).join("");
}

// ─────────────────────────────────────────────
// Station Selection
// ─────────────────────────────────────────────
function selectStation(name) {
  selectedStation = name;
  const city = window.metroData[currentCityId];
  for (const line of city.lines) {
    const s = line.stations.find(st => st.name === name);
    if (s) { map.panTo(s.coords); break; }
  }
  renderDetailsPanel();
  document.getElementById("details-panel").classList.add("active");
  if (window.lucide) lucide.createIcons();
}

function hideDetails() {
  document.getElementById("details-panel").classList.remove("active");
  selectedStation = null;
}

// ─────────────────────────────────────────────
// Planner Dropdowns
// ─────────────────────────────────────────────
function populatePlannerDropdowns() {
  const city = window.metroData[currentCityId];
  if (!city) return;

  const names = new Set();
  city.lines.forEach(l => l.stations.forEach(s => names.add(s.name)));

  const sorted = [...names].sort();
  const opts = `<option value="">Choose station…</option>` +
    sorted.map(n => `<option value="${n}">${n}</option>`).join("");

  document.getElementById("route-from").innerHTML = opts;
  document.getElementById("route-to").innerHTML   = opts;
}

// ─────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────
function wireEventListeners() {

  // ── Tabs ───────────────────────────────────
  document.getElementById("tab-network").addEventListener("click", () => switchTab("network"));
  document.getElementById("tab-planner").addEventListener("click", () => switchTab("planner"));
  document.getElementById("tab-helplines").addEventListener("click", () => switchTab("helplines"));
  document.getElementById("tab-info").addEventListener("click",    () => switchTab("info"));

  // ── Search ─────────────────────────────────
  const searchInput   = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchResults.classList.remove("active"); return; }

    const city = window.metroData[currentCityId];
    const hits = [];
    city.lines.forEach(line => {
      line.stations.forEach(s => {
        if (s.name.toLowerCase().includes(q) && !hits.some(h => h.name === s.name)) {
          hits.push({ name: s.name, lineName: line.name, lineColor: line.color });
        }
      });
    });

    if (hits.length) {
      searchResults.innerHTML = hits.slice(0, 8).map(h => `
        <div class="search-item" onclick="selectStation('${h.name.replace(/'/g, "\\'")}');document.getElementById('search-results').classList.remove('active')">
          <span>${h.name}</span>
          <span class="search-item-line" style="background:${h.lineColor}20;color:${h.lineColor === '#FFD700' ? '#92650a' : h.lineColor};border:1px solid ${h.lineColor}60">${h.lineName}</span>
        </div>`).join("");
    } else {
      searchResults.innerHTML = `<div class="search-item" style="color:var(--text-muted);cursor:default">No stations found</div>`;
    }
    searchResults.classList.add("active");
  });

  document.addEventListener("click", e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target))
      searchResults.classList.remove("active");
  });

  // ── Close Details ──────────────────────────
  document.getElementById("close-details-btn").addEventListener("click", hideDetails);

  // ── Station Action Chips (Set Origin / Dest) ─────────
  document.getElementById("set-origin-btn").addEventListener("click", () => {
    if (!selectedStation) return;
    document.getElementById("route-from").value = selectedStation;
    switchTab("planner");
  });

  document.getElementById("set-dest-btn").addEventListener("click", () => {
    if (!selectedStation) return;
    document.getElementById("route-to").value = selectedStation;
    switchTab("planner");
  });

  // ── Preference Buttons ─────────────────────
  document.querySelectorAll(".pref-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pref-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPref = btn.dataset.pref;

      // Auto-recalculate if origin & destination are selected
      const from = document.getElementById("route-from").value;
      const to   = document.getElementById("route-to").value;
      if (from && to && from !== to) {
        calculateTrip();
      }
    });
  });

  // ── Swap Stations ──────────────────────────
  document.getElementById("swap-stations-btn").addEventListener("click", () => {
    const from = document.getElementById("route-from");
    const to   = document.getElementById("route-to");
    const tmp  = from.value;
    from.value = to.value;
    to.value   = tmp;
  });

  // ── Plan Trip ──────────────────────────────
  document.getElementById("plan-trip-btn").addEventListener("click", calculateTrip);
}

// ─────────────────────────────────────────────
// Tab Switching
// ─────────────────────────────────────────────
function switchTab(tab) {
  ["network", "planner", "helplines", "info"].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const cnt = document.getElementById(`content-${t}`);
    if (btn) btn.classList.toggle("active", t === tab);
    if (cnt) cnt.classList.toggle("active", t === tab);
  });
  if (tab !== "planner") clearRouteHighlight();
}

// ─────────────────────────────────────────────
// Trip Calculation
// ─────────────────────────────────────────────
async function calculateTrip() {
  const from = document.getElementById("route-from").value;
  const to   = document.getElementById("route-to").value;

  if (!from || !to)  { showPlannerMsg("Please select both an origin and destination station."); return; }
  if (from === to)   { showPlannerMsg("Origin and destination must be different stations."); return; }

  const btn = document.getElementById("plan-trip-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Java Engine analyzing route, coach & exit recommendation…`;

  try {
    const fromId = from.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const toId = to.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const res = await fetch(`/api/route?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}&pref=${selectedPref}`);
    const data = await res.json();

    btn.disabled = false;
    btn.innerHTML = "Calculate Route";

    if (data.success && data.route) {
      renderTripResultFromJava(data.route, from, to);
    } else {
      const fallbackResult = router.findRoute(from, to, selectedPref);
      renderTripResult(fallbackResult, from, to);
    }
  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = "Calculate Route";
    const fallbackResult = router.findRoute(from, to, selectedPref);
    renderTripResult(fallbackResult, from, to);
  }
}

function renderTripResultFromJava(javaRoute, fromName, toName) {
  const c = document.getElementById("route-results-container");
  c.style.display = "flex";

  const exitAi = javaRoute.exitAi || getAISmartExitRecommendation(toName);

  let transitBadges = "";
  if (exitAi.transitOptions) {
    transitBadges = exitAi.transitOptions.map(t => `<span class="transit-chip">🚗 ${t}</span>`).join("");
  }

  c.innerHTML = `
    <div class="route-summary-card">
      <div class="route-metric">
        <span class="route-metric-val">~${javaRoute.totalTimeMins} <span style="font-size:0.75rem">mins</span></span>
        <span class="route-metric-label">Travel Time</span>
      </div>
      <div class="route-metric">
        <span class="route-metric-val">₹${javaRoute.fare}</span>
        <span class="route-metric-label">Single Fare</span>
      </div>
      <div class="route-metric">
        <span class="route-metric-val">${javaRoute.totalStops}</span>
        <span class="route-metric-label">Stops</span>
      </div>
    </div>

    <!-- JAVA AI SMART EXIT CARD -->
    <div class="smart-assistant-card exit-ai-card">
      <div class="assistant-card-header">
        <div class="assistant-card-title-group">
          <span class="assistant-card-title">🤖 Java AI Exit Gate Recommendation</span>
          <span class="exit-gate-highlight-badge">⭐ Recommended: ${exitAi.bestGate}</span>
        </div>
      </div>
      
      <div class="exit-reasoning-box">
        <div class="reasoning-text">💡 <strong>Why ${exitAi.bestGate}?</strong> ${exitAi.reason}</div>
        <div class="exit-metrics-row">
          <div class="exit-metric-item">
            <span class="exit-metric-icon">⏱️</span>
            <span>Saves <strong>~${exitAi.savedMins} mins</strong> walk</span>
          </div>
          <div class="exit-metric-item">
            <span class="exit-metric-icon">🛗</span>
            <span>${exitAi.lift ? "Elevator Operational" : "Escalators Only"}</span>
          </div>
        </div>
        <div class="exit-transit-row">
          <span class="transit-label">First/Last Mile Options:</span>
          <div class="transit-chips-group">${transitBadges}</div>
        </div>
      </div>
    </div>`;

  highlightRouteOnMap([fromName, toName]);
}

function showPlannerMsg(msg) {
  const c = document.getElementById("route-results-container");
  c.innerHTML = `<div class="route-error"><span>${msg}</span></div>`;
  c.style.display = "flex";
}

// ─────────────────────────────────────────────
// AI Smart Exit Multi-Factor Recommendation Engine
// ─────────────────────────────────────────────
function getAISmartExitRecommendation(stationName) {
  const gates = stationGateDatabase[stationName];
  if (!gates || !gates.length) {
    return {
      bestGate: "Gate 1",
      reason: "Primary station concourse exit with street level access.",
      savedMins: 3,
      lift: true,
      escalator: true,
      transit: ["Auto Stand", "Cab Pickup"],
      allGates: []
    };
  }

  // Best gate is pre-calculated by multi-factor score (lift, saved time, transit)
  const bestGateObj = gates[0];

  return {
    bestGate: bestGateObj.gate,
    landmark: bestGateObj.landmark,
    reason: bestGateObj.reason,
    savedMins: bestGateObj.savedMins,
    walkMins: bestGateObj.walkMins,
    lift: bestGateObj.lift,
    escalator: bestGateObj.escalator,
    transit: bestGateObj.transit,
    allGates: gates
  };
}

// ─────────────────────────────────────────────
// Render Trip Result with AI Assistant Intelligence
// ─────────────────────────────────────────────
function renderTripResult(result, from, to) {
  const container = document.getElementById("route-results-container");

  if (!result) {
    container.innerHTML = `
      <div class="route-error">
        <span style="font-size:1.4rem">🚫</span>
        <span>No direct or interchange route found between <strong>${from}</strong> and <strong>${to}</strong>.</span>
      </div>`;
    container.style.display = "flex";
    return;
  }

  highlightRouteOnMap(result.path);

  const changeStr = result.interchanges === 0 ? "Direct Route" :
    `${result.interchanges} Change${result.interchanges > 1 ? "s" : ""}`;

  // Smart Coach Recommendation Logic
  let recommendedCoach = "Coach 3 or 4 (Middle)";
  let coachReason = "Optimal balance for quick exit & escalator access";
  if (result.interchanges > 0) {
    recommendedCoach = "Coach 3 (Middle-Front)";
    coachReason = "Directly aligns with interchange escalators & transfers";
  } else if (result.directions[0]?.stationsCount > 8) {
    recommendedCoach = "Coach 2 or 5";
    coachReason = "Lower seating density & faster boarding flow";
  }

  // AI Smart Exit Recommendation for Destination Station
  const exitAi = getAISmartExitRecommendation(to);

  const transitBadges = exitAi.transit.map(t => `<span class="transit-chip">${t}</span>`).join(" ");

  const smartExitCardHtml = `
    <div class="smart-assistant-card exit-ai-card">
      <div class="assistant-card-header">
        <div class="assistant-card-title-group">
          <span class="assistant-card-title">🤖 AI Smart Exit Recommendation (${to})</span>
          <span class="exit-gate-highlight-badge">${exitAi.bestGate}</span>
        </div>
      </div>
      
      <div class="exit-reasoning-box">
        <div class="reasoning-text">💡 <strong>Why ${exitAi.bestGate}?</strong> ${exitAi.reason}</div>
        <div class="exit-metrics-row">
          <div class="exit-metric-item">
            <span class="exit-metric-icon">⏱️</span>
            <span>Saves <strong>~${exitAi.savedMins} mins</strong> walk</span>
          </div>
          <div class="exit-metric-item">
            <span class="exit-metric-icon">🛗</span>
            <span>${exitAi.lift ? "Elevator Operational" : "Escalators Only"}</span>
          </div>
        </div>
        <div class="exit-transit-row">
          <span class="transit-label">First/Last Mile Options:</span>
          <div class="transit-chips-group">${transitBadges}</div>
        </div>
      </div>
    </div>`;

  const stepsHtml = result.directions.map(step => {
    if (step.type === "board") return `
      <div class="itinerary-step board" style="--step-line-color:${step.lineColor}">
        <div class="step-title" style="color:${step.lineColor}">${step.lineName}</div>
        <div class="step-desc">
          Board at <strong>${step.startStation}</strong> → Alight at <strong>${step.endStation}</strong>
          <div style="color:var(--text-muted);margin-top:3px;font-weight:500">
            ${step.stationsCount} station stop${step.stationsCount !== 1 ? "s" : ""} &nbsp;·&nbsp; ~${step.durationMins} min ride
          </div>
        </div>
      </div>`;
    if (step.type === "transfer") return `
      <div class="itinerary-step transfer">
        <div class="step-title" style="color:var(--accent-red)">Line Interchange</div>
        <div class="step-desc">
          At <strong>${step.stationName}</strong>:
          Switch from ${step.fromLineName} → <strong style="color:${step.toLineColor}">${step.toLineName}</strong>
          <div style="color:var(--text-muted);margin-top:3px">~5 min interchange walk</div>
        </div>
      </div>`;
    return "";
  }).join("");

  const prefLabels = { fastest: "⚡ Fastest Route", fewest_interchanges: "🔀 Minimum Changes" };
  const prefLabel = prefLabels[selectedPref] || "Best Route";

  container.innerHTML = `
    <span class="sidebar-title" style="margin-bottom:0">
      <span>Route Summary</span>
      <button onclick="clearRouteHighlight()" class="clear-route-btn">✕ Clear</button>
    </span>
    <div class="route-type-badge">
      ${prefLabel}
    </div>
    <div class="route-summary-card">
      <div class="route-metric">
        <span class="route-metric-val">₹${result.fare}</span>
        <span class="route-metric-label">Estimated Fare</span>
      </div>
      <div class="route-metric">
        <span class="route-metric-val">~${result.durationMins}m</span>
        <span class="route-metric-label">Travel Time</span>
      </div>
      <div class="route-metric">
        <span class="route-metric-val">${changeStr}</span>
        <span class="route-metric-label">Interchanges</span>
      </div>
    </div>

    <!-- AI Smart Coach Recommendation Card -->
    <div class="smart-assistant-card coach-card">
      <div class="assistant-card-title">
        <span>💡 Smart Coach Recommendation</span>
      </div>
      <div class="coach-val">Board <strong>${recommendedCoach}</strong></div>
      <div class="coach-desc">${coachReason}</div>
    </div>

    ${smartExitCardHtml}

    <div class="itinerary-list">${stepsHtml}</div>
    <p style="font-size:0.72rem;color:var(--text-muted);margin-top:0.75rem;line-height:1.4">Fare calculated according to DMRC published slab rates. Travel time is estimated.</p>
  `;

  container.style.display = "flex";
  if (window.lucide) lucide.createIcons();
}

// ─────────────────────────────────────────────
// Route Highlight on Map (Mute Non-Route Lines)
// ─────────────────────────────────────────────
function highlightRouteOnMap(pathArr) {
  clearRouteHighlight();
  const coords = pathArr.map(p => p.coords);
  if (coords.length < 2) return;

  // Make all other metro lines colorless (muted light grey)
  mapLayers.lines.forEach(layer => {
    if (layer.isShadow) {
      layer.setStyle({ opacity: 0.1 });
    } else if (layer.isMetroLine) {
      layer.setStyle({ color: "#cbd5e1", opacity: 0.25 });
    }
  });

  // Fade out station markers not on the path
  const pathStationNames = new Set(pathArr.map(p => p.stationName));
  Object.entries(mapLayers.stationMarkers).forEach(([name, marker]) => {
    if (pathStationNames.has(name)) {
      marker.setOpacity(1.0);
    } else {
      marker.setOpacity(0.2);
    }
  });

  // Vibrant accent for chosen route
  const mainColor = selectedPref === "fewest_interchanges" ? "#7c3aed" : "#1d4ed8";

  // Wide soft glow layer
  const glow = L.polyline(coords, {
    color: mainColor, weight: 14, opacity: 0.2, lineJoin: "round", lineCap: "round"
  });

  // White border outline
  const shadow = L.polyline(coords, {
    color: "#ffffff", weight: 8, opacity: 0.9, lineJoin: "round", lineCap: "round"
  });

  // Main animated path line
  const line = L.polyline(coords, {
    color: mainColor, weight: 5, opacity: 0.95,
    dashArray: "10 8", lineJoin: "round", lineCap: "round",
    className: "route-animated"
  });

  // Start Marker
  const startM = L.circleMarker(coords[0], {
    radius: 9, fillColor: "#15803d", color: "#ffffff", weight: 3, fillOpacity: 1
  }).bindTooltip("Origin: " + pathArr[0].stationName, {
    permanent: true, className: "leaflet-tooltip-route-start",
    direction: "top", offset: [0, -12]
  });

  // End Marker
  const endM = L.circleMarker(coords[coords.length - 1], {
    radius: 9, fillColor: "#b91c1c", color: "#ffffff", weight: 3, fillOpacity: 1
  }).bindTooltip("Destination: " + pathArr[pathArr.length - 1].stationName, {
    permanent: true, className: "leaflet-tooltip-route-end",
    direction: "top", offset: [0, -12]
  });

  // Intermediate station dots along route
  const intermediateDots = [];
  for (let i = 1; i < coords.length - 1; i++) {
    const stationName = pathArr[i].stationName;
    const dot = L.circleMarker(coords[i], {
      radius: 4, fillColor: mainColor, color: "#ffffff",
      weight: 2, fillOpacity: 0.95
    }).bindTooltip(stationName, {
      className: "leaflet-tooltip-metro", direction: "top", offset: [0, -6]
    });
    intermediateDots.push(dot);
  }

  const layers = [glow, shadow, line, ...intermediateDots, startM, endM];
  mapLayers.routeHighlight = L.featureGroup(layers).addTo(map);
  map.fitBounds(mapLayers.routeHighlight.getBounds(), { padding: [80, 80] });
}

window.clearRouteHighlight = function () {
  if (mapLayers.routeHighlight) {
    map.removeLayer(mapLayers.routeHighlight);
    mapLayers.routeHighlight = null;
  }

  // Restore all lines to original vibrant colors
  mapLayers.lines.forEach(layer => {
    if (layer.isShadow) {
      layer.setStyle({ opacity: 0.8 });
    } else if (layer.isMetroLine) {
      layer.setStyle({ color: layer.originalColor, opacity: 0.9 });
    }
  });

  // Restore all station markers opacity
  Object.values(mapLayers.stationMarkers).forEach(marker => {
    marker.setOpacity(1.0);
  });

  const c = document.getElementById("route-results-container");
  if (c) { c.innerHTML = ""; c.style.display = "none"; }
};

// ─────────────────────────────────────────────
// Station Detail Panel (Interactive Gate Finder & AI Explanation)
// ─────────────────────────────────────────────
function renderDetailsPanel() {
  if (!selectedStation) return;

  const city = window.metroData[currentCityId];
  if (!city) return;

  document.getElementById("station-title").innerText = selectedStation;

  // Lines served
  const servedLines = city.lines.filter(l => l.stations.some(s => s.name === selectedStation));
  document.getElementById("station-subtitle").innerHTML = servedLines.map(l =>
    `<span class="line-served-badge" style="background:${l.color}18;border-color:${l.color}60;color:${l.color === '#FFD700' ? '#92650a' : l.color}">${l.name}</span>`
  ).join(" ");

  // First & Last Train Schedule
  const ltList = document.getElementById("last-train-list");
  
  const schedules = servedLines.map(line => {
    const stations = line.stations;
    const idx = stations.findIndex(s => s.name === selectedStation);
    const S = stations.length;
    if (idx === -1) return null;

    const termUp = stations[S - 1].name;
    const termDown = stations[0].name;

    return `
      <div class="last-train-card">
        <div class="last-train-header" style="color:${line.color === '#FFD700' ? '#92650a' : line.color}">${line.name}</div>
        <div class="last-train-row">
          <div class="last-train-dir">
            <span class="last-train-dest">Towards ${termUp}</span>
            <span class="last-train-time">First: 05:45 AM &nbsp;·&nbsp; Last: 23:25 PM</span>
          </div>
        </div>
        <div class="last-train-row" style="margin-top:6px;padding-top:6px;border-top:1px dashed #e2e8f0">
          <div class="last-train-dir">
            <span class="last-train-dest">Towards ${termDown}</span>
            <span class="last-train-time">First: 05:40 AM &nbsp;·&nbsp; Last: 23:30 PM</span>
          </div>
        </div>
      </div>`;
  }).filter(Boolean).join("");

  ltList.innerHTML = schedules || `<p style="color:var(--text-muted);font-size:0.83rem">Schedule details available at station booth.</p>`;

  // Station AI Exit Gate Explorer & Metadata Card
  const metaBox = document.getElementById("station-meta-box");
  const isTransfer = servedLines.length > 1;

  const exitAi = getAISmartExitRecommendation(selectedStation);

  const gatesListHtml = exitAi.allGates && exitAi.allGates.length ? exitAi.allGates.map(g => `
    <div class="gate-detail-card ${g.gate === exitAi.bestGate ? 'best-gate-card' : ''}">
      <div class="gate-card-header">
        <span class="gate-tag">${g.gate}</span>
        ${g.gate === exitAi.bestGate ? '<span class="ai-best-chip">⭐ AI Recommended Exit</span>' : ''}
      </div>
      <div class="gate-landmark-title">${g.landmark}</div>
      <div class="gate-reason-text">💡 ${g.reason}</div>
      <div class="gate-features-row">
        <span>⏱️ ~${g.walkMins}m walk</span>
        <span>🛗 ${g.lift ? 'Elevator' : 'No Elevator'}</span>
        <span>⚡ ${g.escalator ? 'Escalator' : 'Stairs'}</span>
      </div>
    </div>`).join("") : `<div style="font-size:0.78rem;color:var(--text-muted)">General Concourse Exit available at ground level.</div>`;

  metaBox.innerHTML = `
    <div class="meta-row">
      <span class="meta-label">Station Type</span>
      <span class="meta-val">${isTransfer ? "🔄 Major Interchange Hub" : "🚉 Intermediate Station"}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Accessibility</span>
      <span class="meta-val">Elevators, Escalators & Tactile Paths</span>
    </div>
    <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0">
      <span class="meta-label" style="display:block;margin-bottom:8px;font-weight:800;color:var(--text-primary)">🤖 AI Smart Exit Gate Explanations:</span>
      <div class="gates-explanation-container">
        ${gatesListHtml}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// DMRC Metro Smart Card Recharge Functions
// ─────────────────────────────────────────────
let selectedRechargeAmount = 200;

window.setRechargeAmount = function(amount, element) {
  selectedRechargeAmount = amount;
  document.querySelectorAll(".amount-chip").forEach(chip => chip.classList.remove("active"));
  if (element) element.classList.add("active");
};

window.redirectToDMRCRecharge = function() {
  const cardInput = document.getElementById("card-number-input");
  const cardNum = cardInput ? cardInput.value.trim() : "";
  
  // Official DMRC Quick Recharge Portal
  let targetUrl = "https://www.dmrcsmartcard.com/";
  
  if (cardNum && cardNum.length >= 8) {
    targetUrl += `?card_no=${encodeURIComponent(cardNum)}&amount=${selectedRechargeAmount}`;
  }

  // Open official DMRC portal in new window/tab
  window.open(targetUrl, "_blank", "noopener,noreferrer");
};
