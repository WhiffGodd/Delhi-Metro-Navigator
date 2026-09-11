package com.delhimetro.service;

import com.delhimetro.model.Station;

import java.util.*;

public class DijkstraRoutingService {

    private final MetroDatabase database;

    public DijkstraRoutingService(MetroDatabase database) {
        this.database = database;
    }

    public static class Edge {
        String targetId;
        double weight;
        String line;

        public Edge(String targetId, double weight, String line) {
            this.targetId = targetId;
            this.weight = weight;
            this.line = line;
        }
    }

    public static class NodeDistance implements Comparable<NodeDistance> {
        String stationId;
        double distance;

        public NodeDistance(String stationId, double distance) {
            this.stationId = stationId;
            this.distance = distance;
        }

        @Override
        public int compareTo(NodeDistance o) {
            return Double.compare(this.distance, o.distance);
        }
    }

    public Map<String, Object> findRoute(String originId, String destId, String preference) {
        Map<String, Station> allStations = database.getAllStations();

        if (!allStations.containsKey(originId) || !allStations.containsKey(destId)) {
            return Map.of("error", "Invalid station selection");
        }

        // Build Graph Adjacency List
        Map<String, List<Edge>> graph = new HashMap<>();
        Map<String, List<String>> lineMap = database.getLineStationsMap();

        for (Map.Entry<String, List<String>> entry : lineMap.entrySet()) {
            String lineName = entry.getKey();
            List<String> stations = entry.getValue();

            for (int i = 0; i < stations.size() - 1; i++) {
                String u = stations.get(i);
                String v = stations.get(i + 1);
                Station sU = allStations.get(u);
                Station sV = allStations.get(v);

                if (sU != null && sV != null) {
                    double dist = calculateDistance(sU.getLat(), sU.getLng(), sV.getLat(), sV.getLng());
                    double timeMins = (dist / 35.0) * 60.0 + 1.2; // average 35 km/h train speed + dwell

                    graph.computeIfAbsent(u, k -> new ArrayList<>()).add(new Edge(v, timeMins, lineName));
                    graph.computeIfAbsent(v, k -> new ArrayList<>()).add(new Edge(u, timeMins, lineName));
                }
            }
        }

        // Dijkstra's Shortest Path Algorithm
        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        Map<String, String> edgeLine = new HashMap<>();
        PriorityQueue<NodeDistance> pq = new PriorityQueue<>();

        for (String id : allStations.keySet()) {
            dist.put(id, Double.MAX_VALUE);
        }

        dist.put(originId, 0.0);
        pq.add(new NodeDistance(originId, 0.0));

        while (!pq.isEmpty()) {
            NodeDistance current = pq.poll();
            String u = current.stationId;

            if (u.equals(destId)) break;
            if (current.distance > dist.get(u)) continue;

            List<Edge> neighbors = graph.getOrDefault(u, Collections.emptyList());
            for (Edge edge : neighbors) {
                String v = edge.targetId;
                double edgeWeight = edge.weight;

                // Transfer penalty for Minimum Interchanges preference
                if ("fewest_interchanges".equals(preference)) {
                    String prevLine = edgeLine.get(u);
                    if (prevLine != null && !prevLine.equals(edge.line)) {
                        edgeWeight += 12.0; // 12 mins penalty for line change
                    }
                }

                double newDist = dist.get(u) + edgeWeight;
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    edgeLine.put(v, edge.line);
                    pq.add(new NodeDistance(v, newDist));
                }
            }
        }

        // Reconstruct Path
        LinkedList<String> path = new LinkedList<>();
        String step = destId;
        while (step != null) {
            path.addFirst(step);
            step = prev.get(step);
        }

        int totalTime = (int) Math.round(dist.get(destId));
        int totalStops = Math.max(0, path.size() - 1);
        int fare = calculateFare(totalStops);

        // Build Response Map
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("originId", originId);
        result.put("destId", destId);
        result.put("originName", allStations.get(originId).getName());
        result.put("destName", allStations.get(destId).getName());
        result.put("totalTimeMins", totalTime);
        result.put("totalStops", totalStops);
        result.put("fare", fare);
        result.put("recommendedCoach", "Coach 2-3 (Optimal Platform Exit)");
        result.put("pathStationIds", path);

        return result;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private int calculateFare(int stops) {
        if (stops <= 2) return 10;
        if (stops <= 5) return 20;
        if (stops <= 12) return 30;
        if (stops <= 21) return 40;
        if (stops <= 32) return 50;
        return 60;
    }
}
