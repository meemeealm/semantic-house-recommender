## 🏠 AI-Powered House for Rent Recommendation System

An intelligent, semantic-search-enabled house recommendation system built using a high-performance **FastAPI** backend and a lightning-fast **React + Vite** frontend,and optimized using **`uv`**.

Instead of matching strict keywords, this system leverages **SentenceTransformers** and **ChromaDB** to understand the *meaning* and *context* behind user searches (e.g., matching "cozy woodland cabin" with "rustic cottage surrounded by pines") while respecting hard filters such as price limits and minimum bedroom counts.

---

## Key Features

* **Semantic AI Search:** Processes natural language queries to identify the best housing matches based on contextual meaning rather than literal keyword matches.
* **Hybrid Filtering:** Combines vector-similarity scoring from ChromaDB with traditional metadata filters (price boundaries and minimum bedroom counts) in a single query.
* **Backend Builds:** Leverages `uv` inside Docker for extremely fast dependency installation and container startup.

---

## 📁 Project Structure


```
apartments_for_rent/
├── docker-compose.yml           # Coordinates frontend and backend containers
├── README.md                    # Project documentation (this file)
│
├── backend/
│   ├── apiapp.py                # FastAPI main application file with endpoints
│   ├── Dockerfile               # Container setup using UV for lightning-fast builds
│   ├── requirements.txt         # Backend Python dependencies
│   ├── housing_vector_db/       # ChromaDB persistent storage folder
│   └── __pycache__/             # Python bytecode cache
│
└── frontend/
    ├── Dockerfile               # Production & Dev ready Node.js environment
    ├── package.json             # Frontend packages and scripts
    ├── vite.config.ts           # Vite server, alias, and backend proxy settings
    ├── src/
    │   ├── App.tsx              # Main React dashboard component
    │   ├── main.tsx             # React DOM root mounting
    │   └── index.css            # Global styling (Tailwind CSS imports)
    └── node_modules/            # Node package dependencies (ignored in Docker volumes)

```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide React (Icons) |
| **Backend API** | FastAPI, Uvicorn, Pydantic |
| **AI & Search** | ChromaDB (Vector DB), SentenceTransformers (Embeddings) |
| **Containerization** | Docker, Docker Compose, `uv` (Fast Python Installer) |

---

## ⚙️ How It Works 

The application flows through a three-phase pipeline when a search is initiated:

```
[ User UI Input ] ──(1. Send Search Request)──> [ Vite Proxy (/api/recommend) ]
                                                            │
                                                     (2. Route to Backend)
                                                            ▼
[ ChromaDB Results ] <──(4. Semantic Match)── [ FastAPI /recommend Endpoint ]
        │                                                   │
  (Combines Vector Match                                (3. Converts Query text 
   with Price/Bed Filters)                              into Embeddings via 
        │                                                SentenceTransformers)
        ▼
[ Rendered UI Output ] <──(5. 200 OK JSON)───────── [ Parse & Format Output ]

```

1. **The Request:** The user types their ideal home description into the React UI. 
2. **The Translation:** FastAPI receives the payload. It queries ChromaDB using `query_texts=[payload.query_text]`. ChromaDB uses **SentenceTransformers** to convert this human string into a high-dimensional vector (embedding).
3. **The Hybrid Query:** ChromaDB calculates mathematical cosine distance to find the closest matching vector points in the database. Simultaneously, it applies structural metadata filters (e.g., `price` $\le$ max_price, `bedrooms` $\ge$ min_beds).
4. **The UI Update:** The closest matches are formatted into a clean schema and returned to the frontend. 

---

### Running the Stack Local

1. **git clone and navigate** to the project directory:

2. **Launch both services** with Docker Compose:
```bash
docker compose up --build

```

3. **Access the application:**
* **Frontend Application:** Open `http://localhost:3000` in your web browser.
* **FastAPI Interactive Docs:** Open `http://localhost:8000/docs` to view and test backend endpoints manually.

---

## 📊 Evaluation

The recommendation system was evaluated using a curated dataset consisting of **30 natural language property queries**. The dataset was generated using text-generation transformer. 

### Evaluation Metrics

| Metric                                             |        Score |
| -------------------------------------------------- | -----------: |
| **Hit Rate@5**                                     |    **93.3%** |
| **Mean Reciprocal Rank (MRR)**                     |    **0.900** |
| **Normalized Discounted Cumulative Gain (NDCG@5)** |   **0.9087** |
| **Average Retrieval Latency**                      | **67.19 ms** |

### Metric Descriptions

* **Hit Rate@5** measures the percentage of queries where the expected property appears within the top five recommendations.  
* **Mean Reciprocal Rank (MRR)** evaluates how highly the first relevant property is ranked, with higher values indicating that relevant results are returned earlier.  
* **Average Retrieval Latency** represents the mean response time required to generate recommendations for a query.  
* **Normalized Discounted Cumulative Gain (NDCG@5)** measures the overall quality of the ranking by rewarding relevant properties that appear closer to the top of the recommendation list.  


### Error Analysis

A qualitative analysis of the evaluation results identified the following types of retrieval errors:

* **Ranking Errors:** In some cases, the correct property was retrieved but ranked second instead of first because multiple listings shared highly similar descriptions.
* **Query Ambiguity:** Generic queries (e.g., "What's the rent in this apartment?") lacked sufficient contextual information, making it difficult for the retrieval model to identify the intended property.
* **Metadata Limitations:** Location-specific queries occasionally retrieved semantically similar properties from different locations, indicating that incorporating structured metadata filters (e.g., city or state) could further improve retrieval accuracy.

Overall, the evaluation demonstrates that the semantic recommendation pipeline is capable of retrieving relevant properties with high ranking quality while maintaining low retrieval latency.  

Future improvements include hybrid semantic-keyword retrieval, enhanced metadata filtering, and reranking techniques to further improve recommendation precision.



---

## 🔌 API Documentation

### 1. Health Check

* **Endpoint:** `GET /health`
* **Purpose:** Returns the current service status and indicates whether ChromaDB is online.
* **Example Response:**
```json
{
  "status": "healthy"
}

```



### 2. House Recommendation

* **Endpoint:** `POST /recommend`
* **Purpose:** Queries the vector database to fetch semantic housing matches.
* **Payload Format:**
```json
{
  "query_text": "Modern 3-bedroom house near the city center",
  "top_n": 5,
  "max_price": 5000,
  "min_beds": 3
}

```


* **Example Response:**
```json
[
  {
    "id": "house_42",
    "distance_score": 0.2312,
    "address": "123 Urban Blvd",
    "price": 4200.0,
    "bedrooms": 3,
    "description": "Stunning minimalist architectural gem steps away from downtown transit."
  }
]

```
