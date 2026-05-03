import { motion, AnimatePresence } from "framer-motion";
import useActorSearch, { usePopularActors } from "../hooks/useActorSearch";
import { IMAGE_BASE } from "../api/tmdb";

function ActorCard({ actor, selected, onToggle, index }) {
  const imgSrc = actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : null;
  const initials = actor.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(actor)}
      className={`relative p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group ${
        selected
          ? "bg-gradient-to-b from-[#E50914]/20 to-[#E50914]/5 border-2 border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.2)]"
          : "bg-[#111] border-2 border-transparent hover:border-[#333] hover:bg-[#151515]"
      }`}
    >
      {/* Selection Checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-2 right-2 w-5 h-5 bg-[#E50914] rounded-full flex items-center justify-center z-10"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      <div className={`relative w-16 h-16 mb-3 rounded-full overflow-hidden flex flex-shrink-0 items-center justify-center border-2 transition-colors duration-300 ${
        selected ? "border-[#E50914]" : "border-[#333] group-hover:border-[#555]"
      }`}>
        {imgSrc ? (
          <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#222] flex items-center justify-center text-[#888] text-sm font-bold tracking-wider">
            {initials}
          </div>
        )}
      </div>

      <p className={`text-xs font-medium text-center line-clamp-2 leading-tight ${selected ? "text-white" : "text-[#aaa] group-hover:text-white"}`}>
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
    <div className="flex flex-col gap-6">

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your favorite actors..."
          className="w-full p-4 pl-12 bg-[#111] border border-[#222] focus:border-[#E50914] text-white rounded-xl outline-none transition-colors shadow-inner"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Loading */}
      {showLoading && (
        <p className="text-[#E50914] text-sm font-medium animate-pulse text-center">
          Searching universe...
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayList.map((actor, i) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            index={i}
            selected={!!actors.find((a) => a.id === actor.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between px-2 pt-2 border-t border-[#1a1a1a]">
        <p className="text-xs text-[#666] font-medium tracking-wide">
          SELECTED ACTORS
        </p>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${actors.length >= 3 ? "text-[#E50914]" : "text-white"}`}>
            {actors.length}
          </span>
          <span className="text-xs text-[#666]">/ 3 required</span>
        </div>
      </div>
    </div>
  );
}