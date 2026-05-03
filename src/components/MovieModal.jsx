import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useMovieDetails } from "../hooks/useMovieQueries";
import { IMAGE_BASE, BACKDROP_BASE } from "../api/tmdb";
import { useWatchlistStore } from "../store/useWatchlistStore";

const PLACEHOLDER = "https://via.placeholder.com/300x450/111/333?text=No+Image";
const IMG_SM = "https://image.tmdb.org/t/p/w185";

export default function MovieModal({ movieId, onClose }) {
  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const cast = movie?.credits?.cast?.slice(0, 8) ?? [];
  const providers = movie?.["watch/providers"]?.results?.US?.flatrate ?? [];
  const trailer = movie?.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0f0f] rounded-3xl border border-[#1e1e1e] shadow-2xl shadow-black/80 scrollbar-hide"
        >
          {/* Backdrop hero */}
          <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl">
            {movie?.backdrop_path ? (
              <img src={`${BACKDROP_BASE}${movie.backdrop_path}`} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-[#111]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-8 -mt-8 relative">
            <div className="flex gap-5">
              {/* Poster */}
              <div className="flex-shrink-0 w-28 rounded-2xl overflow-hidden border-2 border-[#1e1e1e] shadow-xl">
                <img
                  src={movie?.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER}
                  className="w-full aspect-[2/3] object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </div>

              {/* Title + meta */}
              <div className="pt-10 flex-1 min-w-0">
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-6 bg-[#1e1e1e] rounded w-3/4" />
                    <div className="h-4 bg-[#1e1e1e] rounded w-1/2" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white leading-tight">{movie?.title}</h2>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {movie?.vote_average && (
                        <span className="text-[#F5C518] text-xs font-bold bg-[#F5C518]/10 px-2 py-0.5 rounded-lg">★ {movie.vote_average.toFixed(1)}</span>
                      )}
                      {movie?.release_date && (
                        <span className="text-[#555] text-xs">{new Date(movie.release_date).getFullYear()}</span>
                      )}
                      {movie?.runtime && (
                        <span className="text-[#555] text-xs">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                      )}
                    </div>
                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {movie?.genres?.slice(0, 3).map((g) => (
                        <span key={g.id} className="text-[10px] text-[#888] bg-[#1a1a1a] px-2 py-0.5 rounded-full border border-[#2a2a2a]">{g.name}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Overview */}
            {!isLoading && movie?.overview && (
              <p className="mt-5 text-sm text-[#999] leading-relaxed">{movie.overview}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              {trailer && (
                <a
                  href={`https://youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Trailer
                </a>
              )}
              <button
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                  inWatchlist
                    ? "bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]"
                    : "bg-[#141414] border-[#222] text-[#888] hover:text-white hover:border-[#444]"
                }`}
              >
                <svg viewBox="0 0 24 24" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {inWatchlist ? "Saved" : "Watchlist"}
              </button>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mt-7">
                <h3 className="text-xs font-semibold text-[#444] uppercase tracking-widest mb-3">Cast</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {cast.map((person) => (
                    <div key={person.id} className="flex-shrink-0 text-center w-16">
                      <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222]">
                        <img
                          src={person.profile_path ? `${IMG_SM}${person.profile_path}` : "https://via.placeholder.com/50x50/1a1a1a/444?text=?"}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/50x50/1a1a1a/444?text=?"; }}
                        />
                      </div>
                      <p className="text-[9px] text-[#666] mt-1 leading-tight line-clamp-2">{person.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watch providers */}
            {providers.length > 0 && (
              <div className="mt-7">
                <h3 className="text-xs font-semibold text-[#444] uppercase tracking-widest mb-3">Where to Watch</h3>
                <div className="flex flex-wrap gap-2">
                  {providers.map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#1e1e1e] rounded-xl">
                      {p.logo_path && (
                        <img src={`${IMG_SM}${p.logo_path}`} className="w-5 h-5 rounded-md object-cover" />
                      )}
                      <span className="text-xs text-[#888]">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
