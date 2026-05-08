import { create } from "zustand";
import { persist } from "zustand/middleware";

// Deferred import to avoid circular dependency — accessed at call-time only
const clearWatchlist = () => {
  // Dynamically access the watchlist store to avoid a circular import at module init
  import("./useWatchlistStore").then(({ useWatchlistStore }) => {
    useWatchlistStore.getState().clearWatchlist();
  });
};


export const useCineStore = create(
  persist(
    (set) => ({
      // ── auth ──────────────────────────────────────────────────────────────
      userId: null,
      token: null,
      userName: null,

      // Called after login OR signup
      setAuth: ({ userId, token, name }) =>
        set({ userId, token, userName: name ?? null }),

      logout: () => {
        clearWatchlist(); // also clear the separate watchlist store
        set({
          userId: null,
          token: null,
          userName: null,
          isOnboarded: false,
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          watchlist: [],
        });
      },

      // ── onboarding / preferences ──────────────────────────────────────────
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

      // ── legacy setters (kept for backwards compatibility) ─────────────────
      setUserId: (id) => set({ userId: id }),
      setToken: (token) => set({ token }),

      // ── watchlist (kept as secondary cache; primary is useWatchlistStore) ─
      watchlist: [],
      setWatchlist: (list) => set({ watchlist: list }),

      // Kept so ProfilePage logout still compiles
      resetPreferences: () =>
        set({
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          isOnboarded: false,
          userId: null,
          token: null,
          userName: null,
        }),
    }),
    { name: "cinematch-prefs" }
  )
);
