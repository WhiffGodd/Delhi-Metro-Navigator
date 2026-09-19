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
        // 1. Yellow Line Stations
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

        // 2. Blue Line Stations
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
        addStation("noida_sector_34", "Noida Sector 34", 28.5812, 77.3621, List.of("Blue Line"), "06:46", "22:14", false);
        addStation("noida_sector_52", "Noida Sector 52", 28.5914, 77.3684, List.of("Blue Line"), "06:48", "22:12", false);
        addStation("noida_sector_61", "Noida Sector 61", 28.6002, 77.3712, List.of("Blue Line"), "06:50", "22:10", false);
        addStation("noida_sector_59", "Noida Sector 59", 28.6114, 77.3732, List.of("Blue Line"), "06:52", "22:08", false);
        addStation("noida_sector_62", "Noida Sector 62", 28.6212, 77.3738, List.of("Blue Line"), "06:54", "22:06", false);
        addStation("noida_electronic_city", "Noida Electronic City", 28.6272, 77.3734, List.of("Blue Line"), "06:00", "23:00", false);
        addStation("laxmi_nagar", "Laxmi Nagar", 28.6308, 77.2772, List.of("Blue Line"), "05:45", "23:15", false);
        addStation("nirman_vihar", "Nirman Vihar", 28.6364, 77.2864, List.of("Blue Line"), "05:47", "23:17", false);
        addStation("preet_vihar", "Preet Vihar", 28.6412, 77.2958, List.of("Blue Line"), "05:49", "23:19", false);
        addStation("karkarduma_blue", "Karkarduma", 28.6489, 77.3054, List.of("Blue Line"), "05:51", "23:21", false);
        addStation("anand_vihar_isbt_blue", "Anand Vihar ISBT", 28.6468, 77.3162, List.of("Blue Line"), "05:53", "23:23", false);
        addStation("kaushambi", "Kaushambi", 28.6454, 77.3242, List.of("Blue Line"), "05:55", "23:25", false);
        addStation("vaishali", "Vaishali", 28.6498, 77.3396, List.of("Blue Line"), "06:00", "23:00", false);

        // 3. Red Line Stations
        addStation("rithala", "Rithala", 28.7208, 77.1071, List.of("Red Line"), "05:30", "23:00", false);
        addStation("rohini_west", "Rohini West", 28.7145, 77.1147, List.of("Red Line"), "05:32", "23:02", false);
        addStation("rohini_east", "Rohini East", 28.7118, 77.1245, List.of("Red Line"), "05:34", "23:04", false);
        addStation("pitampura", "Pitampura", 28.7032, 77.1326, List.of("Red Line"), "05:36", "23:06", false);
        addStation("kohat_enclave", "Kohat Enclave", 28.6978, 77.1408, List.of("Red Line"), "05:38", "23:08", false);
        addStation("netaji_subhash_place", "Netaji Subhash Place", 28.6954, 77.1523, List.of("Red Line", "Pink Line"), "05:30", "23:30", true);
        addStation("keshav_puram", "Keshav Puram", 28.6892, 77.1568, List.of("Red Line"), "05:39", "23:09", false);
        addStation("kanhiya_nagar", "Kanhiya Nagar", 28.6854, 77.1612, List.of("Red Line"), "05:40", "23:10", false);
        addStation("indrelok", "Inderlok", 28.6734, 77.1708, List.of("Red Line", "Green Line"), "05:30", "23:30", true);
        addStation("shastri_nagar", "Shastri Nagar", 28.6698, 77.1812, List.of("Red Line"), "05:42", "23:12", false);
        addStation("pratap_nagar", "Pratap Nagar", 28.6678, 77.1945, List.of("Red Line"), "05:43", "23:13", false);
        addStation("pul_bangash", "Pul Bangash", 28.6668, 77.2025, List.of("Red Line"), "05:44", "23:14", false);
        addStation("tis_hazari", "Tis Hazari", 28.6672, 77.2163, List.of("Red Line"), "05:46", "23:16", false);
        addStation("kashmere_gate", "Kashmere Gate", 28.6675, 77.2285, List.of("Red Line", "Yellow Line", "Violet Line"), "05:30", "23:30", true);
        addStation("shastri_park", "Shastri Park", 28.6712, 77.2512, List.of("Red Line"), "05:50", "23:20", false);
        addStation("seelampur", "Seelampur", 28.6702, 77.2645, List.of("Red Line"), "05:52", "23:22", false);
        addStation("welcome", "Welcome", 28.6718, 77.2778, List.of("Red Line", "Pink Line"), "05:40", "23:24", true);
        addStation("shahdara", "Shahdara", 28.6735, 77.2895, List.of("Red Line"), "05:55", "23:25", false);
        addStation("mansarovar_park", "Mansarovar Park", 28.6754, 77.3012, List.of("Red Line"), "05:57", "23:27", false);
        addStation("jhilmil", "Jhilmil", 28.6768, 77.3115, List.of("Red Line"), "05:59", "23:29", false);
        addStation("dilshad_garden", "Dilshad Garden", 28.6781, 77.3218, List.of("Red Line"), "06:01", "23:01", false);
        addStation("shahid_nagar", "Shahid Nagar", 28.6772, 77.3325, List.of("Red Line"), "06:02", "23:02", false);
        addStation("raj_bagh", "Raj Bagh", 28.6761, 77.3418, List.of("Red Line"), "06:03", "23:03", false);
        addStation("shahdara_bus_adda", "Major Mohit Sharma Rajendra Nagar", 28.6745, 77.3512, List.of("Red Line"), "06:04", "23:04", false);
        addStation("shyam_park", "Shyam Park", 28.6732, 77.3654, List.of("Red Line"), "06:05", "23:05", false);
        addStation("mohan_nagar", "Mohan Nagar", 28.6721, 77.3812, List.of("Red Line"), "06:06", "23:06", false);
        addStation("arthala", "Arthala", 28.6715, 77.3984, List.of("Red Line"), "06:07", "23:07", false);
        addStation("hindon_river", "Hindon River", 28.6710, 77.4082, List.of("Red Line"), "06:08", "23:08", false);
        addStation("shaheed_sthal", "Shaheed Sthal (New Bus Adda)", 28.6712, 77.4145, List.of("Red Line"), "06:00", "23:00", false);

        // 4. Violet Line Stations
        addStation("lal_quila", "Lal Quila", 28.6562, 77.2378, List.of("Violet Line"), "05:32", "23:22", false);
        addStation("jama_masjid", "Jama Masjid", 28.6508, 77.2356, List.of("Violet Line"), "05:34", "23:24", false);
        addStation("delhi_gate", "Delhi Gate", 28.6412, 77.2408, List.of("Violet Line"), "05:36", "23:26", false);
        addStation("ito", "ITO", 28.6281, 77.2412, List.of("Violet Line"), "05:38", "23:28", false);
        addStation("janpath", "Janpath", 28.6212, 77.2189, List.of("Violet Line"), "05:40", "23:20", false);
        addStation("khan_market", "Khan Market", 28.6008, 77.2272, List.of("Violet Line"), "05:42", "23:18", false);
        addStation("jawaharlal_nehru_stadium", "Jawaharlal Nehru Stadium", 28.5826, 77.2341, List.of("Violet Line"), "05:44", "23:16", false);
        addStation("jangpura", "Jangpura", 28.5781, 77.2361, List.of("Violet Line"), "05:46", "23:14", false);
        addStation("lajpat_nagar", "Lajpat Nagar", 28.5701, 77.2378, List.of("Violet Line", "Pink Line"), "05:30", "23:30", true);
        addStation("moolchand", "Moolchand", 28.5645, 77.2412, List.of("Violet Line"), "05:47", "23:13", false);
        addStation("kailash_colony", "Kailash Colony", 28.5545, 77.2478, List.of("Violet Line"), "05:49", "23:11", false);
        addStation("nehru_place", "Nehru Place", 28.5512, 77.2515, List.of("Violet Line"), "05:51", "23:09", false);
        addStation("kalka_ji_mandir", "Kalkaji Mandir", 28.5489, 77.2584, List.of("Violet Line", "Magenta Line"), "05:30", "23:30", true);
        addStation("govind_puri", "Govind Puri", 28.5441, 77.2642, List.of("Violet Line"), "05:54", "23:06", false);
        addStation("harkesh_nagar", "Harkesh Nagar Okhla", 28.5398, 77.2712, List.of("Violet Line"), "05:56", "23:04", false);
        addStation("jasola_apollo", "Jasola Apollo", 28.5312, 77.2815, List.of("Violet Line"), "05:58", "23:02", false);
        addStation("sarita_vihar", "Sarita Vihar", 28.5278, 77.2912, List.of("Violet Line"), "06:00", "23:00", false);
        addStation("mohan_estate", "Mohan Estate", 28.5145, 77.3012, List.of("Violet Line"), "06:02", "22:58", false);
        addStation("tughlakabad", "Tughlakabad Station", 28.5045, 77.3089, List.of("Violet Line"), "06:04", "22:56", false);
        addStation("badarpur_border", "Badarpur Border", 28.4912, 77.3112, List.of("Violet Line"), "06:06", "22:54", false);
        addStation("sarai", "Sarai", 28.4712, 77.3118, List.of("Violet Line"), "06:08", "22:52", false);
        addStation("nhpc_chowk", "NHPC Chowk", 28.4554, 77.3125, List.of("Violet Line"), "06:10", "22:50", false);
        addStation("mewala_maharajpur", "Mewala Maharajpur", 28.4398, 77.3134, List.of("Violet Line"), "06:12", "22:48", false);
        addStation("sector_28_faridabad", "Sector 28", 28.4241, 77.3142, List.of("Violet Line"), "06:14", "22:46", false);
        addStation("badkal_mor", "Badkal Mor", 28.4092, 77.3151, List.of("Violet Line"), "06:16", "22:44", false);
        addStation("old_faridabad", "Old Faridabad", 28.3945, 77.3160, List.of("Violet Line"), "06:18", "22:42", false);
        addStation("neelam_chowk_ajronda", "Neelam Chowk Ajronda", 28.3798, 77.3171, List.of("Violet Line"), "06:20", "22:40", false);
        addStation("bata_chowk", "Bata Chowk", 28.3654, 77.3182, List.of("Violet Line"), "06:22", "22:38", false);
        addStation("escorts_mujesar", "Escorts Mujesar", 28.3512, 77.3195, List.of("Violet Line"), "06:24", "22:36", false);
        addStation("sant_surdas_sihi", "Sant Surdas (Sihi)", 28.3445, 77.3204, List.of("Violet Line"), "06:26", "22:34", false);
        addStation("raja_nahar_singh", "Raja Nahar Singh (Ballabhgarh)", 28.3378, 77.3212, List.of("Violet Line"), "06:00", "23:00", false);

        // 5. Green Line Stations
        addStation("ashok_park_main", "Ashok Park Main", 28.6712, 77.1589, List.of("Green Line"), "05:45", "23:15", false);
        addStation("punjabi_bagh", "Punjabi Bagh", 28.6725, 77.1489, List.of("Green Line", "Pink Line"), "05:30", "23:30", true);
        addStation("shivaji_park", "Shivaji Park", 28.6738, 77.1345, List.of("Green Line"), "05:47", "23:13", false);
        addStation("madipur", "Madipur", 28.6745, 77.1232, List.of("Green Line"), "05:49", "23:11", false);
        addStation("paschim_vihar_east", "Paschim Vihar East", 28.6754, 77.1125, List.of("Green Line"), "05:50", "23:10", false);
        addStation("paschim_vihar_west", "Paschim Vihar West", 28.6768, 77.1012, List.of("Green Line"), "05:52", "23:08", false);
        addStation("peeragarhi", "Peeragarhi", 28.6795, 77.0912, List.of("Green Line"), "05:55", "23:05", false);
        addStation("udyog_nagar", "Udyog Nagar", 28.6812, 77.0789, List.of("Green Line"), "05:57", "23:03", false);
        addStation("maharaja_surajmal_stadium", "Maharaja Surajmal Stadium", 28.6828, 77.0654, List.of("Green Line"), "05:59", "23:01", false);
        addStation("nangloi", "Nangloi", 28.6841, 77.0541, List.of("Green Line"), "06:01", "22:59", false);
        addStation("nangloi_railway_station", "Nangloi Railway Station", 28.6854, 77.0425, List.of("Green Line"), "06:03", "22:57", false);
        addStation("rajdhani_park", "Rajdhani Park", 28.6868, 77.0289, List.of("Green Line"), "06:05", "22:55", false);
        addStation("mundka", "Mundka", 28.6881, 77.0145, List.of("Green Line"), "06:07", "22:53", false);
        addStation("mundka_industrial_area", "Mundka Industrial Area (MIA)", 28.6895, 76.9984, List.of("Green Line"), "06:09", "22:51", false);
        addStation("ghevra_metro_station", "Ghevra Metro Station", 28.6908, 76.9812, List.of("Green Line"), "06:11", "22:49", false);
        addStation("tikri_kalan", "Tikri Kalan", 28.6921, 76.9645, List.of("Green Line"), "06:13", "22:47", false);
        addStation("tikri_border", "Tikri Border", 28.6934, 76.9478, List.of("Green Line"), "06:15", "22:45", false);
        addStation("pandit_shree_ram_sharma", "Pandit Shree Ram Sharma", 28.6941, 76.9345, List.of("Green Line"), "06:17", "22:43", false);
        addStation("brigadier_hoshiar_singh", "Brigadier Hoshiar Singh (Bahadurgarh)", 28.6945, 76.9212, List.of("Green Line"), "06:00", "23:00", false);

        // 6. Pink Line Stations
        addStation("majlis_park", "Majlis Park", 28.7125, 77.1812, List.of("Pink Line"), "05:30", "23:00", false);
        addStation("shalimar_bagh", "Shalimar Bagh", 28.7012, 77.1645, List.of("Pink Line"), "05:35", "23:05", false);
        addStation("shakurpur", "Shakurpur", 28.6884, 77.1492, List.of("Pink Line"), "05:37", "23:07", false);
        addStation("punjabi_bagh_west", "Punjabi Bagh West", 28.6762, 77.1438, List.of("Pink Line"), "05:39", "23:09", false);
        addStation("esi_hospital", "ESI-PGIMSR Hospital", 28.6582, 77.1364, List.of("Pink Line"), "05:41", "23:11", false);
        addStation("naraina_vihar", "Naraina Vihar", 28.6289, 77.1412, List.of("Pink Line"), "05:45", "23:15", false);
        addStation("mayapuri", "Mayapuri", 28.6345, 77.1325, List.of("Pink Line"), "05:47", "23:17", false);
        addStation("delhi_cantt", "Delhi Cantt", 28.6082, 77.1554, List.of("Pink Line"), "05:49", "23:19", false);
        addStation("south_campus", "Durgabai Deshmukh South Campus", 28.5889, 77.1689, List.of("Pink Line"), "05:50", "23:20", false);
        addStation("moti_bagh", "Sir M. Visvesvaraya Moti Bagh", 28.5794, 77.1784, List.of("Pink Line"), "05:52", "23:22", false);
        addStation("bhikaji_cama_place", "Bhikaji Cama Place", 28.5712, 77.1895, List.of("Pink Line"), "05:53", "23:23", false);
        addStation("sarojini_nagar", "Sarojini Nagar", 28.5745, 77.1989, List.of("Pink Line"), "05:55", "23:25", false);
        addStation("south_extension", "South Extension", 28.5721, 77.2214, List.of("Pink Line"), "05:57", "23:27", false);
        addStation("vinobapuri", "Vinobapuri", 28.5684, 77.2489, List.of("Pink Line"), "05:59", "23:29", false);
        addStation("ashram", "Ashram", 28.5671, 77.2604, List.of("Pink Line"), "06:01", "23:01", false);
        addStation("hazrat_nizamuddin", "Sarai Kale Khan - Hazrat Nizamuddin", 28.5884, 77.2541, List.of("Pink Line"), "06:03", "23:03", false);
        addStation("mayur_vihar_pocket_1", "Mayur Vihar Pocket 1", 28.6089, 77.2994, List.of("Pink Line"), "06:05", "23:05", false);
        addStation("trilokpuri", "Trilokpuri Sanjay Lake", 28.6142, 77.3068, List.of("Pink Line"), "06:07", "23:07", false);
        addStation("east_vinod_nagar", "Vinod Nagar East", 28.6208, 77.3094, List.of("Pink Line"), "06:09", "23:09", false);
        addStation("west_vinod_nagar", "Mandawali - West Vinod Nagar", 28.6274, 77.3082, List.of("Pink Line"), "06:11", "23:11", false);
        addStation("ip_extension", "IP Extension", 28.6338, 77.3071, List.of("Pink Line"), "06:13", "23:13", false);
        addStation("anand_vihar_isbt", "Anand Vihar ISBT", 28.6468, 77.3162, List.of("Pink Line", "Blue Line"), "05:40", "23:30", true);
        addStation("karkarduma", "Karkarduma", 28.6489, 77.3054, List.of("Pink Line", "Blue Line"), "05:42", "23:28", true);
        addStation("karkarduma_court", "Karkarduma Court", 28.6542, 77.2994, List.of("Pink Line"), "06:17", "23:17", false);
        addStation("krishna_nagar", "Krishna Nagar", 28.6604, 77.2912, List.of("Pink Line"), "06:19", "23:19", false);
        addStation("jafrabad", "Jafrabad", 28.6662, 77.2845, List.of("Pink Line"), "06:21", "23:21", false);
        addStation("maujpur_babarpur", "Maujpur-Babarpur", 28.6812, 77.2764, List.of("Pink Line"), "06:23", "23:23", false);
        addStation("gokulpuri", "Gokulpuri", 28.6945, 77.2772, List.of("Pink Line"), "06:25", "23:25", false);
        addStation("johri_enclave", "Johri Enclave", 28.7082, 77.2781, List.of("Pink Line"), "06:27", "23:27", false);
        addStation("shiv_vihar", "Shiv Vihar", 28.7212, 77.2789, List.of("Pink Line"), "06:00", "23:00", false);

        // 7. Magenta Line Stations
        addStation("dabri_mor", "Dabri Mor - Janakpuri South", 28.6145, 77.0895, List.of("Magenta Line"), "05:35", "23:05", false);
        addStation("dashrathpuri", "Dashrathpuri", 28.6012, 77.0945, List.of("Magenta Line"), "05:37", "23:07", false);
        addStation("palam", "Palam", 28.5912, 77.0812, List.of("Magenta Line"), "05:40", "23:10", false);
        addStation("sadaar_bazar_cantt", "Sadar Bazar Cantonment", 28.5812, 77.1312, List.of("Magenta Line"), "05:42", "23:12", false);
        addStation("terminal_1_igi_airport", "Terminal 1 IGI Airport", 28.5612, 77.1214, List.of("Magenta Line"), "05:45", "23:15", false);
        addStation("shankar_vihar", "Shankar Vihar", 28.5512, 77.1412, List.of("Magenta Line"), "05:47", "23:17", false);
        addStation("vasant_vihar", "Vasant Vihar", 28.5612, 77.1612, List.of("Magenta Line"), "05:50", "23:20", false);
        addStation("munirka", "Munirka", 28.5574, 77.1745, List.of("Magenta Line"), "05:52", "23:22", false);
        addStation("rk_puram", "RK Puram", 28.5532, 77.1854, List.of("Magenta Line"), "05:54", "23:24", false);
        addStation("iit_delhi", "IIT", 28.5463, 77.1945, List.of("Magenta Line"), "05:56", "23:26", false);
        addStation("panchsheel_park", "Panchsheel Park", 28.5412, 77.2158, List.of("Magenta Line"), "05:57", "23:27", false);
        addStation("chirag_delhi", "Chirag Delhi", 28.5398, 77.2245, List.of("Magenta Line"), "05:59", "23:29", false);
        addStation("greater_kailash", "Greater Kailash", 28.5412, 77.2389, List.of("Magenta Line"), "06:01", "23:01", false);
        addStation("nehru_enclave", "Nehru Enclave", 28.5456, 77.2512, List.of("Magenta Line"), "06:03", "23:03", false);
        addStation("okhla_nsic", "Okhla NSIC", 28.5512, 77.2654, List.of("Magenta Line"), "06:05", "23:05", false);
        addStation("sukhdev_vihar", "Sukhdev Vihar", 28.5534, 77.2741, List.of("Magenta Line"), "06:07", "23:07", false);
        addStation("jamia_millia_islamia", "Jamia Millia Islamia", 28.5562, 77.2832, List.of("Magenta Line"), "06:09", "23:09", false);
        addStation("okhla_vihar", "Okhla Vihar", 28.5584, 77.2914, List.of("Magenta Line"), "06:11", "23:11", false);
        addStation("jasola_vihar_shaheen_bagh", "Jasola Vihar Shaheen Bagh", 28.5552, 77.3012, List.of("Magenta Line"), "06:13", "23:13", false);
        addStation("kalindi_kunj", "Kalindi Kunj", 28.5502, 77.3104, List.of("Magenta Line"), "06:15", "23:15", false);
        addStation("okhla_bird_sanctuary", "Okhla Bird Sanctuary", 28.5554, 77.3241, List.of("Magenta Line"), "06:17", "23:17", false);

        // 8. Airport Express Stations
        addStation("shivaji_stadium", "Shivaji Stadium", 28.6289, 77.2145, List.of("Airport Express"), "05:00", "23:30", false);
        addStation("dhaula_kuan", "Dhaula Kuan", 28.5912, 77.1612, List.of("Airport Express"), "05:05", "23:25", false);
        addStation("delhi_aerocity", "Delhi Aerocity", 28.5498, 77.1214, List.of("Airport Express"), "05:10", "23:20", false);
        addStation("igi_airport", "IGI Airport (Terminal 3)", 28.5562, 77.0854, List.of("Airport Express"), "05:15", "23:15", false);
        addStation("yashobhoomi_dwarka_sector_25", "Yashobhoomi Dwarka Sector 25", 28.5468, 77.0452, List.of("Airport Express"), "05:20", "23:10", false);

        // 9. Grey Line Stations
        addStation("nangli", "Nangli", 28.6112, 76.9945, List.of("Grey Line"), "06:00", "23:00", false);
        addStation("najafgarh", "Najafgarh", 28.6145, 76.9812, List.of("Grey Line"), "06:02", "23:02", false);
        addStation("dhansa_bus_stand", "Dhansa Bus Stand", 28.6189, 76.9689, List.of("Grey Line"), "06:05", "23:05", false);

        // Explicit, Exact Topological Line Routes (NO Extra/Random Lines, ZERO Missing Stations)
        initExplicitLineRoutes();

        // Exit Gates for Major Stations
        initExitGates();
    }

    private void addStation(String id, String name, double lat, double lng, List<String> lines, String firstTrain, String lastTrain, boolean isInterchange) {
        Station station = new Station(id, name, lat, lng, lines, firstTrain, lastTrain, isInterchange);
        stationMap.put(id, station);
    }

    private void initExplicitLineRoutes() {
        lineStationsMap.put("Yellow Line", List.of(
            "samaypur_badli", "rohini_sector_18", "haiderpur_badli_mor", "jahangirpuri", "adarsh_nagar", "azadpur", "model_town", "gtb_nagar", "vishwa_vidyalaya", "vidhan_sabha", "civil_lines", "kashmere_gate", "chandni_chowk", "chawri_bazar", "new_delhi", "rajiv_chowk", "patel_chowk", "central_secretariat", "udyog_bhawan", "lok_kalyan_marg", "jor_bagh", "dilli_haat_ina", "aiims", "green_park", "hauz_khas", "malviya_nagar", "saket", "qutab_minar", "chhatarpur", "sultanpur", "ghitorni", "arjan_garh", "guru_dronacharya", "sikanderpur", "mg_road", "iffco_chowk", "millennium_city_center"
        ));

        lineStationsMap.put("Blue Line", List.of(
            "dwarka_sector_21", "dwarka_sector_8", "dwarka_sector_9", "dwarka_sector_10", "dwarka_sector_11", "dwarka_sector_12", "dwarka_sector_13", "dwarka_sector_14", "dwarka", "dwarka_mor", "nawada", "uttam_nagar_west", "uttam_nagar_east", "janakpuri_west", "janakpuri_east", "tilak_nagar", "subhash_nagar", "tagore_garden", "rajouri_garden", "ramesh_nagar", "moti_nagar", "kirti_nagar", "shadipur", "patel_nagar", "rajendra_place", "karol_bagh", "jhandewalan", "ramakrishna_ashram_marg", "rajiv_chowk", "mandi_house", "supreme_court", "indraprastha", "yamuna_bank", "akshardham", "mayur_vihar_phase_1", "mayur_vihar_extension", "new_ashok_nagar", "noida_sector_15", "noida_sector_16", "noida_sector_18", "botanical_garden", "golf_course", "noida_city_centre", "noida_sector_34", "noida_sector_52", "noida_sector_61", "noida_sector_59", "noida_sector_62", "noida_electronic_city"
        ));

        // Separate service branch connected at Yamuna Bank.
        lineStationsMap.put("Blue Line Branch", List.of(
            "yamuna_bank", "laxmi_nagar", "nirman_vihar", "preet_vihar",
            "karkarduma_blue", "anand_vihar_isbt_blue", "kaushambi", "vaishali"
        ));

        lineStationsMap.put("Red Line", List.of(
            "rithala", "rohini_west", "rohini_east", "pitampura", "kohat_enclave", "netaji_subhash_place", "keshav_puram", "kanhiya_nagar", "indrelok", "shastri_nagar", "pratap_nagar", "pul_bangash", "tis_hazari", "kashmere_gate", "shastri_park", "seelampur", "welcome", "shahdara", "mansarovar_park", "jhilmil", "dilshad_garden", "shahid_nagar", "raj_bagh", "shahdara_bus_adda", "shyam_park", "mohan_nagar", "arthala", "hindon_river", "shaheed_sthal"
        ));

        lineStationsMap.put("Violet Line", List.of(
            "kashmere_gate", "lal_quila", "jama_masjid", "delhi_gate", "ito", "mandi_house", "janpath", "central_secretariat", "khan_market", "jawaharlal_nehru_stadium", "jangpura", "lajpat_nagar", "moolchand", "kailash_colony", "nehru_place", "kalka_ji_mandir", "govind_puri", "harkesh_nagar", "jasola_apollo", "sarita_vihar", "mohan_estate", "tughlakabad", "badarpur_border", "sarai", "nhpc_chowk", "mewala_maharajpur", "sector_28_faridabad", "badkal_mor", "old_faridabad", "neelam_chowk_ajronda", "bata_chowk", "escorts_mujesar", "sant_surdas_sihi", "raja_nahar_singh"
        ));

        lineStationsMap.put("Green Line", List.of(
            "indrelok", "kirti_nagar", "ashok_park_main", "punjabi_bagh", "shivaji_park", "madipur", "paschim_vihar_east", "paschim_vihar_west", "peeragarhi", "udyog_nagar", "maharaja_surajmal_stadium", "nangloi", "nangloi_railway_station", "rajdhani_park", "mundka", "mundka_industrial_area", "ghevra_metro_station", "tikri_kalan", "tikri_border", "pandit_shree_ram_sharma", "brigadier_hoshiar_singh"
        ));

        lineStationsMap.put("Pink Line", List.of(
            "majlis_park", "azadpur", "shalimar_bagh", "netaji_subhash_place", "shakurpur", "punjabi_bagh_west", "esi_hospital", "rajouri_garden", "mayapuri", "naraina_vihar", "delhi_cantt", "south_campus", "moti_bagh", "bhikaji_cama_place", "sarojini_nagar", "dilli_haat_ina", "south_extension", "lajpat_nagar", "vinobapuri", "ashram", "hazrat_nizamuddin", "mayur_vihar_phase_1", "mayur_vihar_pocket_1", "trilokpuri", "east_vinod_nagar", "west_vinod_nagar", "ip_extension", "anand_vihar_isbt", "karkarduma", "karkarduma_court", "krishna_nagar", "jafrabad", "welcome", "maujpur_babarpur", "gokulpuri", "johri_enclave", "shiv_vihar"
        ));

        lineStationsMap.put("Magenta Line", List.of(
            "janakpuri_west", "dabri_mor", "dashrathpuri", "palam", "sadaar_bazar_cantt", "terminal_1_igi_airport", "shankar_vihar", "vasant_vihar", "munirka", "rk_puram", "iit_delhi", "hauz_khas", "panchsheel_park", "chirag_delhi", "greater_kailash", "nehru_enclave", "kalka_ji_mandir", "okhla_nsic", "sukhdev_vihar", "jamia_millia_islamia", "okhla_vihar", "jasola_vihar_shaheen_bagh", "kalindi_kunj", "okhla_bird_sanctuary", "botanical_garden"
        ));

        lineStationsMap.put("Airport Express", List.of(
            "new_delhi", "shivaji_stadium", "dhaula_kuan", "delhi_aerocity", "igi_airport", "dwarka_sector_21", "yashobhoomi_dwarka_sector_25"
        ));

        lineStationsMap.put("Grey Line", List.of(
            "dwarka", "nangli", "najafgarh", "dhansa_bus_stand"
        ));
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

        stationGatesMap.put("new_delhi", List.of(
            new ExitGate("Gate 1", "Ajmeri Gate / New Delhi Railway Station", 2, true, true, "Direct covered skywalk connection to Platform 16 of New Delhi Railway Station.", List.of("Prepaid Taxi", "Auto Stand")),
            new ExitGate("Gate 2", "Pahar Ganj / Hotel Hub", 4, false, true, "Closest exit for Pahar Ganj market and budget hotel area.", List.of("Auto Stand"))
        ));

        stationGatesMap.put("chandni_chowk", List.of(
            new ExitGate("Gate 1", "Chandni Chowk Main Market / Town Hall", 3, true, true, "Direct exit to Town Hall and main electronics market.", List.of("E-Rickshaw")),
            new ExitGate("Gate 3", "Old Delhi Railway Station (DLI)", 2, true, true, "Direct subway connecting to Old Delhi Railway Station Concourse.", List.of("Prepaid Auto"))
        ));
    }

    public Map<String, Station> getAllStations() { return stationMap; }
    public Station getStation(String id) { return stationMap.get(id); }
    public Map<String, List<String>> getLineStationsMap() { return lineStationsMap; }
    public List<ExitGate> getExitGates(String stationId) { return stationGatesMap.getOrDefault(stationId, Collections.emptyList()); }
}
