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
