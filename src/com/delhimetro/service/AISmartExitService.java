package com.delhimetro.service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

/** Uses the same checked-in official gate snapshot as the browser. */
public class AISmartExitService {
    private final Map<String, List<Map<String, Object>>> guide = new HashMap<>();

    public AISmartExitService(MetroDatabase database) {
        try {
            InputStream resource = getClass().getClassLoader().getResourceAsStream("web/data/exit-gates.tsv");
            if (resource == null) resource = Files.newInputStream(Path.of("data/exit-gates.tsv"));
            try (var reader = new BufferedReader(new InputStreamReader(resource, StandardCharsets.UTF_8))) {
                reader.readLine();
                for (String row; (row = reader.readLine()) != null;) {
                    String[] fields = row.split("\t", -1);
                    if (fields.length != 7 || !database.getAllStations().containsKey(fields[0])) continue;
                    Map<String, Object> gate = new LinkedHashMap<>();
                    gate.put("gate", fields[1]); gate.put("landmark", fields[2]);
                    gate.put("accessible", Boolean.parseBoolean(fields[3])); gate.put("status", fields[4]);
                    gate.put("sourceUrl", fields[5]); gate.put("checkedOn", fields[6]);
                    gate.put("lift", null); gate.put("escalator", null); gate.put("walkMins", null);
                    gate.put("reason", "Exit towards " + fields[2] + ".");
                    gate.put("transitOptions", List.of());
                    guide.computeIfAbsent(fields[0], key -> new ArrayList<>()).add(gate);
                }
            }
        } catch (IOException error) {
            System.err.println("Official exit guide unavailable: " + error.getMessage());
        }
    }

    public Map<String, Object> getExitRecommendation(String stationId) {
        return getExitRecommendation(stationId, "", false);
    }

    public Map<String, Object> getExitRecommendation(String stationId, String destination, boolean accessibleOnly) {
        List<Map<String, Object>> gates = guide.getOrDefault(stationId, List.of());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("available", false); result.put("allGates", gates); result.put("transitOptions", List.of());
        result.put("reason", "Official gate details are unavailable. Follow station signs or ask station staff.");
        if (gates.isEmpty()) return result;
        String[] words = destination.trim().toLowerCase(Locale.ROOT).split("\\s+");
        var matching = gates.stream().filter(g -> !Set.of("closed", "close", "inactive").contains(g.get("status").toString().toLowerCase(Locale.ROOT)))
            .filter(g -> !accessibleOnly || Boolean.TRUE.equals(g.get("accessible")))
            .filter(g -> Arrays.stream(words).allMatch(word -> (g.get("gate") + " " + g.get("landmark")).toLowerCase(Locale.ROOT).contains(word)))
            .sorted(Comparator.comparingInt(g -> gateNumber(g.get("gate").toString()))).toList();
        result.put("source", "dmrc");
        result.put("sourceUrl", gates.get(0).get("sourceUrl")); result.put("checkedOn", gates.get(0).get("checkedOn"));
        if (matching.isEmpty()) {
            result.put("reason", accessibleOnly ? "No matching gate is listed as accessible. Ask station staff for a step-free route." : "No listed exit matches that destination. Choose another nearby destination or ask station staff.");
            return result;
        }
        result.putAll(matching.get(0)); result.put("available", true);
        result.put("bestGate", matching.get(0).get("gate")); result.put("matches", matching);
        result.put("recommendationNote", "Based on DMRC’s published gate destinations, not live gate status. Confirm access using station signs or staff.");
        return result;
    }

    private static int gateNumber(String gate) {
        var match = java.util.regex.Pattern.compile("\\d+").matcher(gate);
        return match.find() ? Integer.parseInt(match.group()) : Integer.MAX_VALUE;
    }
}
