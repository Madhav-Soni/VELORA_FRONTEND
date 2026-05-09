import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useVeloraStore } from "../store/useVeloraStore";
import { backend } from "../api/backend";
import ActorPicker from "../components/ActorPicker";

const GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" }, { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" }, { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" }, { id: 37, name: "Western" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { userId, setSelectedActors, setSelectedGenres, setIsOnboarded } = useVeloraStore();
  const [step, setStep] = useState(0);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.find((g) => g.id === genre.id)
        ? prev.filter((g) => g.id !== genre.id)
        : [...prev, genre]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (userId) {
        await backend.updatePreferences(userId, {
          favoriteActors: actors.map(a => a.id),
          favoriteGenres: genres.map(g => g.name)
        });
      }
      setSelectedActors(actors);
      setSelectedGenres(genres);
      setIsOnboarded(true);
      navigate("/home");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      // Even if it fails, maybe proceed or show an error. We'll proceed for now.
      setSelectedActors(actors);
      setSelectedGenres(genres);
      setIsOnboarded(true);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Pick your favourite actors",
      subtitle: "Search or pick from popular — select at least 3 to continue",
      content: (
        <ActorPicker
          actors={actors}
          onToggle={(actor) => setActors(prev => prev.find(a => a.id === actor.id) ? prev.filter(a => a.id !== actor.id) : [...prev, actor])}
        />
      ),
      canNext: actors.length >= 3,
    },
    {
      title: "What genres do you love?",
      subtitle: "Select all that speak to you",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          {GENRES.map((genre) => {
            const selected = !!genres.find((g) => g.id === genre.id);
            return (
              <motion.button
                key={genre.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  selected
                    ? "border-[#E50914] bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20"
                    : "border-[#2a2a2a] bg-[#111] text-[#aaa] hover:border-[#444] hover:text-white"
                }`}
              >
                {genre.name}
              </motion.button>
            );
          })}
        </div>
      ),
      canNext: genres.length > 0,
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#ff6b6b] to-[#E50914]" />

      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-4 py-10">
        {/* Logo */}
        <p
          className="text-center text-2xl mb-8"
          style={{
            fontFamily: "'Bebas Neue', cursive",
            background: "linear-gradient(135deg, #E50914, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          VELORA
        </p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-[#1e1e1e]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="h-full bg-[#E50914] rounded-full"
              />
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <p className="text-xs text-[#E50914] font-semibold tracking-widest uppercase mb-1">
              Step {step + 1} of {steps.length}
            </p>
            <h2 className="text-2xl font-bold text-white mb-1">{current.title}</h2>
            <p className="text-sm text-[#555] mb-6">{current.subtitle}</p>
            {current.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pt-4 border-t border-[#1a1a1a]">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 rounded-xl border border-[#222] text-[#666] text-sm hover:border-[#444] hover:text-white transition-all"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: current.canNext ? 1.02 : 1 }}
              whileTap={{ scale: current.canNext ? 0.98 : 1 }}
              onClick={() => current.canNext && setStep((s) => s + 1)}
              disabled={!current.canNext}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                current.canNext
                  ? "bg-[#E50914] hover:bg-[#c40812] text-white shadow-lg shadow-[#E50914]/20"
                  : "bg-[#1a1a1a] text-[#444] cursor-not-allowed"
              }`}
            >
              Continue →
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: current.canNext ? 1.02 : 1 }}
              whileTap={{ scale: current.canNext ? 0.98 : 1 }}
              onClick={() => current.canNext && handleFinish()}
              disabled={!current.canNext || loading}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                current.canNext
                  ? "bg-[#E50914] hover:bg-[#c40812] text-white shadow-lg shadow-[#E50914]/20"
                  : "bg-[#1a1a1a] text-[#444] cursor-not-allowed"
              }`}
            >
              {loading ? "Saving..." : "Let's Go 🎬"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}