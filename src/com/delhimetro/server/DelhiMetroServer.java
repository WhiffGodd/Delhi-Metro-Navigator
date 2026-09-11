package com.delhimetro.server;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import com.delhimetro.model.Station;
import com.delhimetro.service.MetroDatabase;
import com.delhimetro.service.DijkstraRoutingService;
import com.delhimetro.service.AISmartExitService;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class DelhiMetroServer {

    private static MetroDatabase database;
    private static DijkstraRoutingService routingService;
    private static AISmartExitService exitService;

    public static void main(String[] args) throws IOException {
        int port = 8080;
        database = new MetroDatabase();
        routingService = new DijkstraRoutingService(database);
        exitService = new AISmartExitService(database);

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // Serve Static Frontend UI Files
        server.createContext("/", new StaticFileHandler());

        // API Contexts
        server.createContext("/api/stations", new StationsHandler());
        server.createContext("/api/route", new RouteHandler());
        server.createContext("/api/exit-recommendation", new ExitRecommendationHandler());
        server.createContext("/api/card-recharge", new CardRechargeHandler());

        server.setExecutor(null);
        System.out.println("=================================================");
        System.out.println("🚀 Delhi Metro Java Application Server Running!");
        System.out.println("👉 Access UI at: http://localhost:" + port);
        System.out.println("=================================================");
        server.start();
    }

    // ─────────────────────────────────────────────
    // API 1: GET /api/stations
    // ─────────────────────────────────────────────
    static class StationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, Station> stations = database.getAllStations();
            Map<String, List<String>> lineRoutes = database.getLineStationsMap();
            StringBuilder json = new StringBuilder("{\"success\":true,\"stations\":[");
            int i = 0;
            for (Station s : stations.values()) {
                json.append(s.toJson());
                if (i++ < stations.size() - 1) json.append(",");
            }
            json.append("],\"lineRoutes\":{");
            int j = 0;
            for (Map.Entry<String, List<String>> entry : lineRoutes.entrySet()) {
                json.append("\"").append(entry.getKey()).append("\":[");
                List<String> list = entry.getValue();
                for (int k = 0; k < list.size(); k++) {
                    json.append("\"").append(list.get(k)).append("\"");
                    if (k < list.size() - 1) json.append(",");
                }
                json.append("]");
                if (j++ < lineRoutes.size() - 1) json.append(",");
            }
            json.append("}}");

            sendJsonResponse(exchange, 200, json.toString());
        }
    }

    // ─────────────────────────────────────────────
    // API 2: GET /api/route?from=...&to=...&pref=...
    // ─────────────────────────────────────────────
    static class RouteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String from = params.get("from");
            String to = params.get("to");
            String pref = params.getOrDefault("pref", "fastest");

            if (from == null || to == null) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"error\":\"Origin & destination required\"}");
                return;
            }

            Map<String, Object> routeResult = routingService.findRoute(from, to, pref);
            Map<String, Object> exitAi = exitService.getExitRecommendation(to);
            routeResult.put("exitAi", exitAi);

            String responseJson = mapToJson(routeResult);
            sendJsonResponse(exchange, 200, "{\"success\":true,\"route\":" + responseJson + "}");
        }
    }

    // ─────────────────────────────────────────────
    // API 3: GET /api/exit-recommendation?station=...
    // ─────────────────────────────────────────────
    static class ExitRecommendationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String stationId = params.get("station");

            Map<String, Object> exitAi = exitService.getExitRecommendation(stationId);
            sendJsonResponse(exchange, 200, "{\"success\":true,\"exitAi\":" + mapToJson(exitAi) + "}");
        }
    }

    // ─────────────────────────────────────────────
    // API 4: POST /api/card-recharge
    // ─────────────────────────────────────────────
    static class CardRechargeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String responseJson = "{\"success\":true,\"message\":\"Directing to DMRC portal\",\"redirectUrl\":\"https://www.dmrcsmartcard.com/\"}";
            sendJsonResponse(exchange, 200, responseJson);
        }
    }

    // ─────────────────────────────────────────────
    // Static File Web Handler (Serves index.html, styles.css, app.js)
    // ─────────────────────────────────────────────
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String uri = exchange.getRequestURI().getPath();
            if (uri.equals("/")) uri = "/index.html";

            File file = new File("." + uri);
            if (!file.exists() || file.isDirectory()) {
                file = new File("./index.html");
            }

            String contentType = "text/html";
            if (uri.endsWith(".css")) contentType = "text/css";
            else if (uri.endsWith(".js")) contentType = "application/javascript";
            else if (uri.endsWith(".json")) contentType = "application/json";

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, file.length());

            try (OutputStream os = exchange.getResponseBody(); FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[4096];
                int count;
                while ((count = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, count);
                }
            }
        }
    }

    // ─────────────────────────────────────────────
    // Helper Utilities
    // ─────────────────────────────────────────────
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isEmpty()) return params;

        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1) {
                params.put(URLDecoder.decode(pair[0], StandardCharsets.UTF_8),
                           URLDecoder.decode(pair[1], StandardCharsets.UTF_8));
            }
        }
        return params;
    }

    @SuppressWarnings("unchecked")
    private static String mapToJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        int i = 0;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            sb.append("\"").append(entry.getKey()).append("\":");
            Object val = entry.getValue();

            if (val == null) {
                sb.append("null");
            } else if (val instanceof String) {
                sb.append("\"").append(val.toString().replace("\"", "\\\"")).append("\"");
            } else if (val instanceof Boolean || val instanceof Number) {
                sb.append(val);
            } else if (val instanceof List) {
                List<?> list = (List<?>) val;
                sb.append("[");
                for (int j = 0; j < list.size(); j++) {
                    Object item = list.get(j);
                    if (item instanceof Map) {
                        sb.append(mapToJson((Map<String, Object>) item));
                    } else {
                        sb.append("\"").append(item.toString().replace("\"", "\\\"")).append("\"");
                    }
                    if (j < list.size() - 1) sb.append(",");
                }
                sb.append("]");
            } else if (val instanceof Map) {
                sb.append(mapToJson((Map<String, Object>) val));
            } else {
                sb.append("\"").append(val.toString()).append("\"");
            }

            if (i++ < map.size() - 1) sb.append(",");
        }
        sb.append("}");
        return sb.toString();
    }
}
