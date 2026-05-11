import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { usePersonDetails } from "../hooks/useMovieQueries";
import { IMAGE_BASE } from "../api/tmdb";
import { useVeloraStore } from "../store/useVeloraStore";
import { backend } from "../api/backend";

const PLACEHOLDER = "https://via.placeholder.com/300x450/111/333?text=No+Image";

export default function PersonModal({ personId, onClose }) {
  const { data: person, isLoading } = usePersonDetails(personId);
  const { userId, selectedActors, toggleActor, isActorFavorited } = useVeloraStore();
  const isFavorited = person ? isActorFavorited(person.id) : false;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleToggleFavorite = () => {
    if (!person) return;
    toggleActor(person);
    // Sync to backend
    if (userId) {
      const current = useVeloraStore.getState().selectedActors;
      backend.updatePreferences(userId, { favoriteActors: current }).catch(console.error);
    }
  };

  const knownFor = person?.movie_credits?.cast
    ?.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 8) ?? [];

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
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.8)] scrollbar-hide relative"
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#E50914" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl transition-colors"
          >
            ×
          </motion.button>

          <div className="px-8 pt-10 pb-12">
            <div className="flex flex-col sm:flex-row gap-8">

              {/* Profile Image */}
              <div className="flex-shrink-0 w-36 mx-auto sm:mx-0">
                <div className="rounded-[1.5rem] overflow-hidden border-2 border-white/10 shadow-2xl aspect-[2/3]">
                  {isLoading ? (
                    <div className="w-full h-full skeleton" />
                  ) : (
                    <img
                      src={person?.profile_path ? `${IMAGE_BASE}${person.profile_path}` : PLACEHOLDER}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                      alt={person?.name}
                    />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div className="space-y-3 pt-2">
                    <div className="h-9 skeleton w-3/4 rounded-xl" />
                    <div className="h-4 skeleton w-1/3 rounded-lg" />
                    <div className="h-4 skeleton w-1/2 rounded-lg" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight font-display mb-3 tracking-wide">
                      {person?.name}
                    </h2>

                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {person?.known_for_department && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand px-2.5 py-1 bg-brand/10 rounded-lg border border-brand/20">
                          {person.known_for_department}
                        </span>
                      )}
                      {person?.popularity && (
                        <span className="text-[10px] font-black text-white/40 glass px-2.5 py-1 rounded-lg">
                          ★ {person.popularity.toFixed(0)} popularity
                        </span>
                      )}
                    </div>

                    {/* Birthday / birthplace */}
                    <div className="space-y-1.5 mb-6">
                      {person?.birthday && (
                        <p className="text-[12px] text-white/40 font-medium">
                          🎂 {new Date(person.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          {person?.deathday && ` — ${new Date(person.deathday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
                        </p>
                      )}
                      {person?.place_of_birth && (
                        <p className="text-[12px] text-white/40 font-medium">
                          📍 {person.place_of_birth}
                        </p>
                      )}
                    </div>

                    {/* Favorite button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleFavorite}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-wider rounded-2xl border-2 transition-all duration-300 ${
                        isFavorited
                          ? "bg-brand/10 border-brand text-brand"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-brand/50 hover:text-brand"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Biography */}
            {(isLoading || person?.biography) && (
              <div className="mt-10">
                <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Biography</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 0.9, 0.8, 0.6].map((w, i) => (
                      <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${w * 100}%` }} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/50 leading-relaxed">
                    {person?.biography || "No biography available."}
                  </p>
                )}
              </div>
            )}

            {/* Known For */}
            {(isLoading || knownFor.length > 0) && (
              <div className="mt-10">
                <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-5">Known For</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 overscroll-contain">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-24">
                        <div className="aspect-[2/3] skeleton rounded-2xl mb-2" />
                        <div className="h-2.5 skeleton rounded w-3/4" />
                      </div>
                    ))
                  ) : (
                    knownFor.map((m) => (
                      <div key={m.id} className="flex-shrink-0 w-24 group/km">
                        <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover/km:border-brand/30 transition-colors mb-2">
                          <img
                            src={m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : PLACEHOLDER}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/km:scale-105"
                            onError={(e) => { e.target.src = PLACEHOLDER; }}
                            alt={m.title}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-white/40 group-hover/km:text-white transition-colors leading-tight line-clamp-2">
                          {m.title}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
