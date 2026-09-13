/* Static deployments have no Java API. Keep the checked-in network available. */
async function fetchStationNetwork() {
  try {
    return await fetchLiveStationNetwork();
  } catch (liveError) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch("data/stations.json", {
        signal: controller.signal,
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("Bundled station network unavailable");
      const data = await response.json();
      if (!data.success || !Array.isArray(data.stations) ||
          !data.stations.length || !data.lineRoutes ||
          !Object.keys(data.lineRoutes).length) {
        throw new Error("Invalid bundled station network");
      }
      return { ...data, source: "bundled" };
    } catch (fallbackError) {
      throw new Error("Stations could not load from the server or bundled network. Check your connection and try again.");
    } finally {
      clearTimeout(timeout);
    }
  }
}
/* Local startup dependencies and a retryable, bounded network request. */
let startupPending = false;
async function fetchLiveStationNetwork() {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch("/api/stations", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(
          "The metro server is unavailable. Check that it is running, then try again.",
        );
      if (
        !(response.headers.get("content-type") || "").includes(
          "application/json",
        )
      ) {
        throw new Error(
          "This page is not connected to the Java metro server. Open the app through its server to load stations.",
        );
      }
      const data = await response.json();
      if (
        !data.success ||
        !Array.isArray(data.stations) ||
        !data.stations.length
      ) {
        throw new Error(
          "The server returned no station network. Please try again.",
        );
      }
      return data;
    } catch (error) {
      const transient =
        error.name === "AbortError" || error instanceof TypeError;
      if (!transient || attempt === 1) {
        if (transient)
          throw new Error(
            "The metro server did not respond. Check your connection and try again.",
          );
        throw error;
      }
      document.getElementById("startup-status").textContent =
        "Connection interrupted. Retrying station loading…";
    } finally {
      clearTimeout(timeout);
    }
  }
}
async function retryStartup() {
  if (startupPending) return;
  startupPending = true;
  const screen = document.getElementById("startup-screen");
  screen.hidden = false;
  screen.classList.remove("startup-error");
  document.getElementById("site-content").inert = true;
  document.getElementById("startup-status").textContent =
    "Loading the station network and route planner.";
  document.getElementById("startup-retry").hidden = true;
  document.getElementById("startup-continue").hidden = true;
  try {
    if (!window.L)
      throw new Error(
        "The local map files could not load. Refresh the page to retry.",
      );
    if (!map) initMap();
    await loadStationsFromJava();
  } catch (error) {
    showStartupError(error.message);
  } finally {
    startupPending = false;
  }
}
function dismissStartup() {
  const screen = document.getElementById("startup-screen");
  const hadFocus = screen.contains(document.activeElement);
  screen.hidden = true;
  document.getElementById("site-content").inert = false;
  if (hadFocus)
    document.getElementById("tab-planner").focus({ preventScroll: true });
}
function showStartupError(message) {
  document.getElementById("startup-status").textContent = message;
  document.getElementById("startup-screen").classList.add("startup-error");
  document.getElementById("startup-retry").hidden = false;
  document.getElementById("startup-continue").hidden = false;
}
function initMagnificationDock() {
  const dock = document.querySelector(".magnification-dock");
  const buttons = [...dock.querySelectorAll(".dock-item")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const states = buttons.map((button) => ({
    button,
    value: 1,
    velocity: 0,
    target: 1,
  }));
  let frame = 0,
    lastTime = 0;
  function tick(time) {
    const dt = Math.min((time - lastTime) / 1000 || 1 / 60, 1 / 30);
    lastTime = time;
    let moving = false;
    for (const state of states) {
      // Critically damped spring carries current position and velocity on retarget.
      state.velocity +=
        ((state.target - state.value) * 240 - state.velocity * 31) * dt;
      state.value += state.velocity * dt;
      if (
        Math.abs(state.target - state.value) < 0.001 &&
        Math.abs(state.velocity) < 0.001
      ) {
        state.value = state.target;
        state.velocity = 0;
      } else moving = true;
      state.button.style.setProperty("--dock-scale", state.value);
      state.button.style.setProperty(
        "--dock-rise",
        `${(-10 * (state.value - 1)) / 0.3}px`,
      );
    }
    frame = moving ? requestAnimationFrame(tick) : 0;
  }
  function update(mouseX, focused = -1) {
    states.forEach((state, index) => {
      const rect = state.button.getBoundingClientRect();
      const proximity = Math.max(
        0,
        1 - Math.abs(mouseX - (rect.left + rect.width / 2)) / 130,
      );
      state.target =
        reduced.matches || !fine.matches
          ? 1
          : 1 + 0.3 * (focused === index ? 1 : proximity);
    });
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  dock.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") update(e.clientX);
  });
  dock.addEventListener("pointerleave", () => update(Infinity));
  dock.addEventListener("focusin", (e) =>
    update(Infinity, buttons.indexOf(e.target.closest("button"))),
  );
  dock.addEventListener("focusout", () => update(Infinity));
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      states.forEach((s) => {
        s.value = s.target = 1;
        s.velocity = 0;
        s.button.style.setProperty("--dock-scale", 1);
        s.button.style.setProperty("--dock-rise", "0px");
      });
    }
  });
  dock.addEventListener("keydown", (e) => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (e.key === "ArrowRight") next = (index + 1) % buttons.length;
    if (e.key === "ArrowLeft")
      next = (index + buttons.length - 1) % buttons.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = buttons.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      buttons[next].click();
      buttons[next].focus();
    }
  });
}
