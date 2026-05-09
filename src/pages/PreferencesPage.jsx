import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCineStore } from "../store/useCineStore";
import ActorPicker from "../components/ActorPicker";
import { IMAGE_BASE } from "../api/tmdb";
import { backend } from "../api/backend";

const GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" }, { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" },
];

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const IMG_PLACEHOLDER = "https://via.placeholder.com/64x64/111/444?text=?";

export default function PreferencesPage() {
  const {
    userId,
    selectedActors, setSelectedActors,
    selectedGenres, toggleGenre,
    selectedMood, setSelectedMood,
  } = useCineStore();

  const [showActorPicker, setShowActorPicker] = useState(false);
  const [localActors, setLocalActors] = useState(selectedActors);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleLocalActor = (actor) => {
    const slim = { id: actor.id, name: actor.name, profile_path: actor.profile_path ?? null };
    setLocalActors((prev) =>
      prev.find((a) => a.id === slim.id)
        ? prev.filter((a) => a.id !== slim.id)
        : [...prev, slim]
    );
  };

  const saveActors = async () => {
    setSelectedActors(localActors);
    if (userId) {
      try {
        await backend.updatePreferences(userId, {
          favoriteActors: localActors.map(a => a.id),
          favoriteGenres: selectedGenres.map(g => g.name)
        });
      } catch (err) {
        console.error("Failed to sync actors:", err);
      }
    }
    setShowActorPicker(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleToggleGenre = async (genre) => {
    toggleGenre(genre);
    if (userId) {
      // Get fresh state after toggle
      const { selectedGenres: nextGenres } = useCineStore.getState();
      try {
        await backend.updatePreferences(userId, {
          favoriteActors: selectedActors.map(a => a.id),
          favoriteGenres: nextGenres.map(g => g.name)
        });
      } catch (err) {
        console.error("Failed to sync genres:", err);
      }
    }
  };

  return (
    <div className="px-6 sm:px-12 py-10 max-w-3xl mx-auto pb-32">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-6 h-[2px] bg-brand" />
        <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Algorithm Sync</p>
      </div>
      <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase mb-12">
        Preferences
      </h1>

      {/* Actors section */}
      <section className="mb-20">
        <SectionHeader 
          title="Talent Pool" 
          subtitle={`${selectedActors.length} Icons Followed`}
          action={
            <button
              onClick={() => { setLocalActors(selectedActors); setShowActorPicker((v) => !v); }}
              className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-brand hover:border-brand/30 transition-all"
            >
              {showActorPicker ? "Close Editor" : "Edit List"}
            </button>
          }
        />

        <AnimatePresence mode="wait">
          {showActorPicker ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8"
            >
              <ActorPicker actors={localActors} onToggle={toggleLocalActor} />
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  {localActors.length} Selected
                </p>
                <button
                  onClick={saveActors}
                  className="px-8 py-3 bg-brand text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-4"
            >
              {selectedActors.length === 0 && (
                <p className="text-sm text-white/20 italic">No actors selected yet. Start by editing your list.</p>
              )}
              <AnimatePresence mode="popLayout">
                {selectedActors.map((actor) => (
                  <motion.div
                    key={actor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                    className="flex items-center gap-3 pl-1 pr-4 py-1 glass rounded-full border border-white/5 group hover:border-brand/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-lg">
                      <img
                        src={actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : IMG_PLACEHOLDER}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        onError={(e) => { e.target.src = IMG_PLACEHOLDER; }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white/50 group-hover:text-white transition-colors">{actor.name}</span>
                    <button
                      onClick={() => setSelectedActors(selectedActors.filter((a) => a.id !== actor.id))}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-white/5 text-white/20 hover:bg-brand hover:text-white transition-all ml-1"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Genres section */}
      <section className="mb-20">
        <SectionHeader 
          title="Genre Filter" 
          subtitle={`${selectedGenres.length} Categories Active`}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {GENRES.map((genre, i) => {
            const active = !!selectedGenres.find((g) => g.id === genre.id);
            return (
              <motion.button
                key={genre.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleGenre(genre)}
                className={`px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border-2 transition-all duration-300 ${
                  active
                    ? "border-brand bg-brand/10 text-white shadow-xl shadow-brand/10"
                    : "border-white/5 bg-white/[0.02] text-white/20 hover:text-white/60 hover:border-white/10"
                }`}
              >
                {genre.name}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Mood section */}
      <section>
        <SectionHeader 
          title="Atmosphere" 
          subtitle="Real-time Vibe Calibration"
        />
        <div className="flex flex-wrap gap-3">
          {["Excited 🔥", "Chill 🌙", "Inspired 💡", "Scared 😱", "Happy 😄", "Emotional 💙"].map((m) => {
            const id = m.split(" ")[0].toLowerCase();
            const active = selectedMood?.id === id;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(active ? null : { id, label: m })}
                className={`px-6 py-3 rounded-2xl text-xs font-bold border-2 transition-all duration-300 ${
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/5 bg-white/[0.02] text-white/20 hover:text-white hover:border-white/10"
                }`}
              >
                {m}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Saved Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 glass px-8 py-4 rounded-2xl border-brand/50 shadow-2xl flex items-center gap-4"
          >
            <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-xs">✓</div>
            <span className="text-xs font-black text-white uppercase tracking-widest">Preferences Updated</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
