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

        // Determine line for each segment (path[i] -> path[i+1])
        List<String> segmentLines = new ArrayList<>();
        for (int i = 0; i < path.size() - 1; i++) {
            String u = path.get(i);
            String v = path.get(i + 1);
            String line = null;
            String recorded = edgeLine.get(v);
            List<Edge> edges = graph.getOrDefault(u, Collections.emptyList());
            for (Edge e : edges) {
                if (e.targetId.equals(v)) {
                    if (recorded != null && e.line.equals(recorded)) {
                        line = e.line;
                        break;
                    } else if (line == null) {
                        line = e.line;
                    }
                }
            }
            if (line == null) line = (recorded != null) ? recorded : "Metro Line";
            segmentLines.add(line);
        }

        // Build Journey Legs & Station-by-Station Roadmap
        List<Map<String, Object>> legs = new ArrayList<>();
        List<Map<String, Object>> interchanges = new ArrayList<>();
        List<Map<String, Object>> roadmap = new ArrayList<>();

        if (!path.isEmpty()) {
            // 1. Group into distinct Journey Legs
            int legStart = 0;
            for (int i = 0; i < segmentLines.size(); i++) {
                boolean isLastSegment = (i == segmentLines.size() - 1);
                boolean lineChangesNext = !isLastSegment && !segmentLines.get(i).equals(segmentLines.get(i + 1));

                if (isLastSegment || lineChangesNext) {
                    String currentLine = segmentLines.get(i);
                    String fromStationId = path.get(legStart);
                    String toStationId = path.get(i + 1);

                    String direction = getLineDirection(currentLine, fromStationId, toStationId, lineMap, allStations);

                    List<String> legStationIds = new ArrayList<>();
                    List<String> legStationNames = new ArrayList<>();
                    for (int s = legStart; s <= i + 1; s++) {
                        String stId = path.get(s);
                        legStationIds.add(stId);
                        Station st = allStations.get(stId);
                        legStationNames.add(st != null ? st.getName() : stId);
                    }

                    int legStops = (i + 1) - legStart;
                    int legTime = (int) Math.round(legStops * 2.3);

                    Map<String, Object> legMap = new LinkedHashMap<>();
                    legMap.put("legNumber", legs.size() + 1);
                    legMap.put("lineName", currentLine);
                    legMap.put("fromStationId", fromStationId);
                    legMap.put("toStationId", toStationId);
                    Station fromSt = allStations.get(fromStationId);
                    Station toSt = allStations.get(toStationId);
                    legMap.put("fromStationName", fromSt != null ? fromSt.getName() : fromStationId);
                    legMap.put("toStationName", toSt != null ? toSt.getName() : toStationId);
                    legMap.put("direction", direction);
                    legMap.put("stopsCount", legStops);
                    legMap.put("durationMins", Math.max(2, legTime));
                    legMap.put("stationNames", legStationNames);
                    legMap.put("stationIds", legStationIds);
                    legs.add(legMap);

                    if (lineChangesNext) {
                        String icStationId = path.get(i + 1);
                        String nextLine = segmentLines.get(i + 1);
                        String nextNextStationId = (i + 2 < path.size()) ? path.get(i + 2) : icStationId;
                        String nextDir = getLineDirection(nextLine, icStationId, nextNextStationId, lineMap, allStations);

                        Map<String, Object> icMap = new LinkedHashMap<>();
                        icMap.put("stationId", icStationId);
                        Station icSt = allStations.get(icStationId);
                        icMap.put("stationName", icSt != null ? icSt.getName() : icStationId);
                        icMap.put("fromLine", currentLine);
                        icMap.put("toLine", nextLine);
                        icMap.put("nextDirection", nextDir);
                        icMap.put("transferWalkMins", 3);
                        icMap.put("stopNumber", i + 1);
                        interchanges.add(icMap);
                    }

                    legStart = i + 1;
                }
            }

            // 2. Build Station-by-Station Roadmap
            for (int i = 0; i < path.size(); i++) {
                String stId = path.get(i);
                Station st = allStations.get(stId);
                String stName = (st != null) ? st.getName() : stId;
                boolean isOrigin = (i == 0);
                boolean isDest = (i == path.size() - 1);

                Map<String, Object> stepMap = new LinkedHashMap<>();
                stepMap.put("stopIndex", i);
                stepMap.put("stationId", stId);
                stepMap.put("stationName", stName);
                stepMap.put("isOrigin", isOrigin);
                stepMap.put("isDestination", isDest);

                if (st != null) {
                    stepMap.put("lat", st.getLat());
                    stepMap.put("lng", st.getLng());
                    stepMap.put("allLines", st.getLines());
                    stepMap.put("isInterchangeNode", st.isInterchange());
                }

                if (!isDest) {
                    stepMap.put("currentLine", segmentLines.get(i));
                } else {
                    stepMap.put("currentLine", segmentLines.isEmpty() ? "" : segmentLines.get(segmentLines.size() - 1));
                }

                // Check if passenger changes line at this station
                boolean hasTransfer = false;
                if (!isOrigin && !isDest) {
                    String incomingLine = segmentLines.get(i - 1);
                    String outgoingLine = segmentLines.get(i);
                    if (!incomingLine.equals(outgoingLine)) {
                        hasTransfer = true;
                        stepMap.put("transferFrom", incomingLine);
                        stepMap.put("transferTo", outgoingLine);
                        String nextNextStationId = (i + 1 < path.size()) ? path.get(i + 1) : stId;
                        String nextDir = getLineDirection(outgoingLine, stId, nextNextStationId, lineMap, allStations);
                        stepMap.put("transferDirection", nextDir);
                        stepMap.put("transferWalkMins", 3);
                    }
                }
                stepMap.put("hasTransfer", hasTransfer);

                roadmap.add(stepMap);
            }
        }

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
        result.put("totalInterchanges", interchanges.size());
        result.put("interchanges", interchanges);
        result.put("legs", legs);
        result.put("roadmap", roadmap);

        return result;
    }

    private String getLineDirection(String lineName, String fromId, String toId,
                                    Map<String, List<String>> lineMap, Map<String, Station> allStations) {
        List<String> stationsOnLine = lineMap.get(lineName);
        if (stationsOnLine == null || stationsOnLine.size() < 2) {
            return "";
        }
        int fromIdx = stationsOnLine.indexOf(fromId);
        int toIdx = stationsOnLine.indexOf(toId);

        if (fromIdx != -1 && toIdx != -1) {
            String terminalId;
            if (toIdx >= fromIdx) {
                terminalId = stationsOnLine.get(stationsOnLine.size() - 1);
            } else {
                terminalId = stationsOnLine.get(0);
            }
            Station terminal = allStations.get(terminalId);
            if (terminal != null) {
                return "Towards " + terminal.getName();
            }
        }
        return "";
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
