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
            result.put("bestGate", "Gate 1 (Main Exit)");
            result.put("reason", "Main concourse exit with ground ramp access.");
            result.put("savedMins", 3);
            result.put("lift", true);
            result.put("escalator", true);
            result.put("transitOptions", List.of("Auto Stand", "DTC Bus"));
            return result;
        }

        // Multi-factor AI Gate Evaluation in Java
        ExitGate bestGate = gates.get(0);
        int maxScore = -1;

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
        result.put("savedMins", Math.max(4, 10 - bestGate.getWalkMins()));
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
