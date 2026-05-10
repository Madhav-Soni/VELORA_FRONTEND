import { motion } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useVeloraStore } from "../store/useVeloraStore";
import { useWatchlistMinimal } from "../hooks/useMovieQueries";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { onMovieSelect } = useOutletContext() ?? {};
  const { favorites } = useVeloraStore();

  const favQueries = useWatchlistMinimal(favorites);
  const fullMovies = favQueries.map((q) => q.data).filter(Boolean);
  const isLoading = favQueries.some((q) => q.isLoading);

  return (
    <div className="px-6 sm:px-12 py-10 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-6 h-[2px] bg-pink-500" />
          <p className="text-pink-500 text-[10px] font-black tracking-[0.4em] uppercase">Curated Collection</p>
        </div>
        <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase">
          My Favorites
        </h1>
        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest mt-2">
          Movies you've loved
        </p>
      </div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 px-6 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8">
            <span className="text-3xl">🤍</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">No favorites yet</h2>
          <p className="text-white/30 text-sm mb-10 max-w-xs">
            Open any movie and tap the heart icon to favorite it.
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="px-8 py-3 bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-pink-500/20"
          >
            Explore Movies
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-5 gap-y-10">
          {isLoading && fullMovies.length === 0 ? (
            Array.from({ length: favorites.length }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-[1.5rem] skeleton" />
            ))
          ) : (
            fullMovies.map((movie, index) => (
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
    </div>
  );
}