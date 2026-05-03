import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCineStore } from "../store/useCineStore";
import ActorPicker from "../components/ActorPicker";
import { IMAGE_BASE } from "../api/tmdb";

const GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" }, { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" },
];

const IMG_PLACEHOLDER = "https://via.placeholder.com/60x60/1a1a1a/444?text=?";

export default function PreferencesPage() {
  const {
    selectedActors, setSelectedActors,
    selectedGenres, toggleGenre,
    selectedMood, setSelectedMood,
  } = useCineStore();

  const [showActorPicker, setShowActorPicker] = useState(false);
  const [localActors, setLocalActors] = useState(selectedActors);

  const toggleLocalActor = (actor) => {
    const slim = { id: actor.id, name: actor.name, profile_path: actor.profile_path ?? null };
    setLocalActors((prev) =>
      prev.find((a) => a.id === slim.id)
        ? prev.filter((a) => a.id !== slim.id)
        : [...prev, slim]
    );
  };

  const saveActors = () => {
    setSelectedActors(localActors);
    setShowActorPicker(false);
  };

  return (
    <div className="px-6 sm:px-8 py-8 max-w-2xl">
      {/* Header */}
      <p className="text-[10px] text-[#E50914] font-bold tracking-[0.3em] uppercase mb-1">Customize</p>
      <h1 className="text-3xl font-black text-white mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>
        Your Preferences
      </h1>

      {/* Actors section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Favourite Actors</h2>
            <p className="text-xs text-[#444] mt-0.5">{selectedActors.length} selected</p>
          </div>
          <button
            onClick={() => { setLocalActors(selectedActors); setShowActorPicker((v) => !v); }}
            className="text-xs text-[#E50914] hover:text-[#ff6b35] font-semibold transition-colors"
          >
            {showActorPicker ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Current actors */}
        {!showActorPicker && (
          <div className="flex flex-wrap gap-3">
            {selectedActors.length === 0 && (
              <p className="text-sm text-[#333]">No actors selected yet.</p>
            )}
            <AnimatePresence>
              {selectedActors.map((actor) => (
                <motion.div
                  key={actor.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#111] border border-[#1e1e1e] rounded-full"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#2a2a2a] flex-shrink-0">
                    <img
                      src={actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : IMG_PLACEHOLDER}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { e.target.src = IMG_PLACEHOLDER; }}
                    />
                  </div>
                  <span className="text-xs text-[#888]">{actor.name}</span>
                  <button
                    onClick={() => setSelectedActors(selectedActors.filter((a) => a.id !== actor.id))}
                    className="text-[#333] hover:text-[#E50914] transition-colors text-sm leading-none ml-1"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Actor picker */}
        <AnimatePresence>
          {showActorPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-4">
                <ActorPicker actors={localActors} onToggle={toggleLocalActor} />
                <button
                  onClick={saveActors}
                  className="mt-4 px-5 py-2.5 bg-[#E50914] hover:bg-[#c40812] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#E50914]/20"
                >
                  Save ({localActors.length} selected)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Genres section */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-white mb-1">Favourite Genres</h2>
        <p className="text-xs text-[#444] mb-4">{selectedGenres.length} selected</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = !!selectedGenres.find((g) => g.id === genre.id);
            return (
              <motion.button
                key={genre.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  active
                    ? "border-[#E50914] bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20"
                    : "border-[#1e1e1e] bg-[#111] text-[#555] hover:border-[#333] hover:text-white"
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
        <h2 className="text-sm font-semibold text-white mb-1">Current Mood</h2>
        <p className="text-xs text-[#444] mb-4">Affects recommendations</p>
        <div className="flex flex-wrap gap-2">
          {["Excited 🔥", "Chill 🌙", "Inspired 💡", "Scared 😱", "Happy 😄", "Emotional 💙"].map((m) => {
            const id = m.split(" ")[0].toLowerCase();
            const active = selectedMood?.id === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedMood(active ? null : { id, label: m })}
                className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                  active
                    ? "border-[#F5C518] bg-[#F5C518]/10 text-[#F5C518]"
                    : "border-[#1e1e1e] bg-[#111] text-[#555] hover:text-white hover:border-[#333]"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
