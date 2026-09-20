import com.delhimetro.service.MetroDatabase;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.stream.Collectors;

/** Run after compiling src: java -cp build/delhi-metro.jar scripts/ExportStationNetwork.java */
public class ExportStationNetwork {
    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.ROOT);
        var database = new MetroDatabase();
        String stations = database.getAllStations().values().stream()
            .map(station -> station.toJson()).collect(Collectors.joining(",\n"));
        String lines = database.getLineStationsMap().entrySet().stream()
            .map(entry -> "\"" + entry.getKey() + "\":[" +
                entry.getValue().stream().map(id -> "\"" + id + "\"")
                    .collect(Collectors.joining(",")) + "]")
            .collect(Collectors.joining(",\n"));
        Files.createDirectories(Path.of("data"));
        Files.writeString(Path.of("data/stations.json"),
            "{\"success\":true,\"stations\":[\n" + stations +
            "\n],\"oneWayLines\":[\"Rapid Metro Loop\"],\"lineRoutes\":{\n" + lines + "\n}}\n");
    }
}
