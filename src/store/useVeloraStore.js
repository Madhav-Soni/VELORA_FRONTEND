import { create } from "zustand";
import { persist } from "zustand/middleware";
import { backend } from "../api/backend";

export const useVeloraStore = create(
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

      // ── async sync actions ───────────────────────────────────────────────
      syncWatchlistWithBackend: async () => {
        const { userId } = get();
        if (!userId) return;
        try {
          const remoteList = await backend.getWatchlist(userId);
          // Simple merge: remote wins or we merge based on ID
          set({ watchlist: remoteList });
        } catch (err) {
          console.error("Watchlist sync failed:", err);
        }
      },

      addToWatchlistAsync: async (movie) => {
        const { userId } = get();
        get().addToWatchlist(movie); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().watchlist.map((m) => m.id);
            await backend.syncWatchlist(userId, updatedIds);
          } catch (err) {
            console.error("Backend watchlist sync failed:", err);
          }
        }
      },

      removeFromWatchlistAsync: async (movieId) => {
        const { userId } = get();
        get().removeFromWatchlist(movieId); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().watchlist.map((m) => m.id);
            await backend.syncWatchlist(userId, updatedIds);
          } catch (err) {
            console.error("Backend watchlist sync failed:", err);
          }
        }
      },

      syncPreferencesWithBackend: async () => {
        const { userId } = get();
        if (!userId) return;
        try {
          const prefs = await backend.getPreferences(userId);
          if (prefs) {
            set({
              selectedActors: prefs.favoriteActors || [],
              selectedGenres: prefs.favoriteGenres || [],
              isOnboarded: !!(prefs.favoriteActors?.length || prefs.favoriteGenres?.length),
            });
          }
        } catch (err) {
          console.error("Preferences sync failed:", err);
        }
      },

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
    { name: "velora-prefs" }
  )
);

// ── Shim: re-export as useWatchlistStore and useCineStore so existing imports keep working ─────
// This ensures a smooth transition while we update other files to use useVeloraStore.
export const useCineStore = useVeloraStore;
export const useWatchlistStore = useVeloraStore;
