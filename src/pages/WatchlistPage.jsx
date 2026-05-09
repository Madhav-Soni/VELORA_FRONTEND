import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useVeloraStore } from "../store/useVeloraStore";
import { IMAGE_BASE } from "../api/tmdb";
import { useWatchlistMinimal } from "../hooks/useMovieQueries";

const PLACEHOLDER = "https://via.placeholder.com/200x300/111/333?text=No+Image";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-32 px-6"
    >
      <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8">
        <span className="text-4xl">🔖</span>
      </div>
      <h2 className="text-2xl font-black text-white mb-3 font-display tracking-wide uppercase">Your list is empty</h2>
      <p className="text-white/30 text-sm mb-10 max-w-[280px] text-center leading-relaxed">
        Movies you add to your watchlist will appear here for easy access.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/discover")}
        className="px-10 py-4 bg-brand text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-brand/20"
      >
        Discover Movies
      </motion.button>
    </motion.div>
  );
};

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { onMovieSelect } = useOutletContext() ?? {};
  const { watchlist, removeFromWatchlistAsync, clearWatchlistAsync } = useVeloraStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const watchlistQueries = useWatchlistMinimal(watchlist);
  const fullWatchlist = watchlistQueries
    .map((q) => q.data)
    .filter(Boolean);
  const isLoading = watchlistQueries.some((q) => q.isLoading);

  return (
    <div className="px-6 sm:px-12 py-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-[2px] bg-brand" />
            <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Personal Vault</p>
          </div>
          <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase">
            My Watchlist
          </h1>
          <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest mt-2">
            {watchlist.length} {watchlist.length === 1 ? "Title" : "Titles"} Saved
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              {confirmClear ? (
                <motion.div 
                  key="confirm"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-4 bg-brand/10 border border-brand/20 px-4 py-2 rounded-xl"
                >
                  <span className="text-[10px] font-black text-brand uppercase tracking-wider">Are you sure?</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { clearWatchlistAsync(); setConfirmClear(false); }}
                      className="text-[10px] font-black text-white uppercase tracking-widest hover:underline"
                    >
                      Yes, Clear
                    </button>
                    <button 
                      onClick={() => setConfirmClear(false)}
                      className="text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button 
                  key="trigger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setConfirmClear(true)}
                  className="px-5 py-2.5 glass text-[10px] font-black text-white/20 hover:text-brand hover:border-brand/30 uppercase tracking-[0.2em] rounded-xl transition-all"
                >
                  Clear Collection
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      {watchlist.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-5 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {isLoading && fullWatchlist.length === 0 ? (
              Array.from({ length: watchlist.length }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-[1.5rem] skeleton" />
              ))
            ) : (
              fullWatchlist.map((movie) => {
                const title = movie.title || movie.name || "Untitled";
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
                
                return (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="group"
                  >
                    <div 
                      onClick={() => onMovieSelect?.(movie.id)}
                      className="relative aspect-[2/3] rounded-[1.5rem] overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl group-hover:border-brand/40 transition-all duration-500 cursor-pointer"
                    >
                      <img
                        src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                        loading="lazy"
                      />
  
                      {/* Rating */}
                      {rating && (
                        <div className="absolute top-3 left-3 glass text-gold text-[10px] font-black px-2 py-1 rounded-lg">
                          ★ {rating}
                        </div>
                      )}
  
                      {/* Remove button */}
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#E50914" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); removeFromWatchlistAsync(movie.id); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </motion.button>
  
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="mt-4 px-1">
                      <p className="text-[13px] font-bold text-white/40 group-hover:text-white transition-colors truncate">
                        {title}
                      </p>
                      <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
