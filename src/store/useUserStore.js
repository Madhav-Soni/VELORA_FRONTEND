import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      selectedActors: [],
      selectedGenres: [],
      selectedMood: "",

      setSelectedActors: (actors) => set({ selectedActors: actors }),
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      setSelectedMood: (mood) => set({ selectedMood: mood }),

      // Convenience: set all preferences at once (call at end of onboarding)
      setPreferences: ({ actors, genres, mood }) =>
        set({
          selectedActors: actors ?? [],
          selectedGenres: genres ?? [],
          selectedMood: mood ?? "",
        }),

      reset: () =>
        set({ selectedActors: [], selectedGenres: [], selectedMood: "" }),
    }),
    {
      name: "cinematch-user-prefs", // persisted in localStorage
    }
  )
);

export default useUserStore;