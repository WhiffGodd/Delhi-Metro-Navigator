# NCR Metro Navigator — Java 21

A Java application for metro journeys across Delhi, Noida, Greater Noida and
Gurugram (Gurgaon), serving the website and its backend together.
The browser handles the interactive map and journey companion; Java owns the
station catalogue, routing, transfers, journey roadmap, estimated fares and
station exit recommendations. No Node.js server or external framework is required.


## NCR coverage

The catalogue now contains **260 unique stations**, retaining the existing Delhi
Metro routes and adding all **21 Aqua Line** stations and **11 Rapid Metro**
stations (Sikanderpur is shared with the existing Yellow Line).

- Aqua Line: Noida Sector 51, 50, 76, 101, 81, NSEZ, 83, 137, 142, 143,
  144, 145, 146, 147, 148, Knowledge Park II, Pari Chowk, Alpha 1, Delta 1,
  GNIDA Office and Depot Station.
- Rapid Metro: Sector 55-56, Sector 54 Chowk, Sector 53-54, Sector 42-43,
  DLF Phase 1, Sikanderpur, DLF Phase 2, Belvedere Towers, Cyber City,
  Moulsari Avenue and DLF Phase 3.
- Noida Sector 52 (Blue) and Sector 51 (Aqua) are connected by an explicitly
  labelled walk, with an **estimated eight-minute allowance**, separate paid
  areas and onward ticket guidance. A walking hop is not counted as a train stop.
- Rapid Metro's loop runs Phase 2 → Belvedere Towers → Cyber City →
  Moulsari Avenue → Phase 3 → Phase 2; routing respects this direction.
  `oneWayLines` accompanies `lineRoutes` in both the API and bundled network.
  The `Walking transfer` topology entry is a pedestrian connection, not a train.
- Journey roadmaps show every intermediate station. Search supports line names,
  Greater Noida, Gurugram and Gurgaon aliases. Aqua/Rapid fares are left unset
  (`fare: null`) with operator guidance; no combined fare is fabricated.
- New station first/last trains say “Check operator”; missing exit information
  does not invent a gate or accessibility facilities. Travel times remain estimates.

