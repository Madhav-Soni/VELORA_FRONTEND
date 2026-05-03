import { motion } from "framer-motion";
import { useCineStore } from "../store/useCineStore";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { IMAGE_BASE } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { selectedActors, selectedGenres, selectedMood, resetPreferences } = useCineStore();
  const { watchlist } = useWatchlistStore();

  const stats = [
    { label: "Watchlist", value: watchlist.length, icon: "🔖" },
    { label: "Fav Actors", value: selectedActors.length, icon: "🎭" },
    { label: "Genres", value: selectedGenres.length, icon: "🎬" },
  ];

  return (
    <div className="px-6 sm:px-8 py-8 max-w-xl">
      <p className="text-[10px] text-[#E50914] font-bold tracking-[0.3em] uppercase mb-1">You</p>
      <h1 className="text-3xl font-black text-white mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>Profile</h1>

      {/* Avatar + name */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#ff6b35] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#E50914]/20">
          U
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Movie Fan</h2>
          <p className="text-sm text-[#555]">CineMatch member</p>
          {selectedMood && (
            <p className="text-xs text-[#F5C518] mt-1">Mood: {selectedMood.label || selectedMood.id}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {stats.map(({ label, value, icon }) => (
          <motion.div key={label} whileHover={{ y: -3 }} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-black text-white" style={{ fontFamily: "'Bebas Neue', cursive" }}>{value}</p>
            <p className="text-[10px] text-[#444] uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actors */}
      {selectedActors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[#333] uppercase tracking-widest mb-3">Favourite Actors</h3>
          <div className="flex flex-wrap gap-2">
            {selectedActors.map((actor) => (
              <div key={actor.id} className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#111] border border-[#1a1a1a] rounded-full">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1a1a1a]">
                  <img src={actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : "https://via.placeholder.com/24x24/1a1a1a/444?text=?"} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/24x24/1a1a1a/444?text=?"; }} />
                </div>
                <span className="text-xs text-[#777]">{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genres */}
      {selectedGenres.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-bold text-[#333] uppercase tracking-widest mb-3">Favourite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((g) => (
              <span key={g.id} className="text-xs text-[#777] bg-[#111] border border-[#1a1a1a] px-3 py-1 rounded-full">{g.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 border-t border-[#111] pt-6">
        <button onClick={() => navigate("/preferences")} className="w-full text-left px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] text-sm text-[#777] hover:text-white hover:border-[#2a2a2a] transition-all">
          ⚙️ Edit Preferences
        </button>
        <button onClick={() => navigate("/watchlist")} className="w-full text-left px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] text-sm text-[#777] hover:text-white hover:border-[#2a2a2a] transition-all">
          🔖 View Watchlist
        </button>
        <button onClick={() => navigate("/onboarding")} className="w-full text-left px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] text-sm text-[#777] hover:text-white hover:border-[#2a2a2a] transition-all">
          🎬 Redo Onboarding
        </button>
        <button onClick={() => { resetPreferences(); navigate("/"); }} className="w-full text-left px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] text-sm text-[#E50914]/50 hover:text-[#E50914] hover:border-[#E50914]/20 transition-all mt-2">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
