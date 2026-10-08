package com.delhimetro.service;

import com.delhimetro.model.ExitGate;

import java.util.*;

public class AISmartExitService {

    private final MetroDatabase database;

    public AISmartExitService(MetroDatabase database) {
        this.database = database;
    }

    public Map<String, Object> getExitRecommendation(String stationId) {
        List<ExitGate> gates = database.getExitGates(stationId);
        Map<String, Object> result = new LinkedHashMap<>();

        if (gates == null || gates.isEmpty()) {
            result.put("available", false);
            result.put("reason", "Exit details are not available for this station. Follow station signage or ask station staff.");
            result.put("allGates", List.of());
            result.put("transitOptions", List.of());
            return result;
        }

        // Rank stored gates by walking time, accessibility and onward transport.
        ExitGate bestGate = gates.get(0);
        int maxScore = Integer.MIN_VALUE;

        for (ExitGate g : gates) {
            int score = 100 - (g.getWalkMins() * 10);
            if (g.hasLift()) score += 25;
            if (g.hasEscalator()) score += 15;
            if (g.getTransitOptions() != null && !g.getTransitOptions().isEmpty()) score += 20;

            if (score > maxScore) {
                maxScore = score;
                bestGate = g;
            }
        }

        result.put("bestGate", bestGate.getGate());
        result.put("reason", bestGate.getReason());
        result.put("available", true);
        result.put("walkMins", bestGate.getWalkMins());
        result.put("landmark", bestGate.getLandmark());
        result.put("recommendationNote", "Suggested from stored gate details, prioritising lift access and walking time. Confirm current gate availability at the station.");
        result.put("lift", bestGate.hasLift());
        result.put("escalator", bestGate.hasEscalator());
        result.put("transitOptions", bestGate.getTransitOptions());

        List<Map<String, Object>> gatesList = new ArrayList<>();
        for (ExitGate g : gates) {
            Map<String, Object> gateMap = new LinkedHashMap<>();
            gateMap.put("gate", g.getGate());
            gateMap.put("landmark", g.getLandmark());
            gateMap.put("walkMins", g.getWalkMins());
            gateMap.put("lift", g.hasLift());
            gateMap.put("escalator", g.hasEscalator());
            gateMap.put("reason", g.getReason());
            gatesList.add(gateMap);
        }
        result.put("allGates", gatesList);

        return result;
    }
}
