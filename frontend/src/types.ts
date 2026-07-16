export interface RecommendationRequest {
  query_text: string;
  max_price: number;
  min_beds: number;
  top_n: number;
}

export interface RecommendationResponseItem {
  id: string;
  distance_score: number;
  price: number;
  bedrooms: number;
  address: string;
}
