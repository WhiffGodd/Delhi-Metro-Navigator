package com.delhimetro.server;

import com.delhimetro.service.*;
import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

/** Same-origin Java 21 API and packaged web application. */
public final class DelhiMetroServer implements AutoCloseable {
    private final MetroDatabase database = new MetroDatabase();
    private final DijkstraRoutingService routing = new DijkstraRoutingService(database);
    private final AISmartExitService exits = new AISmartExitService(database);
    private final HttpServer server;
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    public DelhiMetroServer(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 128);
        server.createContext("/", this::handle);
        server.setExecutor(executor);
    }
    public void start() { server.start(); }
    public int port() { return server.getAddress().getPort(); }
    @Override public void close() { server.stop(1); executor.close(); }

    public static void main(String[] args) throws IOException {
        String configured = System.getProperty("metro.port", System.getenv().getOrDefault("PORT", "8080"));
        int port = Integer.parseInt(configured);
        if (port < 1 || port > 65535) throw new IllegalArgumentException("PORT must be between 1 and 65535");
        DelhiMetroServer app = new DelhiMetroServer(port);
        Runtime.getRuntime().addShutdownHook(new Thread(app::close));
        app.start();
        System.out.println("Delhi Metro Navigator (Java 21): http://localhost:" + app.port());
    }

    private void handle(HttpExchange request) throws IOException {
        try {
            request.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
            String path = request.getRequestURI().getPath();
            String method = request.getRequestMethod();
            String expected = path.equals("/api/card-recharge") ? "POST" : "GET";
            if (!method.equals(expected)) {
                request.getResponseHeaders().set("Allow", expected);
                json(request, 405, Map.of("success", false, "error", "Method not allowed"));
                return;
            }
            if (!path.startsWith("/api/")) { staticFile(request, path); return; }
            request.getResponseHeaders().set("Cache-Control", "no-store");
            Map<String, String> params = query(request.getRequestURI().getRawQuery());
            switch (path) {
                case "/api/health" -> json(request, 200, Map.of("success", true, "status", "ok", "backend", "java", "javaVersion", Runtime.version().feature()));
                case "/api/stations" -> {
                    List<Object> stations = new ArrayList<>();
                    database.getAllStations().values().forEach(s -> stations.add(Map.of(
                        "id", s.getId(), "name", s.getName(), "lat", s.getLat(), "lng", s.getLng(),
                        "lines", s.getLines(), "firstTrain", s.getFirstTrain(), "lastTrain", s.getLastTrain(), "isInterchange", s.isInterchange())));
                    json(request, 200, Map.of("success", true, "source", "java", "stations", stations, "lineRoutes", database.getLineStationsMap(), "oneWayLines", database.getOneWayLines()));
                }
                case "/api/route" -> {
                    String from = params.get("from"), to = params.get("to");
                    if (from == null || to == null) throw new IllegalArgumentException("Origin and destination are required");
                    Map<String, Object> route = routing.findRoute(from, to, params.getOrDefault("pref", "fastest"));
                    if (route.containsKey("error")) throw new IllegalArgumentException(route.get("error").toString());
                    route.put("exitAi", exits.getExitRecommendation(to));
                    json(request, 200, Map.of("success", true, "route", route));
                }
                case "/api/exit-recommendation" -> {
                    String station = params.get("station");
                    if (station == null || !database.getAllStations().containsKey(station))
                        throw new IllegalArgumentException("Choose a valid station");
                    json(request, 200, Map.of("success", true, "exitAi", exits.getExitRecommendation(station)));
                }
                case "/api/card-recharge" -> json(request, 200, Map.of("success", true, "redirectUrl", "https://www.dmrcsmartcard.com/"));
                default -> json(request, 404, Map.of("success", false, "error", "API endpoint not found"));
            }
        } catch (IllegalArgumentException error) {
            json(request, 400, Map.of("success", false, "error", error.getMessage()));
        } catch (Exception error) {
            System.err.println("Request failed: " + error);
            json(request, 500, Map.of("success", false, "error", "The server could not complete this request"));
        } finally { request.close(); }
    }

    private void staticFile(HttpExchange request, String path) throws IOException {
        if (path.equals("/")) path = "/index.html";
        // Only packaged web resources can be served, never repository or host files.
        if (Arrays.asList(path.split("/", -1)).contains("..") || path.contains("\\") || path.indexOf('\0') >= 0) {
            json(request, 404, Map.of("success", false, "error", "File not found")); return;
        }
        try (InputStream input = getClass().getResourceAsStream("/web" + path)) {
            if (input == null) { json(request, 404, Map.of("success", false, "error", "File not found")); return; }
            String type = path.endsWith(".html") ? "text/html; charset=UTF-8" :
                path.endsWith(".css") ? "text/css; charset=UTF-8" :
                path.endsWith(".js") ? "text/javascript; charset=UTF-8" :
                path.endsWith(".json") ? "application/json; charset=UTF-8" :
                path.endsWith(".png") ? "image/png" : "application/octet-stream";
            request.getResponseHeaders().set("Cache-Control", "no-cache");
            byte[] bytes = input.readAllBytes();
            request.getResponseHeaders().set("Content-Type", type);
            request.sendResponseHeaders(200, bytes.length);
            request.getResponseBody().write(bytes);
        }
    }
    private static Map<String, String> query(String raw) {
        Map<String, String> params = new HashMap<>();
        if (raw != null) for (String item : raw.split("&")) {
            String[] pair = item.split("=", 2);
            params.put(URLDecoder.decode(pair[0], StandardCharsets.UTF_8),
                pair.length == 2 ? URLDecoder.decode(pair[1], StandardCharsets.UTF_8) : "");
        }
        return params;
    }
    private static void json(HttpExchange request, int status, Object body) throws IOException {
        byte[] bytes = Json.encode(body).getBytes(StandardCharsets.UTF_8);
        request.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        request.sendResponseHeaders(status, bytes.length);
        request.getResponseBody().write(bytes);
    }
}
