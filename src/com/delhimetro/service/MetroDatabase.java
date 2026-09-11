package com.delhimetro.service;

import com.delhimetro.model.Station;
import com.delhimetro.model.ExitGate;

import java.util.*;

public class MetroDatabase {

    private final Map<String, Station> stationMap = new LinkedHashMap<>();
    private final Map<String, List<String>> lineStationsMap = new LinkedHashMap<>();
    private final Map<String, List<ExitGate>> stationGatesMap = new HashMap<>();

    public MetroDatabase() {
        initDatabase();
    }

    private void initDatabase() {
        // Yellow Line
        addStation("samaypur_badli", "Samaypur Badli", 28.7456, 77.1384, List.of("Yellow Line"), "05:45", "23:00", false);
        addStation("rohini_sector_18", "Rohini Sector 18,19", 28.7368, 77.1351, List.of("Yellow Line"), "05:47", "23:02", false);
        addStation("haiderpur_badli_mor", "Haiderpur Badli Mor", 28.7241, 77.1539, List.of("Yellow Line"), "05:50", "23:05", false);
        addStation("jahangirpuri", "Jahangirpuri", 28.7153, 77.1632, List.of("Yellow Line"), "05:52", "23:07", false);
        addStation("adarsh_nagar", "Adarsh Nagar", 28.7027, 77.1701, List.of("Yellow Line"), "05:55", "23:10", false);
        addStation("azadpur", "Azadpur", 28.6974, 77.1772, List.of("Yellow Line", "Pink Line"), "05:40", "23:15", true);
        addStation("model_town", "Model Town", 28.6872, 77.1934, List.of("Yellow Line"), "05:43", "23:18", false);
        addStation("gtb_nagar", "GTB Nagar", 28.6979, 77.2069, List.of("Yellow Line"), "05:45", "23:20", false);
        addStation("vishwa_vidyalaya", "Vishwa Vidyalaya", 28.6947, 77.2140, List.of("Yellow Line"), "05:47", "23:22", false);
        addStation("vidhan_sabha", "Vidhan Sabha", 28.6828, 77.2215, List.of("Yellow Line"), "05:50", "23:25", false);
        addStation("civil_lines", "Civil Lines", 28.6763, 77.2253, List.of("Yellow Line"), "05:52", "23:27", false);
        addStation("kashmere_gate", "Kashmere Gate", 28.6675, 77.2285, List.of("Yellow Line", "Red Line", "Violet Line"), "05:30", "23:30", true);
        addStation("chandni_chowk", "Chandni Chowk", 28.6578, 77.2301, List.of("Yellow Line"), "05:33", "23:28", false);
        addStation("chawri_bazar", "Chawri Bazar", 28.6492, 77.2263, List.of("Yellow Line"), "05:35", "23:25", false);
        addStation("new_delhi", "New Delhi", 28.6431, 77.2223, List.of("Yellow Line", "Airport Express"), "05:30", "23:30", true);
        addStation("rajiv_chowk", "Rajiv Chowk", 28.6328, 77.2197, List.of("Yellow Line", "Blue Line"), "05:30", "23:30", true);
        addStation("patel_chowk", "Patel Chowk", 28.6231, 77.2142, List.of("Yellow Line"), "05:34", "23:26", false);
        addStation("central_secretariat", "Central Secretariat", 28.6148, 77.2117, List.of("Yellow Line", "Violet Line"), "05:36", "23:24", true);
        addStation("udyog_bhawan", "Udyog Bhawan", 28.6083, 77.2120, List.of("Yellow Line"), "05:38", "23:22", false);
        addStation("lok_kalyan_marg", "Lok Kalyan Marg", 28.5986, 77.2104, List.of("Yellow Line"), "05:40", "23:20", false);
        addStation("jor_bagh", "Jor Bagh", 28.5878, 77.2120, List.of("Yellow Line"), "05:42", "23:18", false);
        addStation("dilli_haat_ina", "Dilli Haat INA", 28.5746, 77.2098, List.of("Yellow Line", "Pink Line"), "05:45", "23:15", true);
        addStation("aiims", "AIIMS", 28.5663, 77.2081, List.of("Yellow Line"), "05:47", "23:13", false);
        addStation("green_park", "Green Park", 28.5587, 77.2064, List.of("Yellow Line"), "05:49", "23:11", false);
        addStation("hauz_khas", "Hauz Khas", 28.5431, 77.2065, List.of("Yellow Line", "Magenta Line"), "05:30", "23:30", true);
        addStation("malviya_nagar", "Malviya Nagar", 28.5342, 77.2067, List.of("Yellow Line"), "05:53", "23:07", false);
        addStation("saket", "Saket", 28.5208, 77.2014, List.of("Yellow Line"), "05:55", "23:05", false);
        addStation("qutab_minar", "Qutab Minar", 28.5134, 77.1856, List.of("Yellow Line"), "05:58", "23:02", false);
        addStation("chhatarpur", "Chhatarpur", 28.5065, 77.1748, List.of("Yellow Line"), "06:00", "23:00", false);
        addStation("sultanpur", "Sultanpur", 28.4988, 77.1616, List.of("Yellow Line"), "06:02", "22:58", false);
        addStation("ghitorni", "Ghitorni", 28.4930, 77.1504, List.of("Yellow Line"), "06:04", "22:56", false);
        addStation("arjan_garh", "Arjan Garh", 28.4806, 77.1261, List.of("Yellow Line"), "06:06", "22:54", false);
        addStation("guru_dronacharya", "Guru Dronacharya", 28.4816, 77.1042, List.of("Yellow Line"), "06:08", "22:52", false);
        addStation("sikanderpur", "Sikanderpur", 28.4819, 77.0926, List.of("Yellow Line"), "06:10", "22:50", false);
        addStation("mg_road", "MG Road", 28.4795, 77.0801, List.of("Yellow Line"), "06:12", "22:48", false);
        addStation("iffco_chowk", "IFFCO Chowk", 28.4721, 77.0725, List.of("Yellow Line"), "06:14", "22:46", false);
        addStation("millennium_city_center", "Millennium City Centre Gurugram", 28.4593, 77.0726, List.of("Yellow Line"), "06:00", "23:00", false);

        // Blue Line
        addStation("dwarka_sector_21", "Dwarka Sector 21", 28.5521, 77.0583, List.of("Blue Line", "Airport Express"), "05:30", "23:30", true);
        addStation("dwarka_sector_8", "Dwarka Sector 8", 28.5642, 77.0678, List.of("Blue Line"), "05:32", "23:28", false);
        addStation("dwarka_sector_9", "Dwarka Sector 9", 28.5746, 77.0645, List.of("Blue Line"), "05:34", "23:26", false);
        addStation("dwarka_sector_10", "Dwarka Sector 10", 28.5812, 77.0573, List.of("Blue Line"), "05:36", "23:24", false);
        addStation("dwarka_sector_11", "Dwarka Sector 11", 28.5878, 77.0506, List.of("Blue Line"), "05:38", "23:22", false);
        addStation("dwarka_sector_12", "Dwarka Sector 12", 28.5925, 77.0426, List.of("Blue Line"), "05:40", "23:20", false);
        addStation("dwarka_sector_13", "Dwarka Sector 13", 28.6015, 77.0378, List.of("Blue Line"), "05:42", "23:18", false);
        addStation("dwarka_sector_14", "Dwarka Sector 14", 28.6102, 77.0264, List.of("Blue Line"), "05:44", "23:16", false);
        addStation("dwarka", "Dwarka", 28.6151, 77.0245, List.of("Blue Line", "Grey Line"), "05:45", "23:15", true);
        addStation("dwarka_mor", "Dwarka Mor", 28.6195, 77.0326, List.of("Blue Line"), "05:47", "23:13", false);
        addStation("nawada", "Nawada", 28.6214, 77.0435, List.of("Blue Line"), "05:49", "23:11", false);
        addStation("uttam_nagar_west", "Uttam Nagar West", 28.6247, 77.0568, List.of("Blue Line"), "05:51", "23:09", false);
        addStation("uttam_nagar_east", "Uttam Nagar East", 28.6272, 77.0652, List.of("Blue Line"), "05:53", "23:07", false);
        addStation("janakpuri_west", "Janakpuri West", 28.6294, 77.0781, List.of("Blue Line", "Magenta Line"), "05:30", "23:30", true);
        addStation("janakpuri_east", "Janakpuri East", 28.6318, 77.0864, List.of("Blue Line"), "05:56", "23:04", false);
        addStation("tilak_nagar", "Tilak Nagar", 28.6364, 77.0967, List.of("Blue Line"), "05:58", "23:02", false);
        addStation("subhash_nagar", "Subhash Nagar", 28.6398, 77.1046, List.of("Blue Line"), "06:00", "23:00", false);
        addStation("tagore_garden", "Tagore Garden", 28.6432, 77.1147, List.of("Blue Line"), "06:02", "22:58", false);
        addStation("rajouri_garden", "Rajouri Garden", 28.6492, 77.1232, List.of("Blue Line", "Pink Line"), "05:30", "23:30", true);
        addStation("ramesh_nagar", "Ramesh Nagar", 28.6521, 77.1328, List.of("Blue Line"), "06:05", "22:55", false);
        addStation("moti_nagar", "Moti Nagar", 28.6558, 77.1425, List.of("Blue Line"), "06:07", "22:53", false);
        addStation("kirti_nagar", "Kirti Nagar", 28.6558, 77.1518, List.of("Blue Line", "Green Line"), "05:40", "23:15", true);
        addStation("shadipur", "Shadipur", 28.6517, 77.1581, List.of("Blue Line"), "06:10", "22:50", false);
        addStation("patel_nagar", "Patel Nagar", 28.6483, 77.1654, List.of("Blue Line"), "06:12", "22:48", false);
        addStation("rajendra_place", "Rajendra Place", 28.6441, 77.1772, List.of("Blue Line"), "06:14", "22:46", false);
        addStation("karol_bagh", "Karol Bagh", 28.6445, 77.1895, List.of("Blue Line"), "06:16", "22:44", false);
        addStation("jhandewalan", "Jhandewalan", 28.6448, 77.1989, List.of("Blue Line"), "06:18", "22:42", false);
        addStation("ramakrishna_ashram_marg", "Ramakrishna Ashram Marg", 28.6392, 77.2084, List.of("Blue Line"), "06:20", "22:40", false);
        addStation("mandi_house", "Mandi House", 28.6258, 77.2341, List.of("Blue Line", "Violet Line"), "05:30", "23:30", true);
        addStation("supreme_court", "Supreme Court", 28.6231, 77.2435, List.of("Blue Line"), "06:24", "22:36", false);
        addStation("indraprastha", "Indraprastha", 28.6205, 77.2498, List.of("Blue Line"), "06:26", "22:34", false);
        addStation("yamuna_bank", "Yamuna Bank", 28.6214, 77.2685, List.of("Blue Line"), "05:30", "23:30", true);
        addStation("akshardham", "Akshardham", 28.6184, 77.2798, List.of("Blue Line"), "06:28", "22:32", false);
        addStation("mayur_vihar_phase_1", "Mayur Vihar Phase 1", 28.6045, 77.2945, List.of("Blue Line", "Pink Line"), "05:40", "23:15", true);
        addStation("mayur_vihar_extension", "Mayur Vihar Extension", 28.5941, 77.2998, List.of("Blue Line"), "06:31", "22:29", false);
        addStation("new_ashok_nagar", "New Ashok Nagar", 28.5892, 77.3045, List.of("Blue Line"), "06:33", "22:27", false);
        addStation("noida_sector_15", "Noida Sector 15", 28.5847, 77.3134, List.of("Blue Line"), "06:35", "22:25", false);
        addStation("noida_sector_16", "Noida Sector 16", 28.5786, 77.3182, List.of("Blue Line"), "06:37", "22:23", false);
        addStation("noida_sector_18", "Noida Sector 18", 28.5708, 77.3262, List.of("Blue Line"), "06:39", "22:21", false);
        addStation("botanical_garden", "Botanical Garden", 28.5642, 77.3341, List.of("Blue Line", "Magenta Line"), "05:30", "23:30", true);
        addStation("golf_course", "Golf Course", 28.5604, 77.3445, List.of("Blue Line"), "06:42", "22:18", false);
        addStation("noida_city_centre", "Noida City Centre", 28.5746, 77.3562, List.of("Blue Line"), "06:44", "22:16", false);
        addStation("noida_electronic_city", "Noida Electronic City", 28.6272, 77.3734, List.of("Blue Line"), "06:00", "23:00", false);

        // Exit Gates for Major Stations
        initExitGates();
    }

