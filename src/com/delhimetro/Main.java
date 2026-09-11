package com.delhimetro;

import com.delhimetro.server.DelhiMetroServer;

public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Starting Delhi Metro Navigator (Java Edition)...");
            DelhiMetroServer.main(args);
        } catch (Exception e) {
            System.err.println("Failed to start Delhi Metro Java Server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
