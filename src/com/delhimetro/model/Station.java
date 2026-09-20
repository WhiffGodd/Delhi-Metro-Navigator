package com.delhimetro.model;

import java.util.List;

public class Station {
    private String id;
    private String name;
    private double lat;
    private double lng;
    private List<String> lines;
    private String firstTrain;
    private String lastTrain;
    private boolean isInterchange;

    public Station(String id, String name, double lat, double lng, List<String> lines, String firstTrain, String lastTrain, boolean isInterchange) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.lines = lines;
        this.firstTrain = firstTrain;
        this.lastTrain = lastTrain;
        this.isInterchange = isInterchange;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public double getLat() { return lat; }
    public double getLng() { return lng; }
    public List<String> getLines() { return lines; }
    public String getFirstTrain() { return firstTrain; }
    public String getLastTrain() { return lastTrain; }
    public boolean isInterchange() { return isInterchange; }

    public String toJson() {
        return com.delhimetro.server.Json.encode(java.util.Map.of(
            "id", id, "name", name, "lat", lat, "lng", lng, "lines", lines,
            "firstTrain", firstTrain, "lastTrain", lastTrain, "isInterchange", isInterchange));
    }
}
