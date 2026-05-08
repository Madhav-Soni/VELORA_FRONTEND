import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { useSearchMulti } from "../hooks/useMovieQueries";
import { useTrending, useTopRated } from "../hooks/useTMDB";
import MovieCard from "../components/MovieCard";
import ActorCard from "../components/ActorCard";
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

const NoResults = ({ query }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-32 px-6 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
      <span className="text-3xl">🔍</span>
    </div>
    <h3 className="text-xl font-black text-white font-display tracking-wide uppercase mb-2">No Results Found</h3>
    <p className="text-white/30 text-sm max-w-xs">
      We couldn't find anything matching "{query}". Try checking for typos or searching for something else.
    </p>
  </motion.div>
);

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
    <div className="px-6 sm:px-12 py-10 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-6 h-[2px] bg-brand" />
        <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Global Database</p>
      </div>
      <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase mb-10">Discover</h1>

      {/* Advanced Search Input */}
      <div className="relative max-w-2xl mb-16">
        <div className={`flex items-center gap-4 px-6 py-4 glass rounded-3xl border transition-all duration-500 ${
          isSearching ? "border-brand/40 ring-4 ring-brand/5" : "border-white/5"
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20" className="text-white/20 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, actors, or filmmakers..."
            className="bg-transparent text-base font-bold text-white placeholder-white/10 outline-none flex-1"
            autoFocus
          />
          
          <AnimatePresence mode="wait">
            {isFetching ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/10 border-t-brand rounded-full flex-shrink-0" 
              />
            ) : query && (
              <motion.button 
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")} 
                className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {movieResults.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Movies ({movieResults.length})</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-5 gap-y-10">
                  {movieResults.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} onSelect={onMovieSelect} />
                  ))}
                </div>
              </div>
            )}

            {personResults.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">People ({personResults.length})</h2>
                </div>
                <div className="flex flex-wrap gap-8">
                  {personResults.map((person, i) => (
                    <ActorCard key={person.id} actor={person} index={i} />
                  ))}
                </div>
              </div>
            )}

            {!isFetching && movieResults.length === 0 && personResults.length === 0 && (
              <NoResults query={debouncedQuery} />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 -mx-6 sm:-mx-12"
          >
            <ScrollRow 
              title="Global Trending" 
              accent="red" 
              loading={trending.isLoading} 
              error={trending.isError}
            >
              {trending.data?.results?.slice(0, 14).map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
              ))}
            </ScrollRow>

            <ScrollRow 
              title="Critically Acclaimed" 
              accent="gold" 
              loading={topRated.isLoading} 
              error={topRated.isError}
            >
              {topRated.data?.results?.slice(0, 14).map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
              ))}
            </ScrollRow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
