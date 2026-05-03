import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MovieModal from "../MovieModal";

export default function AppLayout() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        <Topbar onMovieSelect={setSelectedMovieId} />
        <main className="flex-1 pt-[64px] overflow-x-hidden">
          <Outlet context={{ onMovieSelect: setSelectedMovieId }} />
        </main>
      </div>
      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </div>
  );
}
