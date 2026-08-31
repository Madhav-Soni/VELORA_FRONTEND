import { create } from "zustand";
import { persist } from "zustand/middleware";
import { backend } from "../api/backend";
import { queryClient } from "../App";

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const MOODS = [
  { id: "relaxed", label: "Relaxed", icon: "😌" },
  { id: "excited", label: "Excited", icon: "🤩" },
  { id: "melancholy", label: "Melancholy", icon: "😢" },
  { id: "tense", label: "Tense", icon: "😰" },
  { id: "romantic", label: "Romantic", icon: "🥰" },
  { id: "thoughtful", label: "Thoughtful", icon: "🤔" },
];

export const MOOD_TO_GENRE = {
  relaxed: 35,    // Comedy
  excited: 28,    // Action
  melancholy: 18, // Drama
  tense: 53,      // Thriller
  romantic: 10749, // Romance
  thoughtful: 99,  // Documentary
};

export const useVeloraStore = create(
  persist(
    (set, get) => ({
      // ── auth ─────────────────────────────────────────────────────────────
      userId: null,
      token: null,
      userName: null,

      /** Called after login OR signup. Safely handles missing name during signup. */
      setAuth: ({ userId, token, name }) => {
        const currentName = get().userName;
        set({
          userId,
          token,
          // If name is provided, use it. If not, keep current name or null.
          userName: (name && typeof name === "string" && name.trim()) 
            ? name.trim() 
            : (currentName || null),
        });
      },
      logout: () => {
        // Clear all cached queries to prevent data leaking to next user
        if (queryClient) queryClient.clear();
        set({
          userId: null,
          token: null,
          userName: null,
          isOnboarded: false,
          selectedActors: [],
          selectedGenres: [],
          selectedMood: null,
          activeMood: "All",
          watchlist: [],
          favorites: [],
        });
      },

      // ── onboarding / preferences ──────────────────────────────────────────
      selectedActors: [],
      selectedGenres: [],
      selectedMood: null, // { id, label }
      activeMood: "All", // For Topbar filtering
      isOnboarded: false,

      setSelectedActors: (actors) => set({ selectedActors: actors }),
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      setSelectedMood: (mood) => set({ selectedMood: mood }),
      setActiveMood: (mood) => set({ activeMood: mood }),
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
      // ── favorites ─────────────────────────────────────────────────────────
      favorites: [],

      addToFavorites: (movie) =>
        set((state) => ({
          favorites: state.favorites.find((m) => m.id === movie.id)
            ? state.favorites
            : [{ ...movie, favoritedAt: Date.now() }, ...state.favorites],
        })),

      removeFromFavorites: (movieId) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== movieId),
        })),

      isInFavorites: (movieId) => get().favorites.some((m) => m.id === movieId),

      clearFavorites: () => set({ favorites: [] }),

      setFavorites: (list) => set({ favorites: list }),

      addToFavoritesAsync: async (movie) => {
        const previousFavorites = get().favorites;
        const { userId } = get();
        get().addToFavorites(movie); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().favorites.map((m) => m.id);
            await backend.syncFavorites(userId, updatedIds);
          } catch (err) {
            console.error("Backend favorites sync failed:", err);
            set({ favorites: previousFavorites });
          }
        }
      },

      removeFromFavoritesAsync: async (movieId) => {
        const previousFavorites = get().favorites;
        const { userId } = get();
        get().removeFromFavorites(movieId); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().favorites.map((m) => m.id);
            await backend.syncFavorites(userId, updatedIds);
          } catch (err) {
            console.error("Backend favorites sync failed:", err);
            set({ favorites: previousFavorites });
          }
        }
      },

      clearFavoritesAsync: async () => {
        const previousFavorites = get().favorites;
        const { userId } = get();
        get().clearFavorites(); // Optimistic update
        if (userId) {
          try {
            await backend.syncFavorites(userId, []);
          } catch (err) {
            console.error("Backend favorites clear failed:", err);
            set({ favorites: previousFavorites });
          }
        }
      },

      syncFavoritesWithBackend: async () => {
        const requestedUserId = get().userId;
        const requestedToken = get().token;
        if (!requestedUserId || !requestedToken) return;

        try {
          const remoteList = await backend.getFavorites(requestedUserId);

          // Stale request guard: only commit if user/session hasn't changed
          if (get().userId !== requestedUserId || get().token !== requestedToken) return;

          // Standardize: ensure favorites items are objects with an 'id' property
          const normalizedList = (remoteList || []).map(id => 
            typeof id === "object" ? id : { id }
          );
          set({ favorites: normalizedList });
        } catch (err) {
          console.error("Favorites sync failed:", err);
        }
      },

      // ── async sync actions ───────────────────────────────────────────────
      syncWatchlistWithBackend: async () => {
        const requestedUserId = get().userId;
        const requestedToken = get().token;
        if (!requestedUserId || !requestedToken) return;

        try {
          const remoteList = await backend.getWatchlist(requestedUserId);

          // Stale request guard: only commit if user/session hasn't changed
          if (get().userId !== requestedUserId || get().token !== requestedToken) return;

          // Standardize: ensure watchlist items are objects with an 'id' property
          const normalizedList = (remoteList || []).map(id => 
            typeof id === "object" ? id : { id }
          );
          set({ watchlist: normalizedList });
        } catch (err) {
          console.error("Watchlist sync failed:", err);
        }
      },

      addToWatchlistAsync: async (movie) => {
        const previousWatchlist = get().watchlist;
        const { userId } = get();
        get().addToWatchlist(movie); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().watchlist.map((m) => m.id);
            await backend.syncWatchlist(userId, updatedIds);
          } catch (err) {
            console.error("Backend watchlist sync failed:", err);
            set({ watchlist: previousWatchlist });
          }
        }
      },

      removeFromWatchlistAsync: async (movieId) => {
        const previousWatchlist = get().watchlist;
        const { userId } = get();
        get().removeFromWatchlist(movieId); // Optimistic update
        if (userId) {
          try {
            const updatedIds = get().watchlist.map((m) => m.id);
            await backend.syncWatchlist(userId, updatedIds);
          } catch (err) {
            console.error("Backend watchlist sync failed:", err);
            set({ watchlist: previousWatchlist });
          }
        }
      },

      clearWatchlistAsync: async () => {
        const previousWatchlist = get().watchlist;
        const { userId } = get();
        get().clearWatchlist(); // Optimistic update
        if (userId) {
          try {
            await backend.syncWatchlist(userId, []);
          } catch (err) {
            console.error("Backend watchlist clear failed:", err);
            set({ watchlist: previousWatchlist });
          }
        }
      },

      syncPreferencesWithBackend: async () => {
        const requestedUserId = get().userId;
        const requestedToken = get().token;
        if (!requestedUserId || !requestedToken) return;

        try {
          const prefs = await backend.getPreferences(requestedUserId);

          // Stale request guard
          if (get().userId !== requestedUserId || get().token !== requestedToken) return;

          if (prefs) {
            // Normalize genres: backend might return strings, frontend expects objects
            const normalizedGenres = (prefs.favoriteGenres || [])
              .map(g => {
                if (typeof g === "string") {
                  return GENRES.find(item => item.name === g) || null;
                }
                return g;
              })
              .filter(Boolean);

            // Hydrate mood: find matching mood object if backend returns ID or partial object
            let hydratedMood = prefs.selectedMood || null;
            if (hydratedMood && typeof hydratedMood === "string") {
              hydratedMood = MOODS.find(m => m.id === hydratedMood) || null;
            } else if (hydratedMood && hydratedMood.id && !hydratedMood.label) {
              hydratedMood = MOODS.find(m => m.id === hydratedMood.id) || hydratedMood;
            }

            // Normalize actors: ensure they have ID and Name, ignore malformed objects
            // Preserve existing local actors if backend payload is completely invalid (not an array)
            const remoteActors = prefs.favoriteActors;
            const normalizedActors = Array.isArray(remoteActors)
              ? remoteActors
                  .filter(a => a && typeof a === 'object' && (a.id || a._id) && a.name)
                  .map(a => ({
                    id: a.id || a._id,
                    name: a.name,
                    profile_path: a.profile_path || null
                  }))
              : get().selectedActors;

            set({
              selectedActors: normalizedActors,
              selectedGenres: normalizedGenres,
              selectedMood: hydratedMood,
              isOnboarded: !!(normalizedActors.length || normalizedGenres.length),
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
          favorites: [],
        }),
    }),
    { 
      name: "velora-prefs",
      partialize: (state) => {
        const { activeMood, ...rest } = state;
        return rest;
      }
    }
  )
);

// ── Shim: re-export as useWatchlistStore and useCineStore so existing imports keep working ─────
// This ensures a smooth transition while we update other files to use useVeloraStore.
export const useCineStore = useVeloraStore;
export const useWatchlistStore = useVeloraStore;
