export interface HouseDetail {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  neighborhood: string;
  amenities: string[];
  description: string;
  imageUrl?: string;
}

export const HOUSES_DATA: HouseDetail[] = [
  {
    id: "1",
    address: "124 Bluebird Lane, Austin, TX",
    price: 1800,
    bedrooms: 2,
    neighborhood: "East Austin",
    amenities: ["Yard", "Pet Friendly", "Solar Panels", "Fiber Internet"],
    description: "Cozy 2-bedroom home in trendy East Austin with a spacious backyard, solar panels, and high-speed fiber internet. Perfect for young professionals, pet owners, or a small family looking for a friendly neighborhood."
  },
  {
    id: "2",
    address: "890 Highrise Boulevard, Apt 14B, New York, NY",
    price: 4200,
    bedrooms: 1,
    neighborhood: "Manhattan",
    amenities: ["Doorman", "Gym", "Rooftop Deck", "Elevator"],
    description: "Luxury high-rise 1-bedroom apartment in midtown Manhattan. Features floor-to-ceiling windows, modern kitchen, 24/7 doorman, and access to a state-of-the-art gym and rooftop deck with skyline views."
  },
  {
    id: "3",
    address: "455 Pinecrest Road, Seattle, WA",
    price: 3100,
    bedrooms: 3,
    neighborhood: "Green Lake",
    amenities: ["Garage", "Fireplace", "Hardwood Floors", "Deck"],
    description: "Charming 3-bedroom craftsman home near Green Lake. Beautiful hardwood floors, cozy stone fireplace, private deck for BBQ, and attached garage. Quiet, lush green family neighborhood."
  },
  {
    id: "4",
    address: "102 Oceanside Drive, Malibu, CA",
    price: 8500,
    bedrooms: 4,
    neighborhood: "Malibu Beach",
    amenities: ["Ocean View", "Pool", "Hot Tub", "Beach Access"],
    description: "Stunning 4-bedroom beachfront villa in Malibu. Unobstructed Pacific ocean views, private heated infinity pool, spa-like hot tub, and direct private stairs to the sandy beach."
  },
  {
    id: "5",
    address: "766 Willow Creek Way, Denver, CO",
    price: 2400,
    bedrooms: 3,
    neighborhood: "Cherry Creek",
    amenities: ["Basement", "Fenced Yard", "Mountain Views", "Garage"],
    description: "Beautiful 3-bedroom family home in quiet Cherry Creek school district. Features a finished basement, fenced yard for dogs, spacious deck with scenic Rocky Mountain views, and 2-car garage."
  },
  {
    id: "6",
    address: "312 Sunset Strip, Los Angeles, CA",
    price: 4900,
    bedrooms: 2,
    neighborhood: "West Hollywood",
    amenities: ["Pool", "Modern Kitchen", "Balcony", "Gated Security"],
    description: "Ultra-modern 2-bedroom smart home in West Hollywood. Gated security, stunning minimalist architecture, private pool, designer kitchen, and a balcony overlooking shimmering city lights."
  },
  {
    id: "7",
    address: "58 Magnolia Avenue, Savannah, GA",
    price: 1500,
    bedrooms: 2,
    neighborhood: "Historic District",
    amenities: ["Front Porch", "High Ceilings", "Fireplace", "Garden"],
    description: "Historic 2-bedroom townhouse with original southern charm. High ceilings, decorative fireplaces, private brick garden patio, and a beautiful covered front porch under historic oak trees."
  },
  {
    id: "8",
    address: "220 Marina Boulevard, San Francisco, CA",
    price: 5200,
    bedrooms: 2,
    neighborhood: "Marina",
    amenities: ["Golden Gate View", "Hardwood Floors", "In-unit Laundry", "Roof Access"],
    description: "Classic San Francisco 2-bedroom flat with views of the Golden Gate Bridge and the bay. High ceilings, formal dining room, hardwood floors, in-unit washer/dryer, and shared rooftop access."
  },
  {
    id: "9",
    address: "14 Spruce Mountain Road, Aspen, CO",
    price: 6800,
    bedrooms: 4,
    neighborhood: "Snowmass",
    amenities: ["Ski-in/Ski-out", "Hot Tub", "Fireplace", "Sauna"],
    description: "Luxurious 4-bedroom mountain chalet with ski-in/ski-out access in Snowmass. Fireplace, outdoor private hot tub, cedar wood sauna, and cathedral ceilings with rustic wooden beams."
  },
  {
    id: "10",
    address: "633 Broadway St, Portland, OR",
    price: 1950,
    bedrooms: 1,
    neighborhood: "Pearl District",
    amenities: ["Loft Layout", "Exposed Brick", "Bicycle Storage", "Concrete Floors"],
    description: "Industrial loft-style 1-bedroom apartment in the Pearl District. Exposed brick walls, concrete floors, high timber ceilings, large industrial windows, and secure bicycle storage. Perfect urban living."
  },
  {
    id: "11",
    address: "92 Northside Avenue, Miami, FL",
    price: 3800,
    bedrooms: 3,
    neighborhood: "Brickell",
    amenities: ["Pool", "Dock Access", "Central AC", "Balcony"],
    description: "Modern 3-bedroom waterfront condo in Brickell with bay breezes. Floor-to-ceiling windows, wrap-around balcony, luxury building with resort-style pool, central AC, and private dock access."
  },
  {
    id: "12",
    address: "348 Maplewood Lane, Chicago, IL",
    price: 1650,
    bedrooms: 2,
    neighborhood: "Lincoln Park",
    amenities: ["Hardwood Floors", "Backyard", "Basement Storage", "Central Heat"],
    description: "Cozy 2-bedroom apartment flat in Lincoln Park. Close to parks, cafes, and CTA transit. Rent includes water and central heat. Features a beautiful shared backyard and private basement storage."
  },
  {
    id: "13",
    address: "712 Cactus Blossom Route, Phoenix, AZ",
    price: 1750,
    bedrooms: 3,
    neighborhood: "Paradise Valley",
    amenities: ["Central AC", "Solar Panels", "Desert Landscaping", "Garage"],
    description: "Energy-efficient 3-bedroom desert home with solar panels. Outstanding central AC, low-maintenance desert landscaping, 2-car garage, and open-concept floor plan perfect for hot summer days."
  },
  {
    id: "14",
    address: "89 Emerald Bay Court, Lake Tahoe, CA",
    price: 4500,
    bedrooms: 3,
    neighborhood: "South Lake Tahoe",
    amenities: ["Lake View", "Fireplace", "Deck", "Hot Tub"],
    description: "Stunning 3-bedroom log cabin near Emerald Bay. Huge deck overlooking Lake Tahoe, outdoor hot tub, wood-burning stone fireplace, and rustic modern kitchen. Perfect peaceful nature escape."
  },
  {
    id: "15",
    address: "155 College Street, Boston, MA",
    price: 2900,
    bedrooms: 2,
    neighborhood: "Cambridge",
    amenities: ["Walk to Harvard", "Brick Building", "Hardwood Floors", "Radiant Heat"],
    description: "Charming 2-bedroom apartment in Cambridge. Just minutes' walk to Harvard Square, classic brick building, polished hardwood floors, quiet study room, and historic charm."
  }
];

export const SAMPLE_QUERIES = [
  {
    label: "Beachfront Villa",
    query: "Stunning beach house with ocean view and private pool in Malibu"
  },
  {
    label: "Modern Industrial Loft",
    query: "Industrial style loft apartment with exposed brick and concrete floors"
  },
  {
    label: "Quiet Family Home",
    query: "Charming craftsman home in a quiet green neighborhood with backyard"
  },
  {
    label: "Cozy Ski Mountain Cabin",
    query: "Rustic mountain chalet or log cabin with a stone fireplace and hot tub"
  },
  {
    label: "East Austin Solar House",
    query: "Eco-friendly solar home with a yard and super fast internet"
  }
];
