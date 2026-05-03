import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { useSearchMulti } from "../hooks/useMovieQueries";
import { useTrending, useTopRated } from "../hooks/useTMDB";
import MovieCard from "../components/MovieCard";
import ScrollRow from "../components/ScrollRow";
import { IMAGE_BASE } from "../api/tmdb";

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function DiscoverPage() {
  const { onMovieSelect } = useOutletContext() ?? {};
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query);

  const { data: searchData, isFetching, isError } = useSearchMulti(debouncedQuery);
  const trending = useTrending();
  const topRated = useTopRated();

  const movieResults = searchData?.results?.filter((r) => r.media_type === "movie") ?? [];
  const personResults = searchData?.results?.filter((r) => r.media_type === "person") ?? [];
  const isSearching = debouncedQuery.trim().length > 1;

  return (
    <div className="px-6 sm:px-8 py-8">
      <p className="text-[10px] text-[#E50914] font-bold tracking-[0.3em] uppercase mb-1">Explore</p>
      <h1 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "'Bebas Neue', cursive" }}>Discover</h1>

      {/* Search bar */}
      <div className="relative max-w-lg mb-10">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#1e1e1e] rounded-2xl focus-within:border-[#E50914]/40 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="text-[#444] flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, actors, TV shows..."
            className="bg-transparent text-sm text-white placeholder-[#333] outline-none flex-1"
            autoFocus
          />
          {isFetching && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-[#222] border-t-[#E50914] rounded-full flex-shrink-0" />
          )}
          {query && !isFetching && (
            <button onClick={() => setQuery("")} className="text-[#444] hover:text-white transition-colors text-lg leading-none">×</button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="space-y-10">
          {isError && <p className="text-sm text-[#E50914]/70">Search failed — check your API key.</p>}
          {movieResults.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4">Movies ({movieResults.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movieResults.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} onSelect={onMovieSelect} />
                ))}
              </div>
            </div>
          )}
          {personResults.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#444] uppercase tracking-widest mb-4">People ({personResults.length})</h2>
              <div className="flex flex-wrap gap-3">
                {personResults.map((person) => (
                  <div key={person.id} className="flex items-center gap-3 px-3 py-2 bg-[#111] border border-[#1e1e1e] rounded-xl">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#1a1a1a]">
                      <img src={person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "https://via.placeholder.com/32x32/1a1a1a/444?text=?"} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/32x32/1a1a1a/444?text=?"; }} />
                    </div>
                    <div>
                      <p className="text-xs text-white font-medium">{person.name}</p>
                      <p className="text-[10px] text-[#555]">{person.known_for_department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isFetching && movieResults.length === 0 && personResults.length === 0 && (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-sm text-[#444]">No results for "{debouncedQuery}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 -mx-6 sm:-mx-8">
          <ScrollRow title="Trending This Week" accent="red" loading={trending.isLoading} error={trending.isError}>
            {trending.data?.results?.slice(0, 12).map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
            ))}
          </ScrollRow>
          <ScrollRow title="Highest Rated" accent="gold" loading={topRated.isLoading} error={topRated.isError}>
            {topRated.data?.results?.slice(0, 12).map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
            ))}
          </ScrollRow>
        </div>
      )}
    </div>
  );
}
