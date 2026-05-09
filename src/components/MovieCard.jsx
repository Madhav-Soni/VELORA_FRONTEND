import { motion } from "framer-motion";
import { useState } from "react";
import { IMAGE_BASE } from "../api/tmdb";
import { useWatchlistStore } from "../store/useWatchlistStore";

const PLACEHOLDER = "https://via.placeholder.com/200x300/111/333?text=No+Image";

export default function MovieCard({ movie, index = 0, onSelect }) {
  const { addToWatchlistAsync, removeFromWatchlistAsync, isInWatchlist } = useWatchlistStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const inWatchlist = isInWatchlist(movie.id);

  const imageUrl = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER;
  const title = movie.title || movie.name || "Untitled";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const handleWatchlist = (e) => {
    e.stopPropagation();
    inWatchlist ? removeFromWatchlistAsync(movie.id) : addToWatchlistAsync(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      onClick={() => onSelect?.(movie.id)}
      className="flex-shrink-0 w-36 sm:w-40 md:w-44 cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] shadow-xl transition-all duration-500 group-hover:border-brand/40 group-hover:shadow-[0_8px_32px_rgba(229,9,20,0.15)]">
        
        {/* Shimmer Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        <img
          src={imageUrl}
          alt={title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[2/3] object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { e.target.src = PLACEHOLDER; setImgLoaded(true); }}
          loading="lazy"
        />

        {/* Rating Badge */}
        {rating && imgLoaded && (
          <div className="absolute top-2 left-2 glass text-gold text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
            ★ {rating}
          </div>
        )}

        {/* Watchlist Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWatchlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
            inWatchlist 
              ? "bg-brand text-white opacity-100" 
              : "bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white"
          }`}
        >
          <svg viewBox="0 0 24 24" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="14" height="14">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </motion.button>

        {/* Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-1">{title}</p>
          <div className="flex items-center justify-between">
            {year && <p className="text-white/50 text-[10px] font-medium">{year}</p>}
            <span className="text-[9px] text-brand font-bold uppercase tracking-wider">
              {inWatchlist ? "Saved" : "+ Save"}
            </span>
          </div>
        </div>
      </div>
      
      {/* External Title (for accessibility/spacing) */}
      <p className="mt-2.5 text-xs text-white/40 font-medium truncate px-0.5 group-hover:text-white/80 transition-colors duration-300">
        {title}
      </p>
    </motion.div>
  );
}
