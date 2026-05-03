import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { IMAGE_BASE } from "../api/tmdb";

const PLACEHOLDER = "https://via.placeholder.com/200x300/111/333?text=No+Image";

export default function WatchlistPage() {
  const { onMovieSelect } = useOutletContext() ?? {};
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlistStore();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="px-6 sm:px-8 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] text-[#E50914] font-bold tracking-[0.3em] uppercase mb-1">Your Collection</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Watchlist
          </h1>
          <p className="text-sm text-[#555] mt-1">{watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved</p>
        </div>
        {watchlist.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888]">Clear all?</span>
                <button onClick={() => { clearWatchlist(); setConfirmClear(false); }} className="text-xs text-[#E50914] font-semibold hover:underline">Yes</button>
                <button onClick={() => setConfirmClear(false)} className="text-xs text-[#555] hover:text-white">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="text-xs text-[#444] hover:text-[#888] transition-colors">Clear all</button>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-lg font-semibold text-[#444] mb-2">No movies saved yet</h2>
          <p className="text-sm text-[#333]">Browse and add movies to your watchlist to see them here.</p>
        </motion.div>
      )}

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {watchlist.map((movie, i) => {
            const title = movie.title || movie.name || "Untitled";
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
            const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
            return (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group cursor-pointer"
                onClick={() => onMovieSelect?.(movie.id)}
              >
                <div className="relative rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#111] shadow-lg group-hover:border-[#E50914]/30 group-hover:shadow-[0_8px_24px_rgba(229,9,20,0.1)] transition-all duration-300">
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER}
                      alt={title}
                      className="w-full aspect-[2/3] object-cover"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                      loading="lazy"
                    />
                  </motion.div>

                  {rating && (
                    <div className="absolute top-2 left-2 bg-black/75 text-[#F5C518] text-[10px] font-bold px-1.5 py-0.5 rounded-lg backdrop-blur-sm">★ {rating}</div>
                  )}

                  {/* Remove button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); removeFromWatchlist(movie.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center text-[#888] hover:text-[#E50914] opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm font-bold"
                  >
                    ×
                  </motion.button>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-semibold line-clamp-2">{title}</p>
                    {year && <p className="text-[#888] text-[10px] mt-0.5">{year}</p>}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-[#555] truncate px-0.5 group-hover:text-[#aaa] transition-colors">{title}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
