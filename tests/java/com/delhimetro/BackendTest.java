package com.delhimetro;

import com.delhimetro.server.DelhiMetroServer;
import com.delhimetro.server.Json;
import com.delhimetro.service.MetroDatabase;
import com.delhimetro.service.DijkstraRoutingService;
import java.net.*;
import java.net.http.*;
import java.util.*;

/** Dependency-free integration tests executed by the Java build. */
public class BackendTest {
    private static int checks;
    private static void check(boolean condition, String message) {
        checks++;
        if (!condition) throw new AssertionError(message);
    }
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        MetroDatabase db = new MetroDatabase();
        DijkstraRoutingService router = new DijkstraRoutingService(db);
        for (String preference : List.of("fastest", "fewest_interchanges")) {
            for (String destination : db.getAllStations().keySet()) {
                if (destination.equals("rajiv_chowk")) continue;
                var route = router.findRoute("rajiv_chowk", destination, preference);
                check(!route.containsKey("error"), "Connected station " + destination);
                var path = (List<String>) route.get("pathStationIds");
                var roadmap = (List<Map<String, Object>>) route.get("roadmap");
                check(path.size() == roadmap.size(), "Every stop has roadmap metadata");
                check(path.size() - 1 == (int) route.get("totalStops"), "Stop count");
                for (int i = 1; i < path.size(); i++) {
                    final String from = path.get(i - 1), to = path.get(i);
                    check(db.getLineStationsMap().values().stream().anyMatch(line -> {
                        int a = line.indexOf(from), b = line.indexOf(to);
                        return a >= 0 && b >= 0 && Math.abs(a - b) == 1;
                    }), "Adjacent stations " + from + " / " + to);
                }
                var fewest = router.findRoute("rajiv_chowk", destination, "fewest_interchanges");
                check((int) fewest.get("transfers") <= (int) route.get("transfers"), "Fewest transfers objective");
            }
        }
        check(router.findRoute("bad", "vaishali", "fastest").containsKey("error"), "Invalid station");
        check(router.findRoute("vaishali", "vaishali", "fastest").containsKey("error"), "Same station");
        check(router.findRoute("vaishali", "hauz_khas", "invalid").containsKey("error"), "Invalid preference");
        check((int) router.findRoute("vaishali", "rajiv_chowk", "fastest").get("transfers") == 0, "Blue branch is not a line change");
        var cross = router.findRoute("vaishali", "hauz_khas", "fastest");
        var transfers = (List<Map<String, Object>>) cross.get("interchanges");
        check(transfers.size() == 1 && transfers.get(0).get("stationId").equals("rajiv_chowk"), "Correct interchange");
        MetroDatabase synthetic = new MetroDatabase();
        synthetic.getAllStations().clear();
        synthetic.getLineStationsMap().clear();
        // A very slow direct train must beat a fast transfer for fewest changes.
        String[] ids = {"a", "b", "c", "d", "isolated"};
        double[] lng = {77.0, 79.0, 77.02, 77.01, 77.3};
        for (int i = 0; i < ids.length; i++) synthetic.getAllStations().put(ids[i],
            new com.delhimetro.model.Station(ids[i], ids[i], 28.6, lng[i], List.of("Direct"), "06:00", "23:00", false));
        synthetic.getLineStationsMap().put("Direct", List.of("a", "b", "c"));
        synthetic.getLineStationsMap().put("First", List.of("a", "d"));
        synthetic.getLineStationsMap().put("Second", List.of("d", "c"));
        DijkstraRoutingService syntheticRouter = new DijkstraRoutingService(synthetic);
        check((int) syntheticRouter.findRoute("a", "c", "fewest_interchanges").get("transfers") == 0, "Direct service wins even when far slower");
        check((int) syntheticRouter.findRoute("a", "c", "fastest").get("transfers") == 1, "Fastest service may change trains");
        check(syntheticRouter.findRoute("a", "isolated", "fastest").containsKey("error"), "Disconnected destination");
        Locale original = Locale.getDefault();
        try {
            Locale.setDefault(Locale.GERMANY);
            check(db.getAllStations().get("rajiv_chowk").toJson().contains("28.6328"), "Station JSON is locale independent");
        } finally { Locale.setDefault(original); }
        check(Json.encode("a\n\t\"\\\u0001").equals("\"a\\n\\t\\\"\\\\\\u0001\""), "JSON escapes control characters");
        try (DelhiMetroServer app = new DelhiMetroServer(0); HttpClient client = HttpClient.newHttpClient()) {
            app.start();
            String base = "http://127.0.0.1:" + app.port();
            for (String path : List.of("/", "/styles.css", "/journey-companion.js", "/data/stations.json", "/vendor/leaflet/leaflet.js", "/api/health", "/api/stations", "/api/route?from=vaishali&to=hauz_khas", "/api/exit-recommendation?station=rajiv_chowk")) {
                var response = client.send(HttpRequest.newBuilder(URI.create(base + path)).GET().build(), HttpResponse.BodyHandlers.ofString());
                check(response.statusCode() == 200, "Served " + path);
                if (path.startsWith("/api/")) check(response.headers().firstValue("Content-Type").orElse("").contains("application/json"), "JSON API");
                if (path.startsWith("/api/route")) check(response.body().contains("\"source\":\"java\""), "Java route source");
            }
            for (String path : List.of("/api/missing", "/missing.js", "/.git/config", "/src/com/delhimetro/Main.java", "/%2e%2e/README.md")) {
                check(client.send(HttpRequest.newBuilder(URI.create(base + path)).GET().build(), HttpResponse.BodyHandlers.ofString()).statusCode() == 404, "Missing or private path " + path);
            }
            for (String path : List.of("/api/route", "/api/route?from=nope&to=vaishali", "/api/route?from=vaishali&to=vaishali", "/api/route?from=vaishali&to=hauz_khas&pref=no", "/api/exit-recommendation?station=nope")) {
                check(client.send(HttpRequest.newBuilder(URI.create(base + path)).GET().build(), HttpResponse.BodyHandlers.ofString()).statusCode() == 400, "Invalid request " + path);
            }
            check(client.send(HttpRequest.newBuilder(URI.create(base + "/api/stations")).POST(HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString()).statusCode() == 405, "HTTP method validation");
            check(client.send(HttpRequest.newBuilder(URI.create(base + "/api/card-recharge")).POST(HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString()).statusCode() == 200, "Recharge redirect only");
        }
        System.out.println("Java backend: " + checks + " checks passed");
    }
}
