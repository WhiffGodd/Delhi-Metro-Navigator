class MetroSimulation {
  constructor(metroData) {
    this.metroData = metroData;
    this.currentCity = "delhi";
    this.simSpeed = 1; // 1x, 2x, 5x, 10x, 30x
    this.activeTrains = [];
    this.alerts = [];
    
    // Set initial simulated clock to 08:15 AM to let the user watch the morning rush build up
    this.simTime = new Date();
    this.simTime.setHours(8, 15, 0, 0);
    
    this.lastTick = Date.now();
    this.stationDwellTime = 20; // seconds a train stops at intermediate stations
    this.terminalDwellTime = 60; // seconds a train stops at terminals before reversing
    this.listeners = [];
    
    // Station crowd states
    this.stationStates = {};

    // Initialize Delhi Metro
    this.initializeCity(this.currentCity);
    
    // Start simulation loop
    this.startLoop();
  }

  // Subscribe to simulation updates
  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb({
      trains: this.getActiveTrains(),
      time: this.simTime,
      alerts: this.alerts,
      stationStates: this.stationStates
    }));
  }

  // Initialize all lines for a specific city
  initializeCity(cityId) {
    this.currentCity = cityId;
    this.activeTrains = [];
    this.alerts = [];
    this.stationStates = {};
    
    const city = this.metroData[cityId];
    if (!city) return;

    // Initialize Station States first
    city.lines.forEach(line => {
      line.stations.forEach(station => {
        if (!this.stationStates[station.name]) {
          this.stationStates[station.name] = {
            name: station.name,
            crowdWeight: station.crowdWeight || 1.0,
            crowdPercent: 20,
            crowdLevel: "empty",
            wifiDensity: 12,
            aiCctvCount: 8,
            userReports: [] // elements: { timestamp: Date, level: String, value: Number }
          };
        }
      });
    });

    // Run first calculation of crowd levels
    this.updateStationCrowdLevels();

    city.lines.forEach(line => {
      const stations = line.stations;
      const S = stations.length;
      if (S < 2) return;

      // Calculate round-trip time
      let oneWayTravelTime = 0;
      for (let i = 1; i < S; i++) {
        oneWayTravelTime += stations[i].travelTime;
      }
      
      const oneWayDwells = (S - 2) * this.stationDwellTime + this.terminalDwellTime;
      const roundTripTime = (oneWayTravelTime + oneWayDwells) * 2;

      // Number of trains to spawn based on headway
      const headway = line.headway;
      const numTrains = Math.max(2, Math.round(roundTripTime / headway));

      // Spawn trains evenly spaced
      for (let k = 0; k < numTrains; k++) {
        const offsetSeconds = k * (roundTripTime / numTrains);
        const direction = k % 2 === 0 ? "up" : "down";
        
        // Spawn train at starting terminal
        const train = {
          id: `${cityId}-${line.id}-${direction}-${k}`,
          city: cityId,
          lineId: line.id,
          lineName: line.name,
          lineColor: line.color,
          direction: direction,
          name: `${line.name.substring(0, 2).toUpperCase()}-${100 + k}`,
          currentStationIndex: direction === "up" ? 0 : S - 1,
          nextStationIndex: direction === "up" ? 1 : S - 2,
          state: "stopping", // "moving" or "stopping"
          elapsedInSegment: 0,
          segmentDuration: this.terminalDwellTime,
          delay: 0,
          coords: [...stations[direction === "up" ? 0 : S - 1].coords],
          speed: 0,
          crowdPercent: 20,
          crowdLevel: "empty"
        };

        // Fast-forward this train by its offset to distribute it naturally
        this.fastForwardTrain(train, offsetSeconds, stations);
        this.activeTrains.push(train);
      }
    });

    // Run train crowd levels calculation
    this.updateTrainCrowdLevels();

    // Add initial info alert
    this.alerts.unshift({
      id: Date.now(),
      city: cityId,
      message: "Simulation running. Train positions and crowd data are estimated — not live DMRC data.",
      timestamp: new Date(this.simTime),
      type: "info"
    });
  }

  // Advance a single train's state by seconds (used during initialization)
  fastForwardTrain(train, seconds, stations) {
    const dt = 2; // 2 seconds steps
    let remaining = seconds;
    
    while (remaining > 0) {
      const step = Math.min(dt, remaining);
      this.updateTrainState(train, step, stations);
      remaining -= step;
    }
  }

  // Update loop
  startLoop() {
    setInterval(() => {
      const now = Date.now();
      const deltaMs = now - this.lastTick;
      this.lastTick = now;

      // Calculate time step in seconds including simulation speed multiplier
      const dt = (deltaMs / 1000) * this.simSpeed;

      // Update simulated clock
      this.simTime.setTime(this.simTime.getTime() + dt * 1000);

      // Update stations crowding
      this.updateStationCrowdLevels();

      // Update all trains positions
      const city = this.metroData[this.currentCity];
      if (city) {
        this.activeTrains.forEach(train => {
          const line = city.lines.find(l => l.id === train.lineId);
          if (line) {
            this.updateTrainState(train, dt, line.stations);
          }
        });
      }

      // Update train crowding levels based on stations passed
      this.updateTrainCrowdLevels();

      // Periodically trigger random delay alerts
      if (Math.random() < 0.0004 * this.simSpeed) {
        this.triggerRandomDelay();
      }

      // Clean old user reports (older than 10 simulated minutes)
      this.cleanOldReports();

      this.notify();
    }, 200); // 5Hz ticks
  }

  // Update an individual train state by dt seconds
  updateTrainState(train, dt, stations) {
    if (train.delay > 0) {
      train.delay = Math.max(0, train.delay - dt);
      train.speed = 0;
      return;
    }

    train.elapsedInSegment += dt;

    if (train.state === "stopping") {
      train.speed = 0;
      train.coords = [...stations[train.currentStationIndex].coords];

      if (train.elapsedInSegment >= train.segmentDuration) {
        train.state = "moving";
        train.elapsedInSegment -= train.segmentDuration;
        
        const fromIdx = train.currentStationIndex;
        const toIdx = train.nextStationIndex;
        train.segmentDuration = stations[Math.max(fromIdx, toIdx)].travelTime;
      }
    }

    if (train.state === "moving") {
      const fromCoords = stations[train.currentStationIndex].coords;
      const toCoords = stations[train.nextStationIndex].coords;

      if (train.elapsedInSegment >= train.segmentDuration) {
        train.state = "stopping";
        train.elapsedInSegment -= train.segmentDuration;
        
        train.currentStationIndex = train.nextStationIndex;
        train.coords = [...toCoords];

        const S = stations.length;
        if (train.direction === "up") {
          if (train.currentStationIndex === S - 1) {
            train.direction = "down";
            train.nextStationIndex = S - 2;
            train.segmentDuration = this.terminalDwellTime;
          } else {
            train.nextStationIndex = train.currentStationIndex + 1;
            train.segmentDuration = this.stationDwellTime;
          }
        } else {
          if (train.currentStationIndex === 0) {
            train.direction = "up";
            train.nextStationIndex = 1;
            train.segmentDuration = this.terminalDwellTime;
          } else {
            train.nextStationIndex = train.currentStationIndex - 1;
            train.segmentDuration = this.stationDwellTime;
          }
        }
      } else {
        const ratio = train.elapsedInSegment / train.segmentDuration;
        train.coords[0] = fromCoords[0] + ratio * (toCoords[0] - fromCoords[0]);
        train.coords[1] = fromCoords[1] + ratio * (toCoords[1] - fromCoords[1]);
        
        const distKm = this.getDistanceKm(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
        train.speed = Math.round((distKm / (train.segmentDuration / 3600)) * (0.85 + Math.random() * 0.3));
      }
    }
  }

  // Calculate and update crowd levels for all stations based on simulated time
  updateStationCrowdLevels() {
    const hour = this.simTime.getHours();
    const min = this.simTime.getMinutes();
    const t = hour + min / 60;

    // Piecewise math to simulate morning rush (peaking at 9:00 AM) and evening rush (peaking at 6:30 PM)
    const morningRush = Math.exp(-Math.pow(t - 9.0, 2) / 1.5); // Peak at 9:00
    const eveningRush = Math.exp(-Math.pow(t - 18.5, 2) / 1.8); // Peak at 6:30 PM
    
    // Base normal load level
    const baseNormalLoad = 0.22;
    
    // Aggregate global load curve
    const globalLoad = baseNormalLoad + 0.52 * morningRush + 0.58 * eveningRush; // Max ~0.95

    Object.keys(this.stationStates).forEach(name => {
      const state = this.stationStates[name];
      
      // Calculate station load (weighted by station specific density, e.g. Rajiv Chowk gets packed)
      let stationLoad = globalLoad * state.crowdWeight;
      
      // Inject slight random noise to simulate micro fluctuation of crowd movement
      const noise = (Math.sin(t * 12 + name.charCodeAt(0)) * 0.04);
      stationLoad = Math.max(0.05, Math.min(1.0, stationLoad + noise));

      // Integrate user reports if present
      if (state.userReports.length > 0) {
        const reportAvg = state.userReports.reduce((sum, r) => sum + r.value, 0) / state.userReports.length;
        // Blend reports with simulated sensors: 60% report weight, 40% simulation weight
        stationLoad = (stationLoad * 4 + reportAvg * 6) / 10;
      }

      // Convert to metrics
      state.crowdPercent = Math.round(stationLoad * 100);
      state.wifiDensity = Math.round(stationLoad * 180 * (0.85 + Math.random() * 0.3));
      state.aiCctvCount = Math.round(stationLoad * 140 * (0.9 + Math.random() * 0.2));

      // Determine level text
      if (state.crowdPercent < 25) {
        state.crowdLevel = "empty";
      } else if (state.crowdPercent < 55) {
        state.crowdLevel = "moderate";
      } else if (state.crowdPercent < 80) {
        state.crowdLevel = "crowded";
      } else {
        state.crowdLevel = "very_crowded";
      }
    });
  }

  // Update crowd levels of trains based on stations they travel between
  updateTrainCrowdLevels() {
    const city = this.metroData[this.currentCity];
    if (!city) return;

    this.activeTrains.forEach(train => {
      const line = city.lines.find(l => l.id === train.lineId);
      if (!line) return;

      const currentStationName = line.stations[train.currentStationIndex].name;
      const nextStationName = line.stations[train.nextStationIndex].name;

      const s1 = this.stationStates[currentStationName];
      const s2 = this.stationStates[nextStationName];

      if (s1 && s2) {
        // Train crowding is modeled as the average crowding of its surrounding stations
        let avgPercent = (s1.crowdPercent + s2.crowdPercent) / 2;
        
        // Add a slight multiplier effect if train is stuck in a delay
        if (train.delay > 0) {
          avgPercent = Math.min(100, avgPercent + 10);
        }

        train.crowdPercent = Math.round(avgPercent);
        
        if (train.crowdPercent < 25) {
          train.crowdLevel = "empty";
        } else if (train.crowdPercent < 55) {
          train.crowdLevel = "moderate";
        } else if (train.crowdPercent < 80) {
          train.crowdLevel = "crowded";
        } else {
          train.crowdLevel = "very_crowded";
        }
      }
    });
  }

  // Submit user crowd report
  submitUserReport(stationName, levelText) {
    const state = this.stationStates[stationName];
    if (!state) return;

    // Map label to numeric value (0 to 1)
    let val = 0.2;
    if (levelText === "empty") val = 0.15;
    else if (levelText === "moderate") val = 0.45;
    else if (levelText === "crowded") val = 0.75;
    else if (levelText === "very_crowded") val = 0.98;

    const report = {
      timestamp: new Date(this.simTime),
      level: levelText,
      value: val
    };

    state.userReports.push(report);

    // Format readable level name
    const levelNames = {
      "empty": "Empty",
      "moderate": "Moderate Density",
      "crowded": "Crowded",
      "very_crowded": "Very Crowded"
    };

    // Add alert feed notification
    this.alerts.unshift({
      id: Date.now(),
      city: this.currentCity,
      message: `User report: ${stationName} — crowd level '${levelNames[levelText]}'. Simulation adjusted.`,
      timestamp: new Date(this.simTime),
      type: "info"
    });

    if (this.alerts.length > 25) this.alerts.pop();

    // Trigger immediate recalculation
    this.updateStationCrowdLevels();
    this.updateTrainCrowdLevels();
    this.notify();
  }

  // Clear reports older than 10 simulated minutes to keep crowd status dynamic
  cleanOldReports() {
    Object.keys(this.stationStates).forEach(name => {
      const state = this.stationStates[name];
      state.userReports = state.userReports.filter(report => {
        const ageMs = this.simTime - report.timestamp;
        return ageMs < 10 * 60 * 1000; // 10 minutes in milliseconds
      });
    });
  }

  // Set speed
  setSpeed(speed) {
    this.simSpeed = speed;
  }

  // Get active trains
  getActiveTrains() {
    return this.activeTrains;
  }

  // Inject manual delay
  injectDelay(trainId, delaySeconds) {
    const train = this.activeTrains.find(t => t.id === trainId);
    if (!train) return;

    train.delay = (train.delay || 0) + delaySeconds;
    
    const alert = {
      id: Date.now(),
      city: this.currentCity,
      lineId: train.lineId,
      trainName: train.name,
      message: `Delay Alert: Train ${train.name} on ${train.lineName} delayed by ${Math.round(delaySeconds / 60)} mins due to simulated signal congestion.`,
      timestamp: new Date(this.simTime),
      type: "delay"
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 20) this.alerts.pop();

    this.notify();
  }

  // Trigger random delay
  triggerRandomDelay() {
    if (this.activeTrains.length === 0) return;
    const randomTrain = this.activeTrains[Math.floor(Math.random() * this.activeTrains.length)];
    const delayMins = Math.floor(Math.random() * 4) + 2; // 2 to 5 mins
    this.injectDelay(randomTrain.id, delayMins * 60);
  }

  // Calculate upcoming train ETAs for a station
  getUpcomingTrainsForStation(stationName) {
    const city = this.metroData[this.currentCity];
    if (!city) return [];

    const upcoming = [];

    this.activeTrains.forEach(train => {
      const line = city.lines.find(l => l.id === train.lineId);
      if (!line) return;

      const stations = line.stations;
      const targetIdx = stations.findIndex(s => s.name === stationName);
      if (targetIdx === -1) return;

      const S = stations.length;
      let isMovingToward = false;
      let etaSeconds = 0;
      
      if (train.direction === "up") {
        if (train.currentStationIndex < targetIdx || 
           (train.state === "moving" && train.nextStationIndex <= targetIdx)) {
          isMovingToward = true;

          let currentIdx = train.currentStationIndex;
          
          if (train.state === "moving") {
            etaSeconds += Math.max(0, train.segmentDuration - train.elapsedInSegment);
            currentIdx = train.nextStationIndex;
            if (currentIdx < targetIdx) {
              etaSeconds += this.stationDwellTime;
            }
          } else {
            etaSeconds += Math.max(0, train.segmentDuration - train.elapsedInSegment);
          }

          for (let i = currentIdx; i < targetIdx; i++) {
            etaSeconds += stations[i + 1].travelTime;
            if (i + 1 < targetIdx) {
              etaSeconds += this.stationDwellTime;
            }
          }
        }
      } else {
        if (train.currentStationIndex > targetIdx || 
           (train.state === "moving" && train.nextStationIndex >= targetIdx)) {
          isMovingToward = true;

          let currentIdx = train.currentStationIndex;
          
          if (train.state === "moving") {
            etaSeconds += Math.max(0, train.segmentDuration - train.elapsedInSegment);
            currentIdx = train.nextStationIndex;
            if (currentIdx > targetIdx) {
              etaSeconds += this.stationDwellTime;
            }
          } else {
            etaSeconds += Math.max(0, train.segmentDuration - train.elapsedInSegment);
          }

          for (let i = currentIdx; i > targetIdx; i--) {
            etaSeconds += stations[i].travelTime;
            if (i - 1 > targetIdx) {
              etaSeconds += this.stationDwellTime;
            }
          }
        }
      }

      if (isMovingToward) {
        etaSeconds += (train.delay || 0);

        upcoming.push({
          trainId: train.id,
          trainName: train.name,
          lineId: train.lineId,
          lineColor: train.lineColor,
          direction: train.direction,
          destination: stations[train.direction === "up" ? S - 1 : 0].name,
          etaSeconds: Math.round(etaSeconds),
          delay: train.delay || 0,
          state: train.state,
          crowdLevel: train.crowdLevel,
          crowdPercent: train.crowdPercent
        });
      }
    });

    return upcoming.sort((a, b) => a.etaSeconds - b.etaSeconds);
  }

  // Get Last Train details
  getLastTrainDetails(stationName) {
    const city = this.metroData[this.currentCity];
    if (!city) return null;

    const details = [];

    city.lines.forEach(line => {
      const stations = line.stations;
      const idx = stations.findIndex(s => s.name === stationName);
      if (idx === -1) return;

      const S = stations.length;

      let upTravelTime = 0;
      for (let i = 0; i < idx; i++) {
        upTravelTime += stations[i + 1].travelTime;
        if (i + 1 < idx) {
          upTravelTime += this.stationDwellTime;
        }
      }

      let downTravelTime = 0;
      for (let i = S - 1; i > idx; i--) {
        downTravelTime += stations[i].travelTime;
        if (i - 1 > idx) {
          downTravelTime += this.stationDwellTime;
        }
      }

      const [lastHour, lastMin] = line.lastTrain.split(":").map(Number);
      
      const lastTrainUpTime = new Date(this.simTime);
      lastTrainUpTime.setHours(lastHour, lastMin, 0, 0);
      lastTrainUpTime.setTime(lastTrainUpTime.getTime() + upTravelTime * 1000);

      const lastTrainDownTime = new Date(this.simTime);
      lastTrainDownTime.setHours(lastHour, lastMin, 0, 0);
      lastTrainDownTime.setTime(lastTrainDownTime.getTime() + downTravelTime * 1000);

      if (this.simTime > lastTrainUpTime) {
        lastTrainUpTime.setDate(lastTrainUpTime.getDate() + 1);
      }
      if (this.simTime > lastTrainDownTime) {
        lastTrainDownTime.setDate(lastTrainDownTime.getDate() + 1);
      }

      details.push({
        lineId: line.id,
        lineName: line.name,
        lineColor: line.color,
        up: {
          destination: stations[S - 1].name,
          time: lastTrainUpTime,
          countdownSeconds: Math.round((lastTrainUpTime - this.simTime) / 1000)
        },
        down: {
          destination: stations[0].name,
          time: lastTrainDownTime,
          countdownSeconds: Math.round((lastTrainDownTime - this.simTime) / 1000)
        }
      });
    });

    return details;
  }

  // Haversine formula
  getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetroSimulation;
} else {
  window.MetroSimulation = MetroSimulation;
}
