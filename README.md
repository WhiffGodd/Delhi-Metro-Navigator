# Delhi Metro Navigator — Java 21

A Java application that serves the Delhi Metro website and its backend together.
The browser handles the interactive map and journey companion; Java owns the
station catalogue, routing, transfers, journey roadmap, estimated fares and
station exit recommendations. No Node.js server or external framework is required.

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
