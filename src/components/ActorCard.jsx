import { motion } from "framer-motion";
import { IMAGE_BASE } from "../api/tmdb";

const PLACEHOLDER = "https://via.placeholder.com/150x150/111/444?text=?";

export default function ActorCard({ actor, index = 0 }) {
  const imageUrl = actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : PLACEHOLDER;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="flex-shrink-0 w-24 sm:w-28 text-center group cursor-pointer"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[#1a1a1a] group-hover:border-[#F5C518]/50 transition-all duration-300">
        <img
          src={imageUrl}
          alt={actor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
      </div>
      <p className="text-[11px] sm:text-xs font-semibold text-[#888] group-hover:text-white transition-colors truncate">
        {actor.name}
      </p>
      <p className="text-[9px] sm:text-[10px] text-[#444] truncate">
        {actor.known_for_department}
      </p>
    </motion.div>
  );
}
