import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],

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

      setWatchlist: (list) => set({ watchlist: list }),

      clearWatchlist: () => set({ watchlist: [] }),
    }),
    { name: "cinematch-watchlist" }
  )
);
