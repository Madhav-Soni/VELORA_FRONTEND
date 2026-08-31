import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MovieModal from "../MovieModal";
import { useVeloraStore } from "../../store/useVeloraStore";
import { backend } from "../../api/backend";
import { tmdbExt } from "../../api/tmdb";

export default function AppLayout() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { userId, watchlist, setWatchlist, favorites, setFavorites } = useVeloraStore();

  // Prevents double-hydration on re-renders
  const hydratedRef = useRef(false);
  // Skips the very first watchlist change (the hydration itself)
  const skipSyncRef = useRef(true);

  // Separate refs for favorites hydration and sync
  const hydratedFavoritesRef = useRef(false);
  const skipFavoritesSyncRef = useRef(true);

  // ── 1. Watch History Sync (fire-and-forget) ───────────────────────────────
  useEffect(() => {
    if (selectedMovieId && userId) {
      backend.addToWatchHistory(userId, selectedMovieId).catch(console.error);
    }
  }, [selectedMovieId, userId]);

  // ── 2. Hydrate watchlist & prefs FROM backend on login ────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    if (!userId) {
      hydratedRef.current = false;
      skipSyncRef.current = true;
      hydratedFavoritesRef.current = false;
      skipFavoritesSyncRef.current = true;
      return;
    }

    const currentUserId = userId;

    // Load Preferences
    const { syncPreferencesWithBackend } = useVeloraStore.getState();
    syncPreferencesWithBackend().catch(console.error);

    // Load Watchlist
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      backend
        .getWatchlist(currentUserId)
        .then((ids) => {
          if (isCancelled) return;
          // Store only basic objects with IDs to avoid overfetching
          const basicMovies = (ids || []).map((id) => (typeof id === "object" ? id : { id }));
          setWatchlist(basicMovies);
          // Allow outgoing sync after hydration settles
          setTimeout(() => {
            if (!isCancelled) skipSyncRef.current = false;
          }, 0);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error("Watchlist hydration failed:", err);
          skipSyncRef.current = false;
        });
    }

    // Load Favorites
    if (!hydratedFavoritesRef.current) {
      hydratedFavoritesRef.current = true;
      backend
        .getFavorites(currentUserId)
        .then((ids) => {
          if (isCancelled) return;
          const basicMovies = (ids || []).map((id) => (typeof id === "object" ? id : { id }));
          setFavorites(basicMovies);
          setTimeout(() => {
            if (!isCancelled) skipFavoritesSyncRef.current = false;
          }, 0);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error("Favorites hydration failed:", err);
          skipFavoritesSyncRef.current = false;
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  // ── 3. Sync local watchlist TO backend on change ──────────────────────────
  useEffect(() => {
    if (!userId) return;
    if (skipSyncRef.current) return;
    const movieIds = watchlist.map((m) => m.id);
    backend.syncWatchlist(userId, movieIds).catch(console.error);
  }, [watchlist, userId]);

  // ── 4. Sync local favorites TO backend on change ──────────────────────────
  useEffect(() => {
    if (!userId) return;
    if (skipFavoritesSyncRef.current) return;
    const movieIds = favorites.map((m) => m.id);
    backend.syncFavorites(userId, movieIds).catch(console.error);
  }, [favorites, userId]);

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <Sidebar />
      <div className="flex-1 md:ml-[210px] flex flex-col min-h-screen relative min-w-0 overflow-x-hidden">
        <Topbar onMovieSelect={setSelectedMovieId} />
        <main className="flex-1 pt-[72px] w-full min-w-0 overflow-x-hidden">
          <Outlet context={{ onMovieSelect: setSelectedMovieId }} />
        </main>
      </div>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
}