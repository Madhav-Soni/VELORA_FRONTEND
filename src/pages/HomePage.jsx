import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { useTrending, usePopularActors, useTopRated, useNowPlaying, useMoviesByActor } from "../hooks/useTMDB";
import { useRecommendations } from "../hooks/useBackend";
import { useCineStore } from "../store/useCineStore";
import { useWatchlistStore } from "../store/useWatchlistStore";
import ScrollRow from "../components/ScrollRow";
import MovieCard from "../components/MovieCard";
import ActorCard from "../components/ActorCard";
import { BACKDROP_BASE } from "../api/tmdb";

const BACKDROP_PLACEHOLDER = "https://via.placeholder.com/1280x720/080808/080808";

function HeroBanner({ movie, onSelect }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  if (!movie) return null;
  
  const inWatchlist = isInWatchlist(movie.id);
  const bg = movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : BACKDROP_PLACEHOLDER;
  
  return (
    <div className="relative w-full h-[70vh] min-h-[450px] overflow-hidden">
      <motion.img 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={bg} 
        className="absolute inset-0 w-full h-full object-cover" 
        onError={(e) => { e.target.src = BACKDROP_PLACEHOLDER; }} 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/20" />
      
      <div className="absolute bottom-0 left-0 right-0 px-8 sm:px-12 pb-20 pt-6">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }} 
          className="max-w-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-brand" />
            <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Featured Selection</p>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-[0.9] font-display tracking-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-gold font-black text-sm">
              <span>★</span> {movie.vote_average?.toFixed(1)}
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/40 text-sm font-bold">{new Date(movie.release_date).getFullYear()}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">4K Ultra HD</span>
          </div>
          
          <p className="text-white/50 text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-lg">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect?.(movie.id)}
              className="flex items-center gap-3 px-8 py-4 bg-white/90 text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Watch Now
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
              className={`flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-2 transition-all duration-300 ${
                inWatchlist 
                  ? "bg-brand/10 border-brand text-brand" 
                  : "bg-white/5 border-white/10 text-white hover:border-white/30"
              }`}
            >
              <svg viewBox="0 0 24 24" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {inWatchlist ? "In My List" : "My List"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActorMovieSection({ actor, onSelect }) {
  const { data, isLoading, isError } = useMoviesByActor(actor?.id);
  if (!actor) return null;
  const movies = data?.cast?.slice(0, 12) ?? [];
  return (
    <ScrollRow title={`Because You Like ${actor.name}`} accent="gold" loading={isLoading} error={isError}>
      {movies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} onSelect={onSelect} />)}
    </ScrollRow>
  );
}

export default function HomePage() {
  const { onMovieSelect } = useOutletContext() ?? {};
  const { selectedActors, userId } = useCineStore();

  const recommendations = useRecommendations(userId);
  const trending = useTrending();
  const popular = usePopularActors();
  const topRated = useTopRated();
  const nowPlaying = useNowPlaying();

  const heroMovie = userId && recommendations.data?.length > 0 
    ? recommendations.data[0] 
    : trending.data?.results?.[0];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      {trending.isLoading || recommendations.isLoading ? (
        <div className="w-full h-[70vh] skeleton" />
      ) : (
        <HeroBanner movie={heroMovie} onSelect={onMovieSelect} />
      )}

      {/* Rows */}
      <div className="mt-4 space-y-4">
        {/* 1. Recommended For You */}
        {userId && recommendations.data?.length > 0 && (
          <ScrollRow 
            title="Recommended For You" 
            accent="brand" 
            loading={recommendations.isLoading} 
            error={recommendations.isError}
            onSeeAll={() => {}}
          >
            {recommendations.data.slice(1, 13).map((m, i) => (
              <MovieCard key={m._id || m.id} movie={m} index={i} onSelect={onMovieSelect} />
            ))}
          </ScrollRow>
        )}

        {/* 2. Based on Favorite Actors */}
        {selectedActors.slice(0, 3).map((actor) => (
          <ActorMovieSection key={actor.id} actor={actor} onSelect={onMovieSelect} />
        ))}

        {/* 3. Trending Now */}
        <ScrollRow 
          title="Trending Now" 
          accent="red" 
          loading={trending.isLoading} 
          error={trending.isError}
          onSeeAll={() => {}}
        >
          {trending.data?.results?.slice(1, 13).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>

        {/* 4. Top Rated */}
        <ScrollRow 
          title="Top Rated" 
          accent="gold" 
          loading={topRated.isLoading} 
          error={topRated.isError}
        >
          {topRated.data?.results?.slice(0, 12).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>

        {/* 5. Continue Watching (Placeholder for now) */}
        <ScrollRow 
          title="Continue Watching" 
          accent="brand" 
          loading={nowPlaying.isLoading} 
          error={nowPlaying.isError}
        >
          {nowPlaying.data?.results?.slice(0, 5).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>


      </div>
    </div>
  );
}