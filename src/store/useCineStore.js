import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCineStore = create(
  persist(
    (set) => ({
      selectedActors: [],
      selectedGenres: [],
      selectedMood: null,
      isOnboarded: false,

      setSelectedActors: (actors) => set({ selectedActors: actors }),
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      setSelectedMood: (mood) => set({ selectedMood: mood }),
      setIsOnboarded: (val) => set({ isOnboarded: val }),

      toggleGenre: (genre) =>
        set((state) => ({
          selectedGenres: state.selectedGenres.find((g) => g.id === genre.id)
            ? state.selectedGenres.filter((g) => g.id !== genre.id)
            : [...state.selectedGenres, genre],
        })),

      resetPreferences: () =>
        set({
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          isOnboarded: false,
        }),
    }),
    { name: "cinematch-prefs" }
  )
);
