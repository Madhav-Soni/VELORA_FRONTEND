import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useMovieDetails } from "../hooks/useMovieQueries";
import { IMAGE_BASE, BACKDROP_BASE } from "../api/tmdb";
import { useVeloraStore } from "../store/useVeloraStore";
import { backend } from "../api/backend";

const PLACEHOLDER = "https://via.placeholder.com/300x450/111/333?text=No+Image";
const IMG_SM = "https://image.tmdb.org/t/p/w185";

const MetaBadge = ({ children, icon, color = "text-white/40" }) => (
  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${color} glass px-2.5 py-1 rounded-lg`}>
    {icon && <span>{icon}</span>}
    {children}
  </div>
);

export default function MovieModal({ movieId, onClose }) {
  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { userId, addToWatchlistAsync, removeFromWatchlistAsync, isInWatchlist, addToFavorites, removeFromFavorites, isInFavorites } = useVeloraStore();
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;
  const inFavorites = movie ? isInFavorites(movie.id) : false;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const cast = movie?.credits?.cast?.slice(0, 10) ?? [];
  const providers = movie?.["watch/providers"]?.results?.US?.flatrate ?? [];
  const trailer = movie?.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.8)] scrollbar-hide relative"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#E50914" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl transition-colors"
          >
            ×
          </motion.button>

          {/* Hero Header */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full skeleton" />
            ) : movie?.backdrop_path ? (
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-full bg-[#111]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </div>

          {/* Content Body */}
          <div className="px-8 pb-12 -mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Poster Column */}
              <div className="flex-shrink-0 w-40 mx-auto sm:mx-0">
                <div className="rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl relative aspect-[2/3]">
                  {isLoading && <div className="absolute inset-0 skeleton" />}
                  <img
                    src={movie?.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                </div>
              </div>

              {/* Main Info Column */}
              <div className="flex-1 pt-4 sm:pt-20">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-10 skeleton w-3/4 rounded-xl" />
                    <div className="flex gap-2">
                      <div className="h-6 skeleton w-16 rounded-lg" />
                      <div className="h-6 skeleton w-16 rounded-lg" />
                      <div className="h-6 skeleton w-16 rounded-lg" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight font-display mb-3 tracking-wide">
                      {movie?.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {movie?.vote_average > 0 && (
                        <MetaBadge icon="★" color="text-gold">
                          {movie.vote_average.toFixed(1)}
                        </MetaBadge>
                      )}
                      {movie?.release_date && (
                        <MetaBadge>{new Date(movie.release_date).getFullYear()}</MetaBadge>
                      )}
                      {movie?.runtime && (
                        <MetaBadge>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</MetaBadge>
                      )}
                      <div className="flex gap-1.5 ml-auto">
                        {movie?.genres?.slice(0, 2).map(g => (
                          <span key={g.id} className="text-[10px] font-black uppercase tracking-widest text-brand px-2 py-0.5 bg-brand/10 rounded-md border border-brand/20">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-white/60 leading-relaxed line-clamp-4 sm:line-clamp-none mb-8">
                      {movie?.overview}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {trailer && (
                        <motion.a
                          whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://youtube.com/watch?v=${trailer.key}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/90 text-black text-sm font-black uppercase tracking-wider rounded-2xl transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          Play Trailer
                        </motion.a>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => inWatchlist ? removeFromWatchlistAsync(movie.id) : addToWatchlistAsync(movie)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-wider rounded-2xl border-2 transition-all duration-300 ${inWatchlist
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-white/5 border-white/10 text-white/80 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        <svg viewBox="0 0 24 24" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        {inWatchlist ? "Saved" : "Watchlist"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => inFavorites ? removeFromFavorites(movie.id) : addToFavorites(movie)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] border-2 transition-all duration-300 ${inFavorites
                            ? "bg-pink-500/20 border-pink-500 text-pink-400"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-pink-500/50 hover:text-pink-400"
                          }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={inFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {inFavorites ? "Favorited" : "Favorite"}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cast Grid */}
            <div className="mt-12">
              <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">Top Cast</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 overscroll-contain">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full skeleton mb-3" />
                      <div className="w-12 h-2 skeleton rounded" />
                    </div>
                  ))
                ) : (
                  cast.map((person) => (
                    <div key={person.id} className="flex-shrink-0 text-center w-20 group/cast cursor-pointer">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/5 group-hover/cast:border-brand/50 transition-all duration-300">
                        <img
                          src={person.profile_path ? `${IMG_SM}${person.profile_path}` : "https://via.placeholder.com/64x64/111/444?text=?"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/cast:scale-110"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/64x64/111/444?text=?"; }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-white/40 group-hover/cast:text-white transition-colors leading-tight line-clamp-2">
                        {person.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Watch Providers */}
            {!isLoading && providers.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">Available On</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-3 px-4 py-2.5 glass rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                      {p.logo_path && (
                        <img src={`${IMG_SM}${p.logo_path}`} className="w-6 h-6 rounded-lg shadow-lg" />
                      )}
                      <span className="text-[11px] font-bold text-white/70">{p.provider_name}</span>
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
