import { useState, useEffect } from "react";
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

  // Watch History Sync
  useEffect(() => {
    if (selectedMovieId && userId) {
      backend.addToWatchHistory(userId, selectedMovieId).catch(console.error);
    }
  }, [selectedMovieId, userId]);

  // Initial Watchlist Fetch & Hydration
  useEffect(() => {
    if (userId && watchlist.length === 0) {
      backend.getWatchlist(userId)
        .then(async (ids) => {
          if (ids && ids.length > 0) {
            console.log("Hydrating watchlist from server...");
            try {
              // Fetch full details for each ID to store in local state
              const fullMovies = await Promise.all(
                ids.map(id => tmdbExt.getMovieDetails(id))
              );
              setWatchlist(fullMovies);
            } catch (err) {
              console.error("Failed to hydrate watchlist:", err);
            }
          }
        })
        .catch(console.error);
    }
  }, [userId]); // Only on mount/login and if local is empty

  // Sync Local Watchlist TO Backend when it changes
  useEffect(() => {
    if (userId && watchlist.length > 0) {
      const movieIds = watchlist.map(m => m.id);
      backend.syncWatchlist(userId, movieIds).catch(console.error);
    }
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
