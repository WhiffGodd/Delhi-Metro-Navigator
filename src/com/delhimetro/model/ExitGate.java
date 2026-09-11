package com.delhimetro.model;

import java.util.List;

public class ExitGate {
    private String gate;
    private String landmark;
    private int walkMins;
    private boolean lift;
    private boolean escalator;
    private String reason;
    private List<String> transitOptions;

    public ExitGate(String gate, String landmark, int walkMins, boolean lift, boolean escalator, String reason, List<String> transitOptions) {
        this.gate = gate;
        this.landmark = landmark;
        this.walkMins = walkMins;
        this.lift = lift;
        this.escalator = escalator;
        this.reason = reason;
        this.transitOptions = transitOptions;
    }

    public String getGate() { return gate; }
    public String getLandmark() { return landmark; }
    public int getWalkMins() { return walkMins; }
    public boolean hasLift() { return lift; }
    public boolean hasEscalator() { return escalator; }
    public String getReason() { return reason; }
    public List<String> getTransitOptions() { return transitOptions; }

    public String toJson() {
        StringBuilder transitJson = new StringBuilder("[");
        if (transitOptions != null) {
            for (int i = 0; i < transitOptions.size(); i++) {
                transitJson.append("\"").append(transitOptions.get(i)).append("\"");
                if (i < transitOptions.size() - 1) transitJson.append(",");
            }
        }
        transitJson.append("]");

        return String.format(
            "{\"gate\":\"%s\",\"landmark\":\"%s\",\"walkMins\":%d,\"lift\":%b,\"escalator\":%b,\"reason\":\"%s\",\"transitOptions\":%s}",
            gate, landmark.replace("\"", "\\\""), walkMins, lift, escalator, reason.replace("\"", "\\\""), transitJson.toString()
        );
    }
}