    private void addStation(String id, String name, double lat, double lng, List<String> lines, String firstTrain, String lastTrain, boolean isInterchange) {
        Station station = new Station(id, name, lat, lng, lines, firstTrain, lastTrain, isInterchange);
        stationMap.put(id, station);

        for (String line : lines) {
            lineStationsMap.computeIfAbsent(line, k -> new ArrayList<>()).add(id);
        }
    }

    private void initExitGates() {
        stationGatesMap.put("rajiv_chowk", List.of(
            new ExitGate("Gate 1", "Radial 1 / CP Inner Circle (Block B)", 3, true, true, "Closest exit for Connaught Place B Block and Palika Bazaar with operational glass elevators.", List.of("Prepaid Auto Stand", "Uber/Ola Taxi Bay")),
            new ExitGate("Gate 2", "Palika Bazaar Main Entrance", 4, true, true, "Direct subterranean access to Palika Underground Market with zero stair escalators.", List.of("Subway Walkway")),
            new ExitGate("Gate 6", "KG Marg / CP Outer Circle", 5, false, true, "Exit towards Kasturba Gandhi Marg and Janpath crossing.", List.of("DTC Bus Stand"))
        ));

        stationGatesMap.put("kashmere_gate", List.of(
            new ExitGate("Gate 1", "ISBT Kashmere Gate Main Concourse", 2, true, true, "Direct covered walkway to Inter-State Bus Terminal.", List.of("ISBT Interstate Buses", "Prepaid Auto")),
            new ExitGate("Gate 5", "Lothian Road / St. James Church", 4, false, true, "Exit towards Historic St. James Church and DU North Campus feeder route.", List.of("E-Rickshaw Stand"))
        ));

        stationGatesMap.put("hauz_khas", List.of(
            new ExitGate("Gate 2", "IIT Delhi Main Gate / Outer Ring Rd", 3, true, true, "Direct access to IIT Delhi Main Gate with ramp access.", List.of("Auto Stand", "Bus Bay")),
            new ExitGate("Gate 1", "Hauz Khas Village / Deer Park", 5, true, true, "Closest exit for Hauz Khas Village food & heritage complex.", List.of("E-Rickshaw", "Cab Drop"))
        ));
    }

    public Map<String, Station> getAllStations() { return stationMap; }
    public Station getStation(String id) { return stationMap.get(id); }
    public Map<String, List<String>> getLineStationsMap() { return lineStationsMap; }
    public List<ExitGate> getExitGates(String stationId) { return stationGatesMap.getOrDefault(stationId, Collections.emptyList()); }
}
