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
        StringBuilder linesJson = new StringBuilder("[");
        for (int i = 0; i < lines.size(); i++) {
            linesJson.append("\"").append(lines.get(i)).append("\"");
            if (i < lines.size() - 1) linesJson.append(",");
        }
        linesJson.append("]");

        return String.format(
            "{\"id\":\"%s\",\"name\":\"%s\",\"lat\":%f,\"lng\":%f,\"lines\":%s,\"firstTrain\":\"%s\",\"lastTrain\":\"%s\",\"isInterchange\":%b}",
            id, name.replace("\"", "\\\""), lat, lng, linesJson.toString(), firstTrain, lastTrain, isInterchange
        );
    }
}
