import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { useTrending } from "../hooks/useTMDB";
import MovieCard from "../components/MovieCard";

export default function TrendingPage() {
  const { onMovieSelect } = useOutletContext() ?? {};
  const { data, isLoading, isError } = useTrending();
  const movies = data?.results ?? [];

  return (
    <div className="px-6 sm:px-12 py-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-6 h-[2px] bg-brand" />
          <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Global Buzz</p>
        </div>
        <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase">
          Trending Now
        </h1>
        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest mt-2">
          Most watched movies around the world this week
        </p>
      </div>

      {/* Grid */}
      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <span className="text-4xl mb-4">⚠️</span>
          <p className="text-sm font-bold uppercase tracking-widest">Failed to load trending movies</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-5 gap-y-10">
          {isLoading ? (
            Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-[1.5rem] skeleton" />
            ))
          ) : (
            movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
                onSelect={onMovieSelect}
              />
            ))
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <span className="text-4xl mb-4">🎬</span>
          <p className="text-sm font-bold uppercase tracking-widest">No trending movies found</p>
        </div>
      )}
    </div>
  );
}
