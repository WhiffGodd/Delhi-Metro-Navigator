// ============================================================
// Delhi Metro Complete Network Data
// Lines: Yellow, Blue, Blue Branch, Red, Violet, Green,
//        Pink, Magenta, Orange (Airport), Aqua (Rapid Metro)
// ============================================================

const metroData = {
  delhi: {
    name: "Delhi Metro",
    center: [28.6350, 77.2180],
    zoom: 11,
    lines: [

      // ─────────────────────────────────────────────
      // YELLOW LINE (Line 2): Samaypur Badli ↔ HUDA City Centre
      // ─────────────────────────────────────────────
      {
        id: "yellow",
        name: "Yellow Line",
        color: "#FFD700",
        textColor: "#000000",
        headway: 240,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Samaypur Badli",         coords: [28.7454, 77.1354], travelTime: 0,   crowdWeight: 0.8 },
          { name: "Rohini Sector 18-19",    coords: [28.7360, 77.1524], travelTime: 120, crowdWeight: 0.7 },
          { name: "Haiderpur Badli Mor",    coords: [28.7309, 77.1618], travelTime: 100, crowdWeight: 0.7 },
          { name: "Jahangirpuri",           coords: [28.7262, 77.1704], travelTime: 100, crowdWeight: 0.9 },
          { name: "Adarsh Nagar",           coords: [28.7165, 77.1782], travelTime: 130, crowdWeight: 1.0 },
          { name: "Azadpur",                coords: [28.7091, 77.1874], travelTime: 120, crowdWeight: 1.5 },
          { name: "Model Town",             coords: [28.7033, 77.1961], travelTime: 100, crowdWeight: 1.2 },
          { name: "GTB Nagar",              coords: [28.6974, 77.2081], travelTime: 120, crowdWeight: 1.3 },
          { name: "Vishwavidyalaya",        coords: [28.6946, 77.2152], travelTime: 90,  crowdWeight: 1.5 },
          { name: "Vidhan Sabha",           coords: [28.6819, 77.2212], travelTime: 120, crowdWeight: 1.1 },
          { name: "Civil Lines",            coords: [28.6757, 77.2256], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Kashmere Gate",          coords: [28.6675, 77.2282], travelTime: 100, crowdWeight: 2.2 },
          { name: "Chandni Chowk",          coords: [28.6578, 77.2301], travelTime: 90,  crowdWeight: 1.8 },
          { name: "Chawri Bazar",           coords: [28.6502, 77.2280], travelTime: 80,  crowdWeight: 1.6 },
          { name: "New Delhi",              coords: [28.6431, 77.2223], travelTime: 100, crowdWeight: 1.9 },
          { name: "Rajiv Chowk",           coords: [28.6304, 77.2177], travelTime: 120, crowdWeight: 2.5 },
          { name: "Patel Chowk",           coords: [28.6231, 77.2148], travelTime: 90,  crowdWeight: 1.4 },
          { name: "Central Secretariat",   coords: [28.6149, 77.2114], travelTime: 100, crowdWeight: 2.0 },
          { name: "Udyog Bhawan",          coords: [28.6109, 77.2107], travelTime: 80,  crowdWeight: 1.3 },
          { name: "Lok Kalyan Marg",       coords: [28.6005, 77.2050], travelTime: 120, crowdWeight: 1.1 },
          { name: "Jor Bagh",              coords: [28.5910, 77.2065], travelTime: 100, crowdWeight: 1.0 },
          { name: "INA",                   coords: [28.5746, 77.2102], travelTime: 130, crowdWeight: 1.4 },
          { name: "AIIMS",                 coords: [28.5684, 77.2111], travelTime: 80,  crowdWeight: 1.6 },
          { name: "Green Park",            coords: [28.5587, 77.2064], travelTime: 100, crowdWeight: 1.2 },
          { name: "Hauz Khas",             coords: [28.5434, 77.2064], travelTime: 130, crowdWeight: 1.7 },
          { name: "Malviya Nagar",         coords: [28.5273, 77.2045], travelTime: 130, crowdWeight: 1.1 },
          { name: "Saket",                 coords: [28.5204, 77.2014], travelTime: 100, crowdWeight: 1.3 },
          { name: "Qutab Minar",           coords: [28.5224, 77.1856], travelTime: 150, crowdWeight: 1.0 },
          { name: "Chhattarpur",           coords: [28.5075, 77.1779], travelTime: 140, crowdWeight: 1.1 },
          { name: "Sultanpur",             coords: [28.4981, 77.1773], travelTime: 100, crowdWeight: 0.9 },
          { name: "Ghitorni",              coords: [28.4877, 77.1587], travelTime: 140, crowdWeight: 0.8 },
          { name: "Arjangarh",             coords: [28.4819, 77.1401], travelTime: 140, crowdWeight: 0.7 },
          { name: "Guru Dronacharya",      coords: [28.4755, 77.1041], travelTime: 200, crowdWeight: 1.1 },
          { name: "Sikanderpur",           coords: [28.4836, 77.0889], travelTime: 130, crowdWeight: 1.8 },
          { name: "MG Road",               coords: [28.4799, 77.0793], travelTime: 90,  crowdWeight: 1.6 },
          { name: "IFFCO Chowk",           coords: [28.4718, 77.0714], travelTime: 100, crowdWeight: 1.3 },
          { name: "HUDA City Centre",      coords: [28.4593, 77.0725], travelTime: 120, crowdWeight: 1.2 }
        ]
      },

      // ─────────────────────────────────────────────
      // BLUE LINE (Line 3): Dwarka Sector 21 ↔ Noida Electronic City / Vaishali
      // ─────────────────────────────────────────────
      {
        id: "blue",
        name: "Blue Line",
        color: "#0085CA",
        textColor: "#FFFFFF",
        headway: 240,
        firstTrain: "06:00",
        lastTrain: "23:30",
        stations: [
          { name: "Dwarka Sector 21",      coords: [28.5754, 77.0601], travelTime: 0,   crowdWeight: 0.9 },
          { name: "Dwarka Sector 8",       coords: [28.5821, 77.0510], travelTime: 120, crowdWeight: 0.9 },
          { name: "Dwarka Sector 9",       coords: [28.5891, 77.0484], travelTime: 90,  crowdWeight: 0.8 },
          { name: "Dwarka Sector 10",      coords: [28.5956, 77.0461], travelTime: 80,  crowdWeight: 0.8 },
          { name: "Dwarka Sector 11",      coords: [28.5989, 77.0414], travelTime: 80,  crowdWeight: 0.9 },
          { name: "Dwarka Sector 12",      coords: [28.6010, 77.0370], travelTime: 70,  crowdWeight: 0.9 },
          { name: "Dwarka Sector 13",      coords: [28.6029, 77.0313], travelTime: 80,  crowdWeight: 0.8 },
          { name: "Dwarka Sector 14",      coords: [28.6043, 77.0245], travelTime: 80,  crowdWeight: 0.8 },
          { name: "Dwarka",                coords: [28.5921, 77.0205], travelTime: 110, crowdWeight: 1.0 },
          { name: "Dwarka Mor",            coords: [28.6095, 77.0387], travelTime: 130, crowdWeight: 1.2 },
          { name: "Nawada",                coords: [28.6160, 77.0521], travelTime: 100, crowdWeight: 1.1 },
          { name: "Uttam Nagar West",      coords: [28.6214, 77.0621], travelTime: 90,  crowdWeight: 1.2 },
          { name: "Uttam Nagar East",      coords: [28.6269, 77.0695], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Janakpuri West",        coords: [28.6291, 77.0775], travelTime: 100, crowdWeight: 1.5 },
          { name: "Janakpuri East",        coords: [28.6316, 77.0869], travelTime: 100, crowdWeight: 1.4 },
          { name: "Tilak Nagar",           coords: [28.6348, 77.1009], travelTime: 120, crowdWeight: 1.3 },
          { name: "Subhash Nagar",         coords: [28.6387, 77.1091], travelTime: 90,  crowdWeight: 1.2 },
          { name: "Tagore Garden",         coords: [28.6411, 77.1152], travelTime: 80,  crowdWeight: 1.2 },
          { name: "Rajouri Garden",        coords: [28.6412, 77.1235], travelTime: 90,  crowdWeight: 1.7 },
          { name: "Ramesh Nagar",          coords: [28.6448, 77.1339], travelTime: 100, crowdWeight: 1.3 },
          { name: "Moti Nagar",            coords: [28.6468, 77.1434], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Kirti Nagar",           coords: [28.6559, 77.1504], travelTime: 110, crowdWeight: 1.3 },
          { name: "Shadipur",              coords: [28.6503, 77.1620], travelTime: 110, crowdWeight: 1.2 },
          { name: "Patel Nagar",           coords: [28.6457, 77.1751], travelTime: 120, crowdWeight: 1.3 },
          { name: "Rajendra Place",        coords: [28.6465, 77.1851], travelTime: 100, crowdWeight: 1.4 },
          { name: "Karol Bagh",            coords: [28.6441, 77.1895], travelTime: 80,  crowdWeight: 1.4 },
          { name: "Jhandewalan",           coords: [28.6421, 77.2005], travelTime: 100, crowdWeight: 1.3 },
          { name: "Ramakrishna Ashram Marg", coords: [28.6387, 77.2094], travelTime: 100, crowdWeight: 1.2 },
          { name: "Rajiv Chowk",          coords: [28.6304, 77.2177], travelTime: 100, crowdWeight: 2.5 },
          { name: "Barakhamba Road",       coords: [28.6295, 77.2286], travelTime: 80,  crowdWeight: 1.8 },
          { name: "Mandi House",           coords: [28.6258, 77.2338], travelTime: 70,  crowdWeight: 1.9 },
          { name: "Supreme Court",         coords: [28.6238, 77.2402], travelTime: 80,  crowdWeight: 1.6 },
          { name: "Pragati Maidan",        coords: [28.6222, 77.2492], travelTime: 90,  crowdWeight: 1.5 },
          { name: "Indraprastha",          coords: [28.6218, 77.2572], travelTime: 80,  crowdWeight: 1.4 },
          { name: "Yamuna Bank",           coords: [28.6214, 77.2662], travelTime: 90,  crowdWeight: 1.5 },
          { name: "Laxmi Nagar",           coords: [28.6291, 77.2779], travelTime: 120, crowdWeight: 1.6 },
          { name: "Nirman Vihar",          coords: [28.6376, 77.2887], travelTime: 100, crowdWeight: 1.4 },
          { name: "Preet Vihar",           coords: [28.6416, 77.2996], travelTime: 100, crowdWeight: 1.3 },
          { name: "Karkarduma",            coords: [28.6479, 77.3079], travelTime: 90,  crowdWeight: 1.2 },
          { name: "Anand Vihar ISBT",      coords: [28.6467, 77.3153], travelTime: 90,  crowdWeight: 1.5 },
          { name: "Kaushambi",             coords: [28.6451, 77.3234], travelTime: 90,  crowdWeight: 1.4 },
          { name: "Vaishali",              coords: [28.6441, 77.3354], travelTime: 120, crowdWeight: 1.3 }
        ]
      },

      // ─────────────────────────────────────────────
      // BLUE LINE BRANCH: Yamuna Bank ↔ Noida Electronic City
      // ─────────────────────────────────────────────
      {
        id: "blue_branch",
        name: "Blue Line (Noida Branch)",
        color: "#0085CA",
        textColor: "#FFFFFF",
        headway: 300,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Yamuna Bank",           coords: [28.6214, 77.2662], travelTime: 0,   crowdWeight: 1.5 },
          { name: "Akshardham",            coords: [28.6146, 77.2779], travelTime: 130, crowdWeight: 1.4 },
          { name: "Mayur Vihar Phase 1",   coords: [28.6074, 77.2938], travelTime: 130, crowdWeight: 1.5 },
          { name: "Mayur Vihar Extension", coords: [28.6025, 77.3037], travelTime: 100, crowdWeight: 1.3 },
          { name: "New Ashok Nagar",       coords: [28.5960, 77.3102], travelTime: 90,  crowdWeight: 1.2 },
          { name: "Noida Sector 15",       coords: [28.5846, 77.3196], travelTime: 120, crowdWeight: 1.3 },
          { name: "Noida Sector 16",       coords: [28.5793, 77.3235], travelTime: 80,  crowdWeight: 1.4 },
          { name: "Noida Sector 18",       coords: [28.5707, 77.3261], travelTime: 100, crowdWeight: 1.6 },
          { name: "Botanical Garden",      coords: [28.5635, 77.3341], travelTime: 120, crowdWeight: 1.3 },
          { name: "Golf Course",           coords: [28.5598, 77.3457], travelTime: 120, crowdWeight: 1.0 },
          { name: "Noida City Centre",     coords: [28.5747, 77.3560], travelTime: 180, crowdWeight: 1.3 },
          { name: "Noida Sector 34",       coords: [28.5815, 77.3620], travelTime: 100, crowdWeight: 1.1 },
          { name: "Noida Sector 52",       coords: [28.5897, 77.3635], travelTime: 100, crowdWeight: 1.0 },
          { name: "Noida Sector 61",       coords: [28.5979, 77.3660], travelTime: 90,  crowdWeight: 0.9 },
          { name: "Noida Sector 59",       coords: [28.6075, 77.3670], travelTime: 110, crowdWeight: 0.9 },
          { name: "Noida Sector 62",       coords: [28.6174, 77.3688], travelTime: 100, crowdWeight: 1.0 },
          { name: "Noida Electronic City", coords: [28.6272, 77.3725], travelTime: 110, crowdWeight: 1.1 }
        ]
      },

      // ─────────────────────────────────────────────
      // RED LINE (Line 1): Rithala ↔ Shaheed Sthal (New Bus Adda)
      // ─────────────────────────────────────────────
      {
        id: "red",
        name: "Red Line",
        color: "#E31837",
        textColor: "#FFFFFF",
        headway: 300,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Rithala",               coords: [28.7208, 77.1073], travelTime: 0,   crowdWeight: 0.8 },
          { name: "Rohini West",           coords: [28.7153, 77.1132], travelTime: 100, crowdWeight: 0.9 },
          { name: "Rohini East",           coords: [28.7130, 77.1215], travelTime: 80,  crowdWeight: 1.1 },
          { name: "Pitampura",             coords: [28.6990, 77.1354], travelTime: 130, crowdWeight: 1.2 },
          { name: "Kohat Enclave",         coords: [28.6933, 77.1451], travelTime: 100, crowdWeight: 1.1 },
          { name: "Netaji Subhash Place",  coords: [28.6900, 77.1517], travelTime: 90,  crowdWeight: 1.6 },
          { name: "Keshav Puram",          coords: [28.6862, 77.1584], travelTime: 90,  crowdWeight: 1.4 },
          { name: "Kanhaiya Nagar",        coords: [28.6822, 77.1635], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Inderlok",              coords: [28.6732, 77.1652], travelTime: 110, crowdWeight: 1.8 },
          { name: "Shastri Nagar",         coords: [28.6737, 77.1801], travelTime: 130, crowdWeight: 1.6 },
          { name: "Pratap Nagar",          coords: [28.6720, 77.1918], travelTime: 110, crowdWeight: 1.5 },
          { name: "Pulbangash",            coords: [28.6706, 77.2077], travelTime: 130, crowdWeight: 1.3 },
          { name: "Tis Hazari",            coords: [28.6688, 77.2162], travelTime: 90,  crowdWeight: 1.4 },
          { name: "Kashmere Gate",         coords: [28.6675, 77.2282], travelTime: 110, crowdWeight: 2.2 },
          { name: "Shastri Park",          coords: [28.6748, 77.2525], travelTime: 200, crowdWeight: 1.3 },
          { name: "Seelampur",             coords: [28.6761, 77.2641], travelTime: 110, crowdWeight: 1.4 },
          { name: "Welcome",               coords: [28.6723, 77.2783], travelTime: 130, crowdWeight: 1.3 },
          { name: "Shahdara",              coords: [28.6704, 77.2902], travelTime: 120, crowdWeight: 1.4 },
          { name: "Mansarovar Park",       coords: [28.6700, 77.3030], travelTime: 130, crowdWeight: 1.2 },
          { name: "Jhilmil",               coords: [28.6691, 77.3128], travelTime: 100, crowdWeight: 1.1 },
          { name: "Dilshad Garden",        coords: [28.6759, 77.3217], travelTime: 110, crowdWeight: 1.1 },
          { name: "Shaheed Nagar",         coords: [28.6725, 77.3357], travelTime: 130, crowdWeight: 1.0 },
          { name: "Shaheed Sthal",         coords: [28.6705, 77.3592], travelTime: 200, crowdWeight: 0.9 }
        ]
      },

      // ─────────────────────────────────────────────
      // VIOLET LINE (Line 6): Kashmere Gate ↔ Escorts Mujesar
      // ─────────────────────────────────────────────
      {
        id: "violet",
        name: "Violet Line",
        color: "#9400D3",
        textColor: "#FFFFFF",
        headway: 300,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Kashmere Gate",         coords: [28.6675, 77.2282], travelTime: 0,   crowdWeight: 2.2 },
          { name: "Lal Quila",             coords: [28.6561, 77.2404], travelTime: 130, crowdWeight: 1.6 },
          { name: "Jama Masjid",           coords: [28.6509, 77.2352], travelTime: 100, crowdWeight: 1.5 },
          { name: "Delhi Gate",            coords: [28.6444, 77.2417], travelTime: 100, crowdWeight: 1.3 },
          { name: "ITO",                   coords: [28.6321, 77.2467], travelTime: 130, crowdWeight: 1.5 },
          { name: "Mandi House",           coords: [28.6258, 77.2338], travelTime: 140, crowdWeight: 1.9 },
          { name: "Janpath",               coords: [28.6221, 77.2199], travelTime: 130, crowdWeight: 1.4 },
          { name: "Central Secretariat",   coords: [28.6149, 77.2114], travelTime: 120, crowdWeight: 2.0 },
          { name: "Khan Market",           coords: [28.6015, 77.2274], travelTime: 160, crowdWeight: 1.3 },
          { name: "JLN Stadium",           coords: [28.5916, 77.2343], travelTime: 110, crowdWeight: 1.1 },
          { name: "Jangpura",              coords: [28.5816, 77.2422], travelTime: 110, crowdWeight: 0.9 },
          { name: "Lajpat Nagar",          coords: [28.5707, 77.2435], travelTime: 110, crowdWeight: 1.7 },
          { name: "Moolchand",             coords: [28.5623, 77.2372], travelTime: 100, crowdWeight: 1.5 },
          { name: "Kailash Colony",        coords: [28.5522, 77.2383], travelTime: 100, crowdWeight: 1.3 },
          { name: "Nehru Place",           coords: [28.5478, 77.2517], travelTime: 130, crowdWeight: 1.5 },
          { name: "Kalkaji Mandir",        coords: [28.5495, 77.2584], travelTime: 80,  crowdWeight: 1.6 },
          { name: "Govind Puri",           coords: [28.5444, 77.2637], travelTime: 80,  crowdWeight: 1.4 },
          { name: "Harkesh Nagar Okhla",   coords: [28.5347, 77.2731], travelTime: 120, crowdWeight: 1.2 },
          { name: "Jasola Apollo",         coords: [28.5263, 77.2875], travelTime: 140, crowdWeight: 1.1 },
          { name: "Okhla NSIC",            coords: [28.5211, 77.2966], travelTime: 100, crowdWeight: 1.0 },
          { name: "Mohan Estate",          coords: [28.5091, 77.2999], travelTime: 130, crowdWeight: 0.9 },
          { name: "Tughlakabad",           coords: [28.4985, 77.3044], travelTime: 120, crowdWeight: 1.0 },
          { name: "Badarpur Border",       coords: [28.4913, 77.3032], travelTime: 100, crowdWeight: 1.0 },
          { name: "Sarita Vihar",          coords: [28.4818, 77.3091], travelTime: 110, crowdWeight: 0.9 },
          { name: "Mohan Nagar",           coords: [28.4724, 77.3079], travelTime: 110, crowdWeight: 0.8 },
          { name: "Sector 28 Faridabad",   coords: [28.4581, 77.3124], travelTime: 150, crowdWeight: 0.8 },
          { name: "Badkal Mor",            coords: [28.4453, 77.3167], travelTime: 140, crowdWeight: 0.7 },
          { name: "Old Faridabad",         coords: [28.4344, 77.3167], travelTime: 130, crowdWeight: 0.9 },
          { name: "Neelam Chowk Ajronda",  coords: [28.4229, 77.3178], travelTime: 130, crowdWeight: 0.8 },
          { name: "Bata Chowk",            coords: [28.4108, 77.3178], travelTime: 130, crowdWeight: 0.7 },
          { name: "Escorts Mujesar",       coords: [28.4003, 77.3174], travelTime: 130, crowdWeight: 0.7 }
        ]
      },

      // ─────────────────────────────────────────────
      // GREEN LINE (Line 5): Inderlok ↔ Brigadier Hoshiyar Singh
      // ─────────────────────────────────────────────
      {
        id: "green",
        name: "Green Line",
        color: "#00A651",
        textColor: "#FFFFFF",
        headway: 360,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Inderlok",              coords: [28.6732, 77.1652], travelTime: 0,   crowdWeight: 1.8 },
          { name: "Ashok Park Main",       coords: [28.6700, 77.1555], travelTime: 100, crowdWeight: 1.3 },
          { name: "Punjabi Bagh West",     coords: [28.6660, 77.1396], travelTime: 130, crowdWeight: 1.5 },
          { name: "ESI Hospital",          coords: [28.6555, 77.1233], travelTime: 150, crowdWeight: 1.2 },
          { name: "Peeragarhi",            coords: [28.6652, 77.0966], travelTime: 170, crowdWeight: 1.2 },
          { name: "Paschim Vihar East",    coords: [28.6694, 77.0836], travelTime: 120, crowdWeight: 1.1 },
          { name: "Paschim Vihar West",    coords: [28.6699, 77.0733], travelTime: 100, crowdWeight: 1.1 },
          { name: "Madipur",               coords: [28.6671, 77.0628], travelTime: 100, crowdWeight: 1.0 },
          { name: "Shivaji Park",          coords: [28.6628, 77.0528], travelTime: 110, crowdWeight: 1.0 },
          { name: "Punjabi Bagh",          coords: [28.6659, 77.1297], travelTime: 110, crowdWeight: 1.3 },
          { name: "Maharaja Surajmal Stadium", coords: [28.6547, 77.1076], travelTime: 150, crowdWeight: 1.0 },
          { name: "Nangloi",               coords: [28.6564, 77.0754], travelTime: 200, crowdWeight: 1.2 },
          { name: "Nangloi Railway Station", coords: [28.6567, 77.0655], travelTime: 90,  crowdWeight: 1.1 },
          { name: "Rajdhani Park",         coords: [28.6557, 77.0535], travelTime: 100, crowdWeight: 0.9 },
          { name: "Mundka",                coords: [28.6530, 77.0350], travelTime: 180, crowdWeight: 0.9 },
          { name: "Mundka Industrial Area", coords: [28.6466, 77.0263], travelTime: 90,  crowdWeight: 0.8 },
          { name: "Ghevra",                coords: [28.6386, 77.0183], travelTime: 110, crowdWeight: 0.7 },
          { name: "Tikri Kalan",           coords: [28.6327, 77.0014], travelTime: 130, crowdWeight: 0.7 },
          { name: "Tikri Border",          coords: [28.6274, 76.9912], travelTime: 110, crowdWeight: 0.6 },
          { name: "Pandit Shree Ram Sharma", coords: [28.6226, 76.9790], travelTime: 130, crowdWeight: 0.6 },
          { name: "Bahadurgarh City",      coords: [28.6194, 76.9694], travelTime: 100, crowdWeight: 0.7 },
          { name: "Brigadier Hoshiyar Singh", coords: [28.6085, 76.9588], travelTime: 140, crowdWeight: 0.6 }
        ]
      },

      // ─────────────────────────────────────────────
      // PINK LINE (Line 7): Majlis Park ↔ Shiv Vihar
      // ─────────────────────────────────────────────
      {
        id: "pink",
        name: "Pink Line",
        color: "#FF69B4",
        textColor: "#FFFFFF",
        headway: 360,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Majlis Park",           coords: [28.7243, 77.1558], travelTime: 0,   crowdWeight: 0.8 },
          { name: "Azadpur",               coords: [28.7091, 77.1874], travelTime: 200, crowdWeight: 1.5 },
          { name: "Shalimar Bagh",         coords: [28.6994, 77.1633], travelTime: 150, crowdWeight: 1.1 },
          { name: "Netaji Subhash Place",  coords: [28.6900, 77.1517], travelTime: 120, crowdWeight: 1.6 },
          { name: "Shakurpur",             coords: [28.6855, 77.1291], travelTime: 180, crowdWeight: 1.1 },
          { name: "Punjabi Bagh West",     coords: [28.6660, 77.1396], travelTime: 200, crowdWeight: 1.5 },
          { name: "ESI Basai Darapur",     coords: [28.6571, 77.1549], travelTime: 130, crowdWeight: 1.1 },
          { name: "Rajouri Garden",        coords: [28.6412, 77.1235], travelTime: 220, crowdWeight: 1.7 },
          { name: "Mayapuri",              coords: [28.6294, 77.1167], travelTime: 150, crowdWeight: 1.1 },
          { name: "Naraina Vihar",         coords: [28.6260, 77.1327], travelTime: 130, crowdWeight: 1.2 },
          { name: "Delhi Cantonment",      coords: [28.6047, 77.1280], travelTime: 200, crowdWeight: 1.0 },
          { name: "Durgabai Deshmukh South Campus", coords: [28.5866, 77.1640], travelTime: 230, crowdWeight: 1.2 },
          { name: "Sir Vishweshwaraiah Moti Bagh", coords: [28.5780, 77.1778], travelTime: 130, crowdWeight: 1.1 },
          { name: "Bhikaji Cama Place",    coords: [28.5679, 77.1882], travelTime: 130, crowdWeight: 1.3 },
          { name: "Sarojini Nagar",        coords: [28.5734, 77.1991], travelTime: 120, crowdWeight: 1.4 },
          { name: "INA",                   coords: [28.5746, 77.2102], travelTime: 110, crowdWeight: 1.4 },
          { name: "South Extension",       coords: [28.5730, 77.2217], travelTime: 110, crowdWeight: 1.3 },
          { name: "Lajpat Nagar",          coords: [28.5707, 77.2435], travelTime: 180, crowdWeight: 1.7 },
          { name: "Vinobapuri",            coords: [28.5669, 77.2573], travelTime: 130, crowdWeight: 1.1 },
          { name: "Ashram",                coords: [28.5634, 77.2627], travelTime: 90,  crowdWeight: 1.2 },
          { name: "Sarai Kale Khan Nizamuddin", coords: [28.5596, 77.2698], travelTime: 100, crowdWeight: 1.4 },
          { name: "Hazrat Nizamuddin",     coords: [28.5546, 77.2645], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Mayur Vihar Phase 1",   coords: [28.6074, 77.2938], travelTime: 300, crowdWeight: 1.5 },
          { name: "Mayur Vihar Pocket 1",  coords: [28.5993, 77.3010], travelTime: 130, crowdWeight: 1.2 },
          { name: "Trilokpuri Sanjay Lake", coords: [28.6020, 77.3157], travelTime: 150, crowdWeight: 1.1 },
          { name: "East Vinod Nagar",      coords: [28.6084, 77.3238], travelTime: 110, crowdWeight: 1.0 },
          { name: "Mandawali West Vinod Nagar", coords: [28.6166, 77.3302], travelTime: 110, crowdWeight: 1.0 },
          { name: "IP Extension",          coords: [28.6241, 77.3223], travelTime: 110, crowdWeight: 1.0 },
          { name: "Anand Vihar ISBT",      coords: [28.6467, 77.3153], travelTime: 200, crowdWeight: 1.5 },
          { name: "Karkarduma Court",      coords: [28.6491, 77.3078], travelTime: 90,  crowdWeight: 1.1 },
          { name: "Krishna Nagar",         coords: [28.6574, 77.2918], travelTime: 150, crowdWeight: 1.2 },
          { name: "Kailash Nagar",         coords: [28.6631, 77.2874], travelTime: 90,  crowdWeight: 1.1 },
          { name: "Maujpur Babarpur",      coords: [28.6742, 77.2815], travelTime: 130, crowdWeight: 1.2 },
          { name: "Gokulpuri",             coords: [28.6852, 77.2847], travelTime: 130, crowdWeight: 1.1 },
          { name: "Johri Enclave",         coords: [28.6956, 77.2856], travelTime: 120, crowdWeight: 0.9 },
          { name: "Shiv Vihar",            coords: [28.7063, 77.2878], travelTime: 120, crowdWeight: 0.8 }
        ]
      },

      // ─────────────────────────────────────────────
      // MAGENTA LINE (Line 8): Janakpuri West ↔ Botanical Garden
      // ─────────────────────────────────────────────
      {
        id: "magenta",
        name: "Magenta Line",
        color: "#C40380",
        textColor: "#FFFFFF",
        headway: 360,
        firstTrain: "06:00",
        lastTrain: "23:00",
        stations: [
          { name: "Janakpuri West",        coords: [28.6291, 77.0775], travelTime: 0,   crowdWeight: 1.5 },
          { name: "Dabri Mor",             coords: [28.6185, 77.0764], travelTime: 110, crowdWeight: 1.1 },
          { name: "Dashrath Puri",         coords: [28.6096, 77.0804], travelTime: 110, crowdWeight: 1.0 },
          { name: "Palam",                 coords: [28.5998, 77.0888], travelTime: 120, crowdWeight: 1.1 },
          { name: "Sadar Bazar Cantonment", coords: [28.5900, 77.1023], travelTime: 130, crowdWeight: 1.0 },
          { name: "Terminal 1 IGI Airport", coords: [28.5716, 77.0957], travelTime: 170, crowdWeight: 1.3 },
          { name: "Shankar Vihar",         coords: [28.5623, 77.1072], travelTime: 130, crowdWeight: 0.9 },
          { name: "Vasant Vihar",          coords: [28.5547, 77.1380], travelTime: 190, crowdWeight: 1.2 },
          { name: "Munirka",               coords: [28.5490, 77.1713], travelTime: 180, crowdWeight: 1.3 },
          { name: "R K Puram",             coords: [28.5601, 77.1862], travelTime: 130, crowdWeight: 1.1 },
          { name: "IIT Delhi",             coords: [28.5456, 77.1921], travelTime: 150, crowdWeight: 1.3 },
          { name: "Hauz Khas",             coords: [28.5434, 77.2064], travelTime: 130, crowdWeight: 1.7 },
          { name: "Panchsheel Park",       coords: [28.5373, 77.2134], travelTime: 100, crowdWeight: 1.1 },
          { name: "Chirag Delhi",          coords: [28.5321, 77.2189], travelTime: 100, crowdWeight: 1.2 },
          { name: "Greater Kailash",       coords: [28.5254, 77.2337], travelTime: 150, crowdWeight: 1.3 },
          { name: "Nehru Enclave",         coords: [28.5280, 77.2461], travelTime: 120, crowdWeight: 1.1 },
          { name: "Kalkaji Mandir",        coords: [28.5495, 77.2584], travelTime: 180, crowdWeight: 1.6 },
          { name: "Okhla NSIC",            coords: [28.5211, 77.2966], travelTime: 250, crowdWeight: 1.0 },
          { name: "Sukhdev Vihar",         coords: [28.5518, 77.2833], travelTime: 180, crowdWeight: 1.1 },
          { name: "Jamia Millia Islamia",  coords: [28.5619, 77.2878], travelTime: 110, crowdWeight: 1.3 },
          { name: "Okhla Vihar",           coords: [28.5669, 77.3018], travelTime: 130, crowdWeight: 1.0 },
          { name: "Jasola Vihar Shaheen Bagh", coords: [28.5694, 77.3121], travelTime: 100, crowdWeight: 1.0 },
          { name: "Kalindi Kunj",          coords: [28.5605, 77.3186], travelTime: 130, crowdWeight: 1.0 },
          { name: "Okhla Bird Sanctuary",  coords: [28.5473, 77.3234], travelTime: 130, crowdWeight: 0.8 },
          { name: "Botanical Garden",      coords: [28.5635, 77.3341], travelTime: 180, crowdWeight: 1.3 }
        ]
      },

      // ─────────────────────────────────────────────
      // ORANGE LINE / AIRPORT EXPRESS: New Delhi ↔ Dwarka Sector 21
      // ─────────────────────────────────────────────
      {
        id: "orange",
        name: "Airport Express Line",
        color: "#F26522",
        textColor: "#FFFFFF",
        headway: 600,
        firstTrain: "05:10",
        lastTrain: "23:30",
        stations: [
          { name: "New Delhi",             coords: [28.6431, 77.2223], travelTime: 0,   crowdWeight: 1.9 },
          { name: "Shivaji Stadium",       coords: [28.6373, 77.2108], travelTime: 180, crowdWeight: 1.2 },
          { name: "Dhaula Kuan",           coords: [28.5978, 77.1538], travelTime: 300, crowdWeight: 1.0 },
          { name: "Delhi Aerocity",        coords: [28.5569, 77.0928], travelTime: 300, crowdWeight: 1.1 },
          { name: "IGI Airport T3",        coords: [28.5563, 77.0889], travelTime: 120, crowdWeight: 1.5 },
          { name: "Dwarka Sector 21",      coords: [28.5754, 77.0601], travelTime: 300, crowdWeight: 0.9 }
        ]
      },

      // ─────────────────────────────────────────────
      // GREY LINE (Line 9): Dwarka ↔ Najafgarh
      // ─────────────────────────────────────────────
      {
        id: "grey",
        name: "Grey Line",
        color: "#9E9E9E",
        textColor: "#FFFFFF",
        headway: 420,
        firstTrain: "06:05",
        lastTrain: "22:50",
        stations: [
          { name: "Dwarka",                coords: [28.5921, 77.0205], travelTime: 0,   crowdWeight: 1.0 },
          { name: "Nangli",                coords: [28.5893, 77.0026], travelTime: 150, crowdWeight: 0.7 },
          { name: "Najafgarh",             coords: [28.6076, 76.9793], travelTime: 200, crowdWeight: 0.8 }
        ]
      },

      // ─────────────────────────────────────────────
      // AQUA LINE (Rapid Metro Gurgaon): Sikanderpur ↔ Sector 56
      // ─────────────────────────────────────────────
      {
        id: "aqua",
        name: "Aqua Line (Rapid Metro)",
        color: "#00BCD4",
        textColor: "#FFFFFF",
        headway: 420,
        firstTrain: "06:00",
        lastTrain: "22:00",
        stations: [
          { name: "Sikanderpur",           coords: [28.4836, 77.0889], travelTime: 0,   crowdWeight: 1.8 },
          { name: "Phase 1 DLF City",      coords: [28.4946, 77.0892], travelTime: 90,  crowdWeight: 1.3 },
          { name: "Galleria DLF Phase IV", coords: [28.4768, 77.0979], travelTime: 120, crowdWeight: 1.2 },
          { name: "DLF Phase 3",           coords: [28.4660, 77.0999], travelTime: 90,  crowdWeight: 1.1 },
          { name: "Moulsari Avenue",       coords: [28.4608, 77.1063], travelTime: 90,  crowdWeight: 1.1 },
          { name: "Cybercity",             coords: [28.4945, 77.0871], travelTime: 200, crowdWeight: 1.4 },
          { name: "Belvedere Towers",      coords: [28.4869, 77.0876], travelTime: 90,  crowdWeight: 1.0 },
          { name: "Sector 53-54",          coords: [28.4600, 77.1135], travelTime: 150, crowdWeight: 0.9 },
          { name: "Sector 54 Chowk",       coords: [28.4534, 77.1162], travelTime: 80,  crowdWeight: 0.9 },
          { name: "Sector 55-56",          coords: [28.4476, 77.1197], travelTime: 80,  crowdWeight: 0.8 }
        ]
      }
    ]
  }
};

// Export for Node/browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = metroData;
} else {
  window.metroData = metroData;
}
