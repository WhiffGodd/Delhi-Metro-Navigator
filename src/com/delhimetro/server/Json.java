package com.delhimetro.server;

import java.util.*;
import java.util.stream.Collectors;

/** JSON output for the server's maps, lists and scalar values. */
public final class Json {
    private Json() {}
    public static String encode(Object value) {
        if (value == null) return "null";
        if (value instanceof Boolean || value instanceof Number) return value.toString();
        if (value instanceof Map<?, ?> map) return map.entrySet().stream()
            .map(e -> encode(e.getKey().toString()) + ":" + encode(e.getValue()))
            .collect(Collectors.joining(",", "{", "}"));
        if (value instanceof List<?> list) return list.stream().map(Json::encode).collect(Collectors.joining(",", "[", "]"));
        StringBuilder out = new StringBuilder("\"");
        for (char ch : value.toString().toCharArray()) {
            switch (ch) {
                case '"' -> out.append("\\\"");
                case '\\' -> out.append("\\\\");
                case '\n' -> out.append("\\n");
                case '\r' -> out.append("\\r");
                case '\t' -> out.append("\\t");
                default -> { if (ch < 0x20) out.append(String.format("\\u%04x", (int) ch)); else out.append(ch); }
            }
        }
        return out.append('"').toString();
    }
}
