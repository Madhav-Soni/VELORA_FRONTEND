import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MovieModal from "../MovieModal";
import { useCineStore } from "../../store/useCineStore";
import { backend } from "../../api/backend";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import { tmdbExt } from "../../api/tmdb";

export default function AppLayout() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { userId } = useCineStore();
  const { watchlist, setWatchlist } = useWatchlistStore();

  // Track whether we've already hydrated so we don't re-fetch on every render
  const hydratedRef = useRef(false);

  // ── 1. Watch History Sync (fire-and-forget) ───────────────────────────────
  useEffect(() => {
    if (selectedMovieId && userId) {
      backend.addToWatchHistory(userId, selectedMovieId).catch(console.error);
    }
  }, [selectedMovieId, userId]);

  // ── 2. Hydrate watchlist FROM backend once on login ───────────────────────
  useEffect(() => {
    if (!userId || hydratedRef.current) return;
    hydratedRef.current = true;

    backend
      .getWatchlist(userId)
      .then(async (ids) => {
        if (!ids || ids.length === 0) return;
        // ids is an array of TMDB movie IDs stored in the DB
        const fullMovies = await Promise.all(
          ids.map((id) => tmdbExt.getMovieDetails(id))
        );
        setWatchlist(fullMovies.filter(Boolean));
      })
      .catch(console.error);
  }, [userId]); // only re-run if userId changes (login/logout)

  // ── 3. Sync local watchlist TO backend whenever it changes ────────────────
  //    Use a ref to skip the very first render (hydration) to avoid a
  //    redundant sync right after we just fetched from the server.
  const isFirstSync = useRef(true);
  useEffect(() => {
    if (!userId) return;
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    const movieIds = watchlist.map((m) => m.id);
    backend.syncWatchlist(userId, movieIds).catch(console.error);
  }, [watchlist, userId]);

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <Sidebar />
      <div className="flex-1 md:ml-[210px] flex flex-col min-h-screen relative">
        <Topbar onMovieSelect={setSelectedMovieId} />
        <main className="flex-1 pt-[72px] overflow-x-hidden">
          <div className="relative z-0">
            <Outlet context={{ onMovieSelect: setSelectedMovieId }} />
          </div>
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
