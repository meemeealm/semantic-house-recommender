import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict
import chromadb

# 1. Initialize FastAPI app
app = FastAPI(
    title="House Rental Recommender API",
    description="Semantic search API powered by ChromaDB & SentenceTransformers",
    version="1.0.0"
)

# 2. Setup ChromaDB client (Run once on startup)
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "../housing_vector_db") 
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

try:
    collection = chroma_client.get_collection(name="property_recommendations")
except Exception as e:
    print(f"Error loading ChromaDB collection: {e}")
    collection = None


# 3. Define Pydantic Schemas for validation
class RecommendRequest(BaseModel):
    query_text: str = Field(..., description="The user's natural language search query")
    max_price: Optional[float] = Field(5000.0, description="Maximum budget")
    min_beds: Optional[int] = Field(0, description="Minimum bedrooms needed")
    top_n: Optional[int] = Field(5, description="Number of results to return")

class HouseRecommendation(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    distance_score: float
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    address: Optional[str] = None


# 4. Define the Recommendation Endpoint
@app.post("/recommend", response_model=List[HouseRecommendation])
async def recommend_houses(payload: RecommendRequest):
    if collection is None:
        raise HTTPException(status_code=500, detail="ChromaDB collection is not initialized.")
        
    try:
        # Query directly against ChromaDB using structural filters
        results = collection.query(
            query_texts=[payload.query_text],
            n_results=payload.top_n,
            where={
                "$and": [
                    {"price": {"$lte": payload.max_price}},
                    {"bedrooms": {"$gte": payload.min_beds}}
                ]
            }
        )
        
        if not results or not results['ids'] or len(results['ids'][0]) == 0:
            return []
            
        # Parse output into clean dictionaries natively matching HouseRecommendation schema
        recommendations = []
        for i in range(len(results['ids'][0])):
            rec = {
                "id": results['ids'][0][i],
                "distance_score": results['distances'][0][i], 
                **results['metadatas'][0][i]
            }
            recommendations.append(rec)
            
        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(e)}")


# 5. Health Check Endpoint
@app.get("/health")
async def health_check():
    status = "healthy" if collection is not None else "degraded (database offline)"
    return {"status": status}