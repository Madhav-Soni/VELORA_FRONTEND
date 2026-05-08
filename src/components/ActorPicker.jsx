import { motion, AnimatePresence } from "framer-motion";
import useActorSearch, { usePopularActors } from "../hooks/useActorSearch";
import { IMAGE_BASE } from "../api/tmdb";

const ActorSkeleton = () => (
  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
    <div className="w-16 h-16 rounded-full skeleton mb-3" />
    <div className="w-12 h-2 skeleton rounded" />
  </div>
);

function ActorCard({ actor, selected, onToggle, index }) {
  const imgSrc = actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : null;
  const initials = actor.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(actor)}
      className={`relative p-4 rounded-3xl flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group ${
        selected
          ? "bg-brand/10 border-2 border-brand shadow-[0_0_32px_rgba(229,9,20,0.15)]"
          : "bg-white/[0.02] border-2 border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      {/* Selection Checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-3 right-3 w-6 h-6 bg-brand rounded-full flex items-center justify-center z-10 shadow-lg"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      <div className={`relative w-16 h-16 mb-4 rounded-full overflow-hidden flex flex-shrink-0 items-center justify-center border-2 transition-all duration-500 ${
        selected ? "border-brand shadow-lg" : "border-white/5 group-hover:border-white/20"
      }`}>
        {imgSrc ? (
          <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-sm font-black tracking-widest uppercase">
            {initials}
          </div>
        )}
      </div>

      <p className={`text-[11px] font-black text-center line-clamp-2 leading-tight uppercase tracking-wider transition-colors duration-300 ${selected ? "text-white" : "text-white/30 group-hover:text-white/60"}`}>
        {actor.name}
      </p>
    </motion.button>
  );
}

export default function ActorPicker({ actors, onToggle }) {
  const { actors: searchResults, isLoading, setQuery } = useActorSearch();
  const { data: popularActors = [], isLoading: isPopularLoading } = usePopularActors();

  const isSearching = searchResults.length > 0;
  const displayList = isSearching ? searchResults : popularActors;
  const showLoading = isLoading || (isPopularLoading && !isSearching);

  return (
    <div className="flex flex-col gap-8">

      {/* Advanced Search Input */}
      <div className="relative group/search">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-brand transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for icons (e.g. Nolan, DiCaprio)..."
          className="w-full p-5 pl-14 bg-white/[0.02] border-2 border-white/5 focus:border-brand/40 text-white font-bold text-sm rounded-[2rem] outline-none transition-all placeholder-white/10"
        />
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {showLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ActorSkeleton key={i} />)
        ) : (
          displayList.map((actor, i) => (
            <ActorCard
              key={actor.id}
              actor={actor}
              index={i}
              selected={!!actors.find((a) => a.id === actor.id)}
              onToggle={onToggle}
            />
          ))
        )}
      </div>

      {/* Algorithm Progress */}
      <div className="flex items-center justify-between px-4 py-4 glass border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3].map(dot => (
              <div key={dot} className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${actors.length >= dot ? 'bg-brand' : 'bg-white/10'}`} />
            ))}
          </div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            Sync Requirements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black transition-colors ${actors.length >= 3 ? "text-brand" : "text-white/40"}`}>
            {actors.length}
          </span>
          <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">/ 3 Required</span>
        </div>
      </div>
    </div>
  );
}