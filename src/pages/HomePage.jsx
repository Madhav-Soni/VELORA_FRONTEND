import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { useTrending, usePopularActors, useTopRated, useNowPlaying, useMoviesByActor } from "../hooks/useTMDB";
import { useCineStore } from "../store/useCineStore";
import ScrollRow from "../components/ScrollRow";
import MovieCard from "../components/MovieCard";
import ActorCard from "../components/ActorCard";
import { IMAGE_BASE, BACKDROP_BASE } from "../api/tmdb";

const BACKDROP_PLACEHOLDER = "https://via.placeholder.com/1280x720/111/333?text=CineMatch";

function HeroBanner({ movie, onSelect }) {
  if (!movie) return null;
  const bg = movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : BACKDROP_PLACEHOLDER;
  return (
    <div className="relative w-full h-[62vh] min-h-[380px] overflow-hidden">
      <img src={bg} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.src = BACKDROP_PLACEHOLDER; }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/25" />
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-14 pt-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="max-w-md">
          <p className="text-[#E50914] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">✦ Featured Now</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 mb-3">
            {movie.vote_average && <span className="text-[#F5C518] text-sm font-bold">★ {movie.vote_average.toFixed(1)}</span>}
            {movie.release_date && <span className="text-[#555] text-sm">{new Date(movie.release_date).getFullYear()}</span>}
          </div>
          <p className="text-[#aaa] text-sm leading-relaxed line-clamp-2 mb-5">{movie.overview}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onSelect?.(movie.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActorMovieSection({ actor, onSelect }) {
  const { data, isLoading, isError } = useMoviesByActor(actor?.id);
  if (!actor) return null;
  const movies = data?.cast?.slice(0, 10) ?? [];
  return (
    <ScrollRow title={`Because You Like ${actor.name}`} accent="gold" loading={isLoading} error={isError}>
      {movies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} onSelect={onSelect} />)}
    </ScrollRow>
  );
}

export default function HomePage() {
  const { onMovieSelect } = useOutletContext() ?? {};
  const { selectedActors } = useCineStore();

  const trending = useTrending();
  const popular = usePopularActors();
  const topRated = useTopRated();
  const nowPlaying = useNowPlaying();

  const heroMovie = trending.data?.results?.[0];

  return (
    <div className="pb-12">
      {/* Hero */}
      {trending.isLoading ? (
        <div className="w-full h-[62vh] bg-[#0e0e0e] animate-pulse" />
      ) : (
        <HeroBanner movie={heroMovie} onSelect={onMovieSelect} />
      )}

      {/* Sections */}
      <div className="mt-8 space-y-2">
        {/* Trending */}
        <ScrollRow title="Trending Now" accent="red" loading={trending.isLoading} error={trending.isError}>
          {trending.data?.results?.slice(1, 11).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>

        {/* Now Playing */}
        <ScrollRow title="In Theatres" accent="red" loading={nowPlaying.isLoading} error={nowPlaying.isError}>
          {nowPlaying.data?.results?.slice(0, 10).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>

        {/* Top Rated */}
        <ScrollRow title="Top Rated All Time" accent="gold" loading={topRated.isLoading} error={topRated.isError}>
          {topRated.data?.results?.slice(0, 10).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} onSelect={onMovieSelect} />
          ))}
        </ScrollRow>

        {/* Actor sections for each selected actor */}
        {selectedActors.slice(0, 3).map((actor) => (
          <ActorMovieSection key={actor.id} actor={actor} onSelect={onMovieSelect} />
        ))}

        {/* Popular Actors */}
        <ScrollRow title="Actors You May Like" accent="gold" loading={popular.isLoading} error={popular.isError}>
          {popular.data?.results?.slice(0, 10).map((a, i) => (
            <ActorCard key={a.id} actor={a} index={i} />
          ))}
        </ScrollRow>
      </div>
    </div>
  );
}