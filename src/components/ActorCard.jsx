import { motion } from "framer-motion";
import { IMAGE_BASE } from "../api/tmdb";

const PLACEHOLDER = "https://via.placeholder.com/150x150/111/444?text=?";

export default function ActorCard({ actor, index = 0, onClick }) {
  const imageUrl = actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : PLACEHOLDER;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      onClick={() => onClick?.(actor.id)}
      className="flex-shrink-0 w-24 sm:w-28 text-center group cursor-pointer relative"
    >
      {/* Hover Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-brand/20 to-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-brand/40 transition-all duration-500 shadow-2xl">
        <img
          src={imageUrl}
          alt={actor.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
      </div>

      <div className="px-1">
        <p className="text-[11px] sm:text-xs font-black text-white/50 group-hover:text-white transition-colors truncate uppercase tracking-wider mb-0.5">
          {actor.name}
        </p>
        <p className="text-[9px] sm:text-[10px] font-bold text-white/20 group-hover:text-brand/60 transition-colors uppercase tracking-[0.1em] truncate">
          {actor.known_for_department}
        </p>
      </div>
    </motion.div>
  );
}
