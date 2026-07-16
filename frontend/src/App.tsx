import React, { useState, useEffect, useRef } from "react";
import { 
  Home, 
  Search, 
  Sparkles, 
  BedDouble, 
  Sliders, 
  DollarSign, 
  RotateCcw, 
  AlertCircle, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Waves, 
  Building, 
  Trees, 
  Flame, 
  Calendar,
  X,
  ChevronRight,
  GraduationCap,
  Sparkle,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HOUSES_DATA, SAMPLE_QUERIES, HouseDetail } from "./data";
import { RecommendationResponseItem } from "./types";

export default function App() {
  // Form States
  const [queryText, setQueryText] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">(5000);
  const [minBeds, setMinBeds] = useState<number | "">(0);
  const [topN, setTopN] = useState<number | "">(5);

  // App States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendationResponseItem[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // References for scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Validation States
  const [validationErrors, setValidationErrors] = useState<{
    maxPrice?: string;
    minBeds?: string;
    topN?: string;
  }>({});

  // Auto-search on initial load to show featured properties
  useEffect(() => {
    handleSearch(undefined, true);
  }, []);

  // Form Validation
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    
    if (typeof maxPrice === "number" && maxPrice < 0) {
      errors.maxPrice = "Price cannot be negative";
    }
    if (typeof minBeds === "number" && minBeds < 0) {
      errors.minBeds = "Bedrooms cannot be negative";
    }
    if (typeof topN === "number" && (topN < 1 || topN > 15)) {
      errors.topN = "Please request between 1 and 15 properties";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Perform Search
  const handleSearch = async (e?: React.FormEvent, isInitial = false) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_text: queryText,
          max_price: maxPrice === "" ? 999999 : Number(maxPrice),
          min_beds: minBeds === "" ? 0 : Number(minBeds),
          top_n: topN === "" ? 5 : Number(topN),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to the recommendation service.");
      }

      const data: RecommendationResponseItem[] = await response.json();
      setResults(data);
      setHasSearched(true);

      // Smooth scroll to results after a tiny delay to let DOM render
      if (!isInitial) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to connect to the recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form and Results
  const handleReset = () => {
    setQueryText("");
    setMaxPrice(5000);
    setMinBeds(0);
    setTopN(5);
    setValidationErrors({});
    setError(null);
    setHasSearched(false);
    // Reload initial featured state
    handleSearch(undefined, true);
  };

  // Apply Quick Search Chip
  const handleQuickSearch = (chipQuery: string) => {
    setQueryText(chipQuery);
    // We update state and perform search immediately with that query
    setLoading(true);
    setError(null);
    
    // Perform search directly using the chip query to avoid waiting for state update
    fetch("/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_text: chipQuery,
        max_price: maxPrice === "" ? 999999 : Number(maxPrice),
        min_beds: minBeds === "" ? 0 : Number(minBeds),
        top_n: topN === "" ? 5 : Number(topN),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to connect to the recommendation service.");
        return res.json();
      })
      .then((data: RecommendationResponseItem[]) => {
        setResults(data);
        setHasSearched(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      })
      .catch((err) => {
        setError(err.message || "Unable to connect to the recommendation service.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Associate visual Lucide icons with specific houses based on neighborhood/attributes
  const getHouseIcon = (houseId: string) => {
    switch (houseId) {
      case "4": // Malibu Beach
        return <Waves className="h-5 w-5 text-blue-600" />;
      case "9": // Aspen Mountain
      case "14": // Lake Tahoe cabin
        return <Trees className="h-5 w-5 text-emerald-600" />;
      case "2": // New York Penthouse
      case "10": // Portland Loft
      case "11": // Miami Condo
        return <Building className="h-5 w-5 text-indigo-600" />;
      case "15": // Cambridge
        return <GraduationCap className="h-5 w-5 text-teal-600" />;
      case "13": // Phoenix Desert
        return <Sun className="h-5 w-5 text-amber-500" />;
      default:
        return <Home className="h-5 w-5 text-blue-600" />;
    }
  };

  // Score Badge Classification
  const getScoreBadge = (score: number) => {
    if (score <= 0.15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="h-3.5 w-3.5" />
          Excellent Match
        </span>
      );
    } else if (score <= 0.35) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkle className="h-3.5 w-3.5" />
          Good Match
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Fair Match
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 antialiased font-sans flex flex-col">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">AI-powered House for Rent Recommendation</h1>
              <p className="text-[11px] text-slate-500">Find homes using semantic AI search.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-blue-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              API Connected
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-600">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar / Search Panel */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 flex flex-col space-y-6 shrink-0 bg-white">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-5 flex-1">
            
            {/* Search Query Area */}
            <div className="block">
              <span className="text-sm font-semibold text-slate-700">Search Query</span>
              <div className="relative mt-1.5">
                <textarea
                  id="query_text"
                  rows={4}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none outline-none transition-all placeholder:text-slate-400"
                  placeholder="Describe your ideal house... e.g. Modern 3-bedroom house near the city with affordable rent."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
                {queryText && (
                  <button
                    type="button"
                    onClick={() => setQueryText("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                    title="Clear query"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Try an AI preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSearch(item.query)}
                    className="text-[11px] bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-lg font-medium transition-colors border border-slate-100 hover:border-blue-100 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Bedroom Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Price ($)</span>
                <input
                  type="number"
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                    validationErrors.maxPrice ? "border-red-300" : "border-slate-200"
                  }`}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMaxPrice(val === "" ? "" : Number(val));
                  }}
                />
                {validationErrors.maxPrice && (
                  <p className="text-[10px] text-red-500 font-medium mt-0.5">{validationErrors.maxPrice}</p>
                )}
              </label>
              
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Beds</span>
                <input
                  type="number"
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                    validationErrors.minBeds ? "border-red-300" : "border-slate-200"
                  }`}
                  value={minBeds}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMinBeds(val === "" ? "" : Number(val));
                  }}
                />
                {validationErrors.minBeds && (
                  <p className="text-[10px] text-red-500 font-medium mt-0.5">{validationErrors.minBeds}</p>
                )}
              </label>
            </div>

            {/* Results Count Field */}
            <label className="block font-sans">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Results Count</span>
              <input
                type="number"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                  validationErrors.topN ? "border-red-300" : "border-slate-200"
                }`}
                value={topN}
                onChange={(e) => {
                  const val = e.target.value;
                  setTopN(val === "" ? "" : Number(val));
                }}
              />
              {validationErrors.topN && (
                <p className="text-[10px] text-red-500 font-medium mt-0.5">{validationErrors.topN}</p>
              )}
            </label>

            {/* Find Houses Trigger Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Houses</span>
                </>
              )}
            </button>

            {/* Reset Form Button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-medium py-2 px-4 text-xs transition-colors rounded-lg border border-slate-100 cursor-pointer"
            >
              Reset Form
            </button>

          </form>

          {/* Model Context Status Box */}
          <div className="mt-auto pt-6 border-t border-slate-100 hidden lg:block">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 leading-relaxed">
                Using <strong>Gemini 3.5 Flash</strong> embeddings to match your requirements with active property listings in real-time.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side: Results Display Panel */}
        <section className="flex-1 bg-slate-50/50 p-6 sm:p-8 overflow-y-auto" ref={resultsRef}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Recommended Listings
                {results !== null && !loading && (
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {results.length} Found
                  </span>
                )}
              </h2>
              {hasSearched && queryText && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl">
                  Matches for: &ldquo;<span className="italic font-medium">{queryText}</span>&rdquo;
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span>Sorted by</span>
              <select className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer font-bold text-slate-800 outline-none">
                <option>Similarity</option>
                <option>Price (Low-High)</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. Loading State */}
            {loading && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Spinner Block */}
                <div className="bg-blue-50/30 rounded-2xl border border-blue-100/50 p-6 flex flex-col items-center justify-center text-center">
                  <div className="relative flex items-center justify-center h-12 w-12 mb-4">
                    <div className="absolute animate-ping h-8 w-8 rounded-full bg-blue-400 opacity-20"></div>
                    <svg className="animate-spin h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-blue-900">Searching for the best recommendations...</h3>
                  <p className="text-xs text-blue-700/80 mt-1 max-w-sm">
                    Our semantic search engine is evaluating candidate homes against your request criteria.
                  </p>
                </div>

                {/* Skeleton Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                          <div className="space-y-2">
                            <div className="h-3.5 w-32 bg-slate-100 rounded"></div>
                            <div className="h-3 w-20 bg-slate-100 rounded"></div>
                          </div>
                        </div>
                        <div className="h-5 w-24 bg-slate-100 rounded-full"></div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="h-3 w-full bg-slate-100 rounded"></div>
                        <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <div className="h-4 w-12 bg-slate-100 rounded-full"></div>
                        <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
                        <div className="h-4 w-12 bg-slate-100 rounded-full"></div>
                      </div>
                      <div className="border-t border-slate-50 pt-4 flex justify-between">
                        <div className="h-6 w-20 bg-slate-100 rounded"></div>
                        <div className="h-5 w-16 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. Error State */}
            {!loading && error && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50/50 rounded-2xl border border-red-100 p-6 text-center space-y-4"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-red-900">Unable to connect to the recommendation service.</h3>
                  <p className="text-sm text-red-700 max-w-md mx-auto leading-relaxed">
                    We were unable to reach the backend recommendation server. Ensure the server is active, and try again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleSearch(e)}
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-red-500/10 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  Retry Search
                </button>
              </motion.div>
            )}

            {/* 3. Empty State */}
            {!loading && !error && hasSearched && results && results.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50/50 rounded-2xl border border-slate-100 p-8 text-center space-y-4"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Compass className="h-8 w-8 stroke-[1.5]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">No matching houses found.</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Try increasing your budget, decreasing your bedrooms criteria, or changing your search description.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaxPrice(8000);
                    setMinBeds(0);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Expand budget limits
                </button>
              </motion.div>
            )}

            {/* 4. Results List Grid State */}
            {!loading && !error && results && results.length > 0 && (
              <motion.div
                key="results-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {results.map((item, index) => {
                  const details: HouseDetail | undefined = HOUSES_DATA.find(
                    (h) => h.id === item.id
                  );

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.05, duration: 0.35, ease: "easeOut" }
                      }}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="flex flex-col">
                        {/* Card Top Icon & Match badge */}
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <div className="bg-blue-50/80 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                            {getHouseIcon(item.id)}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {getScoreBadge(item.distance_score)}
                          </div>
                        </div>

                        {/* Card Address & Neighborhood */}
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                          {details?.neighborhood || "Curated Catalog"}
                        </span>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base sm:text-lg leading-tight line-clamp-1 mb-1">
                          {item.address}
                        </h3>
                        
                        {/* Description & amenities */}
                        {details && (
                          <div className="space-y-3 mt-1.5">
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                              {details.description}
                            </p>
                            
                            {/* Amenities badge pill list */}
                            <div className="flex flex-wrap gap-1.5">
                              {details.amenities.map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Divider and Stats */}
                      <div className="mt-5 flex items-end justify-between pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-2xl font-bold text-slate-900">
                            ${item.price.toLocaleString()}
                            <span className="text-sm text-slate-400 font-normal">/mo</span>
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {item.bedrooms} {item.bedrooms === 1 ? "Bedroom" : "Bedrooms"} • Baths: 2
                          </p>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Similarity Score</p>
                          <p className="text-sm font-mono text-blue-600 font-bold bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100">
                            {item.distance_score.toFixed(3)}
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-blue-600 font-semibold group/btn mt-1 cursor-pointer"
                            onClick={() => {
                              alert(`Simulating detail tour of "${item.address}"\nRent: $${item.price}/month\nBedrooms: ${item.bedrooms}\n\nFeatures: ${details?.amenities.join(", ")}`);
                            }}
                          >
                            Tour
                            <ArrowRight className="h-2.5 w-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Status Area */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>
                {loading 
                  ? `Searching recommendations based on your description...` 
                  : hasSearched && queryText 
                    ? `Showing semantic recommendations for "${queryText.substring(0, 30)}..."` 
                    : `Showing recommended property catalog listings`}
              </span>
            </div>
          </div>

        </section>
      </main>

      {/* Footer credits */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium shrink-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 AI House Recommendation Search System. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Featuring high-performance semantic embeddings matching.
          </p>
        </div>
      </footer>
    </div>
  );
}
