import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearchMulti } from "../../hooks/useMovieQueries";
import { IMAGE_BASE } from "../../api/tmdb";
import { useVeloraStore, MOODS as STORE_MOODS } from "../../store/useVeloraStore";

const MOODS = [{ id: "All", label: "All", icon: "✨" }, ...STORE_MOODS];
const PLACEHOLDER_IMG = "https://via.placeholder.com/40x60/1a1a1a/444?text=?";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Highlight = ({ text, match }) => {
  if (!match) return text;
  const parts = text.split(new RegExp(`(${match})`, "gi"));
  return (
    <span>
      {parts.map((p, i) =>
        p.toLowerCase() === match.toLowerCase()
          ? <span key={i} className="text-brand">{p}</span>
          : p
      )}
    </span>
  );
};

export default function Topbar({ onMovieSelect }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { activeMood, setActiveMood, userName, resetPreferences } = useVeloraStore();
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const debouncedQuery = useDebounce(input, 350);
  const { data, isFetching } = useSearchMulti(debouncedQuery);

  const suggestions = data?.results
    ?.filter((r) => r.media_type === "movie" || r.media_type === "person")
    .slice(0, 8) ?? [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) {
        setShowDropdown(false);
        setIsSearchActive(false);
      }
      if (!profileRef.current?.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (focusedIdx >= 0) handleSelect(suggestions[focusedIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item) => {
    setInput("");
    setShowDropdown(false);
    setFocusedIdx(-1);
    if (item.media_type === "movie" && onMovieSelect) {
      onMovieSelect(item.id);
    } else if (item.media_type === "person") {
      navigate("/discover"); // Or a person page if it existed
    }
  };

  return (
    <header className={`fixed top-0 left-0 md:left-[210px] right-0 z-[60] h-[72px] flex items-center px-6 sm:px-10 gap-6 transition-all duration-300 ${scrolled || isSearchActive ? "bg-[#080808]/80 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"
      }`}>
      {/* Search Backdrop */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setInput(""); setIsSearchActive(false); setShowDropdown(false); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] cursor-pointer"
          />
        )}
      </AnimatePresence>
      {/* Search Bar Container */}
      <div
        ref={searchRef}
        className={`relative flex-1 hidden sm:block transition-all duration-500 ease-out ${isSearchActive ? "max-w-2xl mx-auto scale-105" : "max-w-md"
          }`}
      >
        <div className={`flex items-center gap-3 px-5 py-3 rounded-[1.25rem] bg-white/[0.03] border transition-all duration-300 ${isSearchActive ? "bg-white/[0.07] border-brand shadow-[0_0_20px_rgba(229,9,20,0.15)]" : "border-white/5 hover:border-white/10"
          }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" className={`transition-colors duration-300 ${isSearchActive ? "text-brand" : "text-white/40"} flex-shrink-0`}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const val = e.target.value;
              setInput(val);
              setShowDropdown(true);
              setFocusedIdx(-1);
              setIsSearchActive(!!val);
            }}
            onFocus={() => { if (input) { setShowDropdown(true); setIsSearchActive(true); } }}
            placeholder="Search movies, actors..."
            className="bg-transparent text-[14px] font-medium text-white placeholder-white/20 outline-none w-full"
          />
          <AnimatePresence>
            {isFetching && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/10 border-t-brand rounded-full flex-shrink-0"
              />
            )}
          </AnimatePresence>
          {input && !isFetching && (
            <button onClick={() => { setInput(""); setShowDropdown(false); setIsSearchActive(false); }} className="text-white/20 hover:text-white transition-colors text-xl leading-none flex-shrink-0">×</button>
          )}
        </div>

        {/* Dropdown results */}
        <AnimatePresence>
          {showDropdown && input && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#0d0d0d] backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.95)] border border-white/10 z-[70] max-h-[70vh] overflow-y-auto scrollbar-hide"
            >
              {suggestions.length === 0 && !isFetching ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <span className="text-4xl mb-4">🎬</span>
                  <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">No results match your search</p>
                </div>
              ) : (
                <div className="py-4 px-2">
                  {suggestions.map((item, idx) => {
                    const img = item.poster_path || item.profile_path;
                    const title = item.title || item.name;
                    const active = focusedIdx === idx;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setFocusedIdx(idx)}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-5 px-6 py-4 transition-all duration-300 text-left rounded-2xl mb-1 ${active ? "bg-white/[0.08] translate-x-1" : "hover:bg-white/[0.04]"
                          }`}
                      >
                        <div className="w-12 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-xl relative">
                          <img
                            src={img ? `${IMAGE_BASE}${img}` : PLACEHOLDER_IMG}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-white truncate mb-1">
                            <Highlight text={title} match={input} />
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand px-1.5 py-0.5 bg-brand/10 rounded">
                              {item.media_type}
                            </span>
                            {item.release_date && (
                              <span className="text-[9px] font-bold text-white/20">
                                {new Date(item.release_date).getFullYear()}
                              </span>
                            )}
                          </div>
                        </div>
                        {active && (
                          <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest mr-2">Select ↵</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mood chips */}
      <div className="hidden xl:flex items-center gap-2 overflow-x-auto scrollbar-hide overscroll-contain">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setActiveMood(mood.id)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeMood === mood.id
                ? "bg-brand text-white shadow-lg shadow-brand/20"
                : "bg-white/[0.03] text-white/20 hover:text-white/60 border border-white/5"
              }`}
          >
            {mood.icon && <span>{mood.icon}</span>}
            {mood.label}
          </button>
        ))}
      </div>

      <div className="flex-1 sm:hidden" /> {/* Mobile Spacer */}

      {/* User Actions */}
      <div ref={profileRef} className="relative flex items-center gap-4">


        <button
          onClick={() => setShowProfile((p) => !p)}
          className="flex items-center gap-3 p-1 pl-3 glass rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300"
        >
          <span className="text-[11px] font-black text-white/40 uppercase tracking-widest hidden lg:block">
            {userName || "User"}
          </span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-orange flex items-center justify-center text-white text-[11px] font-black shadow-lg">
            {userName ? userName.charAt(0).toUpperCase() : "V"}
          </div>
          <motion.svg
            animate={{ rotate: showProfile ? 180 : 0 }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10" className="text-white/20 mr-2"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              className="absolute right-0 top-full mt-3 w-56 bg-[#111111]/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-[100]"
            >
              <div className="p-2 space-y-1">
                {[
                  { label: "View Profile", to: "/profile", icon: "👤" },
                  { label: "Preferences", to: "/preferences", icon: "⚙️" },
                  { label: "Watchlist", to: "/watchlist", icon: "🔖" },
                ].map(({ label, to, icon }) => (
                  <button
                    key={to}
                    onClick={() => { navigate(to); setShowProfile(false); }}
                    className="w-full flex items-center gap-4 px-5 py-3 text-xs font-bold text-white/40 hover:text-white hover:bg-white/[0.04] transition-all rounded-2xl text-left"
                  >
                    <span className="text-base">{icon}</span> {label}
                  </button>
                ))}
              </div>
              <div className="border-t border-white/5 p-2">
                <button
                  onClick={() => { resetPreferences(); navigate("/"); }}
                  className="w-full flex items-center gap-4 px-5 py-3 text-xs font-bold text-brand/50 hover:text-brand hover:bg-brand/5 transition-all rounded-2xl text-left"
                >
                  <span className="text-base">🚪</span> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}