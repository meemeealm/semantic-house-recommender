import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on server-side only
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google GenAI client initialized successfully on server.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Server will run in fallback keyword semantic matching mode.");
}

// Pre-defined high-quality dataset of houses
const HOUSES = [
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

// Fallback keyword-matching search
function calculateFallbackSimilarity(queryText: string, house: typeof HOUSES[0]): number {
  const queryWords = queryText.toLowerCase().split(/[\s,.-]+/).filter(w => w.length > 2);
  if (queryWords.length === 0) {
    return 0.400; // default medium distance
  }

  const searchableText = `${house.address} ${house.neighborhood} ${house.description} ${house.amenities.join(" ")}`.toLowerCase();
  
  let matches = 0;
  for (const word of queryWords) {
    if (searchableText.includes(word)) {
      matches++;
    }
  }

  // Calculate ratio of matched query words
  const ratio = matches / queryWords.length;
  // Map ratio from [0, 1] to distance score from [0.85, 0.05] (lower is better match)
  const distance = 0.85 - (ratio * 0.80);
  return parseFloat(distance.toFixed(3));
}

// POST endpoint for `/recommend`
app.post("/recommend", async (req, res) => {
  try {
    const { query_text, max_price, min_beds, top_n } = req.body;

    // Default parameters if not provided
    const query = (query_text || "").trim();
    const limitPrice = typeof max_price === "number" ? max_price : 5000;
    const limitBeds = typeof min_beds === "number" ? min_beds : 0;
    const topN = typeof top_n === "number" ? top_n : 5;

    // 1. Filter candidates by hard constraints (max_price, min_beds)
    const filteredCandidates = HOUSES.filter((house) => {
      return house.price <= limitPrice && house.bedrooms >= limitBeds;
    });

    if (filteredCandidates.length === 0) {
      return res.json([]);
    }

    // 2. Compute similarity/distance scores
    let scoredResults: Array<{
      id: string;
      distance_score: number;
      price: number;
      bedrooms: number;
      address: string;
    }> = [];

    if (ai && query.length > 0) {
      try {
        // Build candidate string representations for Gemini
        const candidatesForGemini = filteredCandidates.map(c => ({
          id: c.id,
          address: c.address,
          neighborhood: c.neighborhood,
          price: c.price,
          bedrooms: c.bedrooms,
          description: c.description,
          amenities: c.amenities
        }));

        const prompt = `You are an AI House Recommendation Search engine.
The user is looking for a house with the following semantic search query: "${query}".

Analyze the candidate houses listed below. For each house, evaluate how well its description, location, and amenities match the user's semantic description.
Calculate a "distance_score" between 0.000 (perfect matches) and 1.000 (totally unrelated).
Guidance:
- 0.000 to 0.150: Excellent Match (highly relevant, matches almost all criteria or vibe)
- 0.151 to 0.350: Good Match (very relevant, matches several major criteria)
- 0.351 to 0.600: Fair Match (partially relevant, matches some aspects)
- 0.601 to 1.000: Poor Match (unrelated or weak match)

Candidate Houses:
${JSON.stringify(candidatesForGemini, null, 2)}

Return a JSON array containing ONLY objects with the 'id' and 'distance_score' properties. Do not return any other text, markdown formatting, or preamble. Just valid JSON.
Example format:
[
  { "id": "1", "distance_score": 0.142 },
  { "id": "2", "distance_score": 0.312 }
]`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "The house ID" },
                  distance_score: { type: Type.NUMBER, description: "The calculated semantic distance score from 0 to 1" }
                },
                required: ["id", "distance_score"]
              }
            }
          }
        });

        const jsonText = response.text ? response.text.trim() : "[]";
        const scores: Array<{ id: string; distance_score: number }> = JSON.parse(jsonText);

        // Map scored items back to full structures
        scoredResults = filteredCandidates.map(house => {
          const scoreObj = scores.find(s => s.id === house.id);
          // Fallback to keyword matching if Gemini missed this house
          const distance = scoreObj && typeof scoreObj.distance_score === "number" 
            ? scoreObj.distance_score 
            : calculateFallbackSimilarity(query, house);

          return {
            id: house.id,
            distance_score: parseFloat(distance.toFixed(3)),
            price: house.price,
            bedrooms: house.bedrooms,
            address: house.address
          };
        });

      } catch (geminiError) {
        console.error("Gemini ranking error, falling back to keyword similarity:", geminiError);
        // Fallback scored results
        scoredResults = filteredCandidates.map(house => ({
          id: house.id,
          distance_score: calculateFallbackSimilarity(query, house),
          price: house.price,
          bedrooms: house.bedrooms,
          address: house.address
        }));
      }
    } else {
      // Direct Fallback (either no Gemini Client or empty query)
      scoredResults = filteredCandidates.map(house => ({
        id: house.id,
        distance_score: calculateFallbackSimilarity(query, house),
        price: house.price,
        bedrooms: house.bedrooms,
        address: house.address
      }));
    }

    // 3. Sort by distance_score ascending (closest matches first)
    scoredResults.sort((a, b) => a.distance_score - b.distance_score);

    // 4. Slice to top_n
    const finalRecommendations = scoredResults.slice(0, topN);

    return res.json(finalRecommendations);

  } catch (error) {
    console.error("Endpoint recommendation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Configure serving frontend SPA in production and development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
