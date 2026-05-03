import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearchMulti } from "../../hooks/useMovieQueries";
import { IMAGE_BASE } from "../../api/tmdb";
import { useCineStore } from "../../store/useCineStore";

const MOODS = ["All", "Action", "Comedy", "Horror", "Romance", "Sci-Fi", "Thriller"];

const PLACEHOLDER_IMG = "https://via.placeholder.com/40x60/1a1a1a/444?text=?";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Topbar({ onMovieSelect }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeMood, setActiveMood] = useState("All");
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const { resetPreferences } = useCineStore();

  const debouncedQuery = useDebounce(input, 350);
  const { data, isFetching } = useSearchMulti(debouncedQuery);

  const suggestions = data?.results
    ?.filter((r) => r.media_type === "movie" || r.media_type === "person")
    .slice(0, 6) ?? [];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowDropdown(false);
      if (!profileRef.current?.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item) => {
    setInput("");
    setShowDropdown(false);
    if (item.media_type === "movie" && onMovieSelect) {
      onMovieSelect(item.id);
    }
  };

  return (
    <header className="fixed top-0 left-[220px] right-0 z-30 h-[64px] flex items-center px-6 gap-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#141414]">
      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-sm">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141414] border transition-all duration-200 ${showDropdown && input ? "border-[#E50914]/40" : "border-[#1e1e1e]"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="text-[#444] flex-shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
            onFocus={() => input && setShowDropdown(true)}
            placeholder="Search movies, actors..."
            className="bg-transparent text-sm text-white placeholder-[#333] outline-none w-full"
          />
          {isFetching && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-[#333] border-t-[#E50914] rounded-full flex-shrink-0"
            />
          )}
          {input && !isFetching && (
            <button onClick={() => { setInput(""); setShowDropdown(false); }} className="text-[#444] hover:text-white transition-colors text-base leading-none flex-shrink-0">×</button>
          )}
        </div>

        {/* Dropdown suggestions */}
        <AnimatePresence>
          {showDropdown && input && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl shadow-black/60"
            >
              {suggestions.length === 0 && !isFetching && (
                <p className="text-xs text-[#555] text-center py-4">No results found</p>
              )}
              {suggestions.map((item) => {
                const img = item.poster_path || item.profile_path;
                const title = item.title || item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={img ? `${IMAGE_BASE}${img}` : PLACEHOLDER_IMG}
                      className="w-8 h-10 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{title}</p>
                      <p className="text-[10px] text-[#E50914] capitalize">{item.media_type}</p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mood filters */}
      <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setActiveMood(mood)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeMood === mood
                ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20"
                : "bg-[#141414] text-[#555] hover:text-white hover:bg-[#1e1e1e] border border-[#1e1e1e]"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setShowProfile((p) => !p)}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E50914] to-[#ff6b35] flex items-center justify-center text-white text-xs font-bold shadow-lg">
            U
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" className={`text-[#444] transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl shadow-black/60"
            >
              {[
                { label: "Profile", to: "/profile", icon: "👤" },
                { label: "Preferences", to: "/preferences", icon: "⚙️" },
                { label: "Watchlist", to: "/watchlist", icon: "🔖" },
              ].map(({ label, to, icon }) => (
                <button
                  key={to}
                  onClick={() => { navigate(to); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#888] hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
              <div className="border-t border-[#1e1e1e]">
                <button
                  onClick={() => { resetPreferences(); navigate("/"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E50914]/70 hover:text-[#E50914] hover:bg-[#E50914]/5 transition-colors text-left"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