Sources checked 20 September 2026:
[NMRC station list](https://www.nmrcnoida.com/Content/pdf/policy2202019_Annexure1.pdf),
[DMRC operational network map](https://delhimetrorail.com/static/media/DMRC-Network-Map_Jan2026_Hindi-English-13.03.2026.147097c4.pdf),
[NMRC upcoming projects](https://www.nmrcnoida.com/Projects/Upcoming-projects).
Station marker coordinates were cross-checked against the corresponding
Wikipedia station pages; they are approximate map locations, not exit locations.
[Phase 2 service directions](https://en.wikipedia.org/wiki/Phase_2_metro_station)
provide the Rapid loop topology. Planned Greater Noida West/Boraki extensions
and planned Gurugram routes are not represented as operating services. The
existing Delhi catalogue is retained; this expansion is not a claim of a complete
2026 audit of every Delhi line.

## Build and run

Install a **JDK 21 or newer**, then run these commands from the repository root:

```sh
java scripts/Build.java --test
java -jar build/delhi-metro.jar
```

Open **http://localhost:8080**. Stop the server with Ctrl+C.
The first command compiles Java, runs backend tests and packages the browser
assets into `build/delhi-metro.jar`. This JAR runs from any directory; it does not
need the source repository next to it. Rebuild after changing source or UI files.

Use a different port with `java "-Dmetro.port=9090" -jar build/delhi-metro.jar`.
Hosting platforms can supply the `PORT` environment variable (default: 8080).
`metro.port` takes precedence. Invalid port settings stop startup with an error.

## Java architecture

- `Main`: application entry point.
- `server/DelhiMetroServer`: same-origin HTTP APIs, packaged static assets,
  Java 21 virtual-thread request handling and graceful shutdown.
- `server/Json`: JSON serialization, including control-character escaping.
- `service/MetroDatabase`: in-memory station, line and exit catalogue.
- `service/DijkstraRoutingService`: tracks both station and arriving line.
  Fastest routes minimise estimated minutes including five minutes per transfer.
  Fewest-transfer routes minimise transfers first, then estimated time.
- `service/AISmartExitService`: rule-based suggestions from the existing exit data;
  despite the legacy class name, this is not a trained AI model.
- `model`: Java station and exit-gate data classes.
- `scripts/Build.java`: portable build and packaging using only the JDK.

HTML and CSS define the website. JavaScript is needed for Leaflet, station search,
API requests and manual journey progress. A JavaScript router remains as an
outage/static-host fallback and is instantiated only when needed. On the Java
server, station responses identify `source: java`, and routes include Java-built
roadmap, legs and transfer metadata.

The existing data is an in-memory catalogue, not live train tracking or a user
account database. Fare/time figures are estimates from the existing stop-based
fare model and average speed. Confirm fares, station exits and accessibility
against official station information. Card recharge only links to the DMRC portal;
this application does not process payments.

## API

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/health` | Backend health and Java version |
| GET | `/api/stations` | Station catalogue and ordered line topology |
| GET | `/api/route?from=vaishali&to=hauz_khas&pref=fastest` | Java route, all intermediate stations, legs and transfers |
| GET | `/api/exit-recommendation?station=rajiv_chowk` | Exit guidance from bundled catalogue |
| POST | `/api/card-recharge` | Official recharge portal URL |

Route preference is `fastest` or `fewest_interchanges`. Invalid requests return
HTTP 400, unsupported methods 405, and unknown resources 404. Only packaged web
assets are public; Java sources, repository files and host files are not served.
The site and backend share one origin and do not require CORS configuration.

## Deployment

Deploy the whole application to a host that supports **Java 21** or **Docker**.
Configure its health check as `/api/health` and expose the configured port.

```sh
docker build -t delhi-metro .
docker run --rm -p 8080:8080 delhi-metro
```

The multi-stage Dockerfile builds and tests the application, then runs the JAR
with a Java 21 runtime as a non-root user. Alternatively, upload the JAR built by
GitHub Actions and launch it with `java -jar delhi-metro.jar`.

The existing `vercel.json` is a **static preview configuration**. That deployment
uses the browser fallback and does not start this Java backend. To enable the full
backend, publish the Java/Docker application and use its URL for the site.

## Tests

```sh
java scripts/Build.java --test
node --test tests/*.test.cjs
```

Java tests exercise routes to every station, path adjacency, route preferences,
Blue Line branch continuity, roadmap completeness, API validation, JSON escaping
and static-asset isolation. Node tests cover the optional browser fallback and
journey companion. GitHub Actions runs both and uploads the executable JAR.

With Playwright and Chromium installed, `node tests/browser/map-pan.cjs` checks
line visibility during upward/downward drags in desktop/mobile layouts. Set
`BROWSER_CHANNEL=msedge` to use an installed Edge browser.

## Journey companion

Plan a trip and select **Start my journey**. Tap **Reached next stop** when you
arrive at each station to see your next stop, remaining stops and approaching
transfer reminders. **Previous stop** corrects an accidental tap; **Reset** starts
over. New routes reset progress. This is manual tracking, not GPS or live train
data; refreshing the page clears progress.

The roadmap uses charcoal and sand colours with metro line colours for the tracks.
All stations are shown by default. Metro paths remain drawn during panning, and
the map resizes with the journey panel.

## Updating station data

Update `MetroDatabase.java`, rebuild, then export the static fallback catalogue:

```sh
java -cp build/delhi-metro.jar scripts/ExportStationNetwork.java
```

Commit `data/stations.json` alongside database changes and rebuild the JAR to
include the updated fallback. Compiled classes and build output are ignored.

### Railway deployment

`railway.json` selects the existing Dockerfile and checks `/api/health` before
accepting a deployment. Connect this repository's `main` branch to a Railway
service with the repository root as its source directory. The Docker image starts
the Java application using the host-provided `PORT`; no extra start command is
needed. Generate a public domain for the service after it becomes healthy.

Verify `/api/health` returns `backend: java`, `/api/stations` returns
`source: java`, and a planned route contains `source: java`. Open the public URL
and test a journey from Vaishali to Hauz Khas before replacing any existing link.
