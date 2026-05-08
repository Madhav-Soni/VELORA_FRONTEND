import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCineStore = create(
  persist(
    (set, get) => ({
      // ── auth ─────────────────────────────────────────────────────────────
      userId: null,
      token: null,
      userName: null,

      /** Called after login OR signup. Safely ignores undefined name. */
      setAuth: ({ userId, token, name }) =>
        set({
          userId,
          token,
          // Only store name if it's a non-empty string — login may not return it
          userName: name && typeof name === "string" && name.trim() ? name.trim() : (get().userName ?? null),
        }),

      logout: () =>
        set({
          userId: null,
          token: null,
          userName: null,
          isOnboarded: false,
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          watchlist: [],
        }),

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

      // ── watchlist — single source of truth ───────────────────────────────
      watchlist: [],

      setWatchlist: (list) => set({ watchlist: list }),

      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: state.watchlist.find((m) => m.id === movie.id)
            ? state.watchlist
            : [{ ...movie, addedAt: Date.now() }, ...state.watchlist],
        })),

      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId),
        })),

      isInWatchlist: (movieId) => get().watchlist.some((m) => m.id === movieId),

      clearWatchlist: () => set({ watchlist: [] }),

      // ── legacy compat ─────────────────────────────────────────────────────
      setUserId: (id) => set({ userId: id }),
      setToken: (token) => set({ token }),
      resetPreferences: () =>
        set({
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          isOnboarded: false,
          userId: null,
          token: null,
          userName: null,
          watchlist: [],
        }),
    }),
    { name: "cinematch-prefs" }
  )
);

// ── Shim: re-export as useWatchlistStore so existing imports keep working ─────
// This lets MovieCard, MovieModal, WatchlistPage, etc. compile without changes
// while we migrate them to useCineStore over time.
export const useWatchlistStore = useCineStore;
