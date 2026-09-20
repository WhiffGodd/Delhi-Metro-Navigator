import javax.tools.ToolProvider;
import java.nio.file.*;
import java.util.*;
import java.util.jar.*;

/** Cross-platform Java-only build: java scripts/Build.java [--test] */
public class Build {
    public static void main(String[] args) throws Exception {
        if (Runtime.version().feature() < 21) throw new IllegalStateException("Install JDK 21 or newer");
        Path root = Path.of("").toAbsolutePath().normalize();
        if (!Files.isDirectory(root.resolve("src/com/delhimetro"))) throw new IllegalStateException("Run from the repository root");
        Path build = Files.createDirectories(root.resolve("build"));
        Path classes = Files.createTempDirectory(build, "classes-");
        List<String> options = new ArrayList<>(List.of("--release", "21", "-encoding", "UTF-8", "-d", classes.toString()));
        try (var source = Files.walk(root.resolve("src"))) {
            source.filter(p -> p.toString().endsWith(".java")).forEach(p -> options.add(p.toString()));
        }
        var compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) throw new IllegalStateException("A full JDK is required, not just a JRE");
        if (compiler.run(null, null, null, options.toArray(String[]::new)) != 0) throw new IllegalStateException("Compilation failed");
        Path web = Files.createDirectories(classes.resolve("web"));
        for (String file : List.of("index.html", "styles.css", "ui-enhancements.js", "route-planner.js", "journey-companion.js"))
            Files.copy(root.resolve(file), web.resolve(file));
        for (String directory : List.of("data", "vendor")) {
            try (var assets = Files.walk(root.resolve(directory))) {
                for (Path file : assets.filter(Files::isRegularFile).toList()) {
                    Path destination = web.resolve(root.relativize(file));
                    Files.createDirectories(destination.getParent());
                    Files.copy(file, destination);
                }
            }
        }
        if (Arrays.asList(args).contains("--test")) {
            Path tests = Files.createTempDirectory(build, "tests-");
            List<String> testOptions = new ArrayList<>(List.of("--release", "21", "-encoding", "UTF-8", "-cp", classes.toString(), "-d", tests.toString()));
            try (var source = Files.walk(root.resolve("tests/java"))) {
                source.filter(p -> p.toString().endsWith(".java")).forEach(p -> testOptions.add(p.toString()));
            }
            options.stream().filter(option -> option.endsWith(".java")).forEach(testOptions::add);
            if (compiler.run(null, null, null, testOptions.toArray(String[]::new)) != 0) throw new IllegalStateException("Test compilation failed");
            String javaExecutable = Path.of(System.getProperty("java.home"), "bin", "java").toString();
            int result = new ProcessBuilder(javaExecutable, "-cp", classes + java.io.File.pathSeparator + tests,
                "com.delhimetro.BackendTest").inheritIO().start().waitFor();
            if (result != 0) throw new IllegalStateException("Backend tests failed");
        }
        Manifest manifest = new Manifest();
        manifest.getMainAttributes().put(Attributes.Name.MANIFEST_VERSION, "1.0");
        manifest.getMainAttributes().put(Attributes.Name.MAIN_CLASS, "com.delhimetro.Main");
        Path jar = build.resolve("delhi-metro.jar");
        try (JarOutputStream output = new JarOutputStream(Files.newOutputStream(jar), manifest);
             var files = Files.walk(classes)) {
            for (Path file : files.filter(Files::isRegularFile).sorted().toList()) {
                output.putNextEntry(new JarEntry(classes.relativize(file).toString().replace('\\', '/')));
                Files.copy(file, output); output.closeEntry();
            }
        }
        System.out.println("Built " + jar + "\nRun: java -jar build/delhi-metro.jar");
    }
}
