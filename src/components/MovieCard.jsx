import { motion } from "framer-motion";
import { IMAGE_BASE } from "../api/tmdb";
import { useWatchlistStore } from "../store/useWatchlistStore";

const PLACEHOLDER = "https://via.placeholder.com/200x300/111/333?text=No+Image";

export default function MovieCard({ movie, index = 0, onSelect }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);

  const imageUrl = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER;
  const title = movie.title || movie.name || "Untitled";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const handleWatchlist = (e) => {
    e.stopPropagation();
    inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ scale: 1.04, y: -5 }}
      onClick={() => onSelect?.(movie.id)}
      className="flex-shrink-0 w-36 sm:w-40 md:w-44 cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] shadow-xl transition-all duration-300 group-hover:border-[#E50914]/30 group-hover:shadow-[0_8px_32px_rgba(229,9,20,0.12)]">
        <img src={imageUrl} alt={title} className="w-full aspect-[2/3] object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} loading="lazy" />
        {rating && (
          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-[#F5C518] text-[10px] font-bold px-1.5 py-0.5 rounded-lg">★ {rating}</div>
        )}
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={handleWatchlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${inWatchlist ? "bg-[#E50914] text-white" : "bg-black/60 text-[#888] opacity-0 group-hover:opacity-100"}`}>
          <svg viewBox="0 0 24 24" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="12" height="12">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </motion.button>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">{title}</p>
          {year && <p className="text-[#888] text-[10px]">{year}</p>}
          <div className="mt-2">
            <span className="text-[10px] text-[#E50914] font-semibold px-1.5 py-0.5 bg-[#E50914]/15 rounded-md">
              {inWatchlist ? "In Watchlist" : "+ Watchlist"}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-[#666] truncate px-0.5 group-hover:text-[#ccc] transition-colors duration-200">{title}</p>
    </motion.div>
  );
}
