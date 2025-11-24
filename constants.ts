import { DivisionCategory, TypeCategory } from './types';

export const INITIAL_CHAT_MESSAGE = "I am your Bangladesh travel guide. Ask me anything about this location! I can help with itineraries, costs, safety, and more.";

export const BUDGET_LEVELS = [
  "Budget (Low Cost)",
  "Mid-Range (Comfort)",
  "Luxury (High End)"
];

export const TRAVEL_MOODS = [
  "Relaxing & Chill",
  "Adventure & Thrill",
  "Nature & Wildlife",
  "Heritage & Culture",
  "City Life & Shopping",
  "Romantic Getaway",
  "Family Vacation"
];

export const DIVISIONS: DivisionCategory[] = [
  {
    name: "Dhaka Division",
    places: [
      "Lalbagh Fort, Dhaka", "Ahsan Manzil, Dhaka", "Sadarghat, Dhaka", "National Parliament House, Dhaka", 
      "Hatirjheel, Dhaka", "Dhakeshwari Temple, Dhaka", "Panam City, Narayanganj", "Sonargaon Folk Art Museum", 
      "Meghna Ghat", "Bhawal National Park, Gazipur", "Nuhash Polli, Gazipur", "Bangabandhu Safari Park, Gazipur", 
      "Padma Bridge", "Idrakpur Fort, Munshiganj", "Baliati Palace, Manikganj", "Dream Holiday Park, Narsingdi", 
      "Mainot Ghat, Doha", "Nikli Haor, Kishoreganj", "Tungipara, Gopalganj"
    ]
  },
  {
    name: "Chattogram Division",
    places: [
      "Patenga Beach", "Foy’s Lake", "Ethnological Museum, Chattogram", 
      "Cox’s Bazar Beach", "Himchori", "Inani Beach", "Saint Martin’s Island", "Moheshkhali", "Kutubdia",
      "Nilgiri, Bandarban", "Nilachal, Bandarban", "Boga Lake", "Amiakhum", "Nafakhum", "Keokradong",
      "Kaptai Lake", "Rangamati Hanging Bridge", "Sajek Valley", "Alutila Cave", "Risang Waterfall", 
      "Nijhum Dwip, Noakhali", "Chandpur Mohona"
    ]
  },
  {
    name: "Sylhet Division",
    places: [
      "Jaflong", "Bichanakandi", "Ratargul Swamp Forest", "Pangthumai Waterfall", "Shah Jalal Dargah",
      "Sreemangal Tea Gardens", "Lawachara National Park", "Madhabkunda Waterfall",
      "Tanguar Haor", "Shimul Bagan", "Barek Tila", "Satchari National Park", "Rema-Kalenga Wildlife Sanctuary"
    ]
  },
  {
    name: "Rajshahi Division",
    places: [
      "Padma Garden, Rajshahi", "Varendra Research Museum", "Puthia Temple Complex", "Bagha Mosque",
      "Paharpur Buddhist Vihara, Naogaon", "Mahasthangarh, Bogra", "Gokul Medh",
      "Uttara Ganabhaban, Natore", "Hardinge Bridge", "Chalan Beel"
    ]
  },
  {
    name: "Rangpur Division",
    places: [
      "Kantajew Temple, Dinajpur", "Ramsagar National Park", "Swapnapuri", 
      "Teesta Barrage", "Tajhat Palace, Rangpur", "Vinnojagat", "Chini Mosque, Nilphamari"
    ]
  },
  {
    name: "Khulna Division",
    places: [
      "Shat Gombuj Mosque, Bagerhat", "Sundarbans Mangrove Forest", "Khan Jahan Ali Mazar", "Karamjal",
      "Mongla Port", "Lalon Akhra, Kushtia", "Rabindra Kuthibari, Shilaidaha", "Michael Madhusudan Dutt Bari"
    ]
  },
  {
    name: "Barishal Division",
    places: [
      "Kuakata Sea Beach", "Lebur Char", "Fatra Char", "Durga Sagor, Barishal", 
      "Floating Guava Market, Jhalokathi", "Monpura Island, Bhola", "Sonar Char"
    ]
  },
  {
    name: "Mymensingh Division",
    places: [
      "Shashi Lodge", "Agricultural University Museum", "Gajni Abakash, Sherpur", 
      "Modhutila Eco Park", "Birishiri, Netrokona", "Shusong Durgapur"
    ]
  }
];

export const TYPES: TypeCategory[] = [
  {
    name: "Beaches",
    icon: "🏖️",
    places: [
      "Cox’s Bazar", "Kuakata", "Saint Martin’s Island", "Patenga Beach", "Inani Beach", "Parki Beach", "Kotka Beach"
    ]
  },
  {
    name: "Hills & Mountains",
    icon: "🏔️",
    places: [
      "Sajek Valley", "Bandarban", "Nilgiri", "Keokradong", "Chandranath Hill", "Garo Hills"
    ]
  },
  {
    name: "Forests & Nature",
    icon: "🌳",
    places: [
      "Sundarbans", "Ratargul Swamp Forest", "Lawachara National Park", "Bhawal National Park", "Satchari National Park"
    ]
  },
  {
    name: "Waterfalls",
    icon: "💦",
    places: [
      "Nafakhum", "Amiakhum", "Madhabkunda", "Risang Waterfall", "Shuvolong Waterfall", "Jadipai Waterfall"
    ]
  },
  {
    name: "Heritage & History",
    icon: "🕌",
    places: [
      "Lalbagh Fort", "Ahsan Manzil", "Shat Gombuj Mosque", "Paharpur Buddhist Vihara", "Mahasthangarh", "Panam City", "Puthia Temple Complex", "Kantajew Temple"
    ]
  },
  {
    name: "Haors & Rivers",
    icon: "🛶",
    places: [
      "Tanguar Haor", "Nikli Haor", "Kaptai Lake", "Bichanakandi", "Jaflong", "Padma River"
    ]
  },
  {
    name: "Islands",
    icon: "🏝️",
    places: [
      "Saint Martin's", "Nijhum Dwip", "Monpura", "Moheshkhali", "Kutubdia", "Sonadia"
    ]
  }
];