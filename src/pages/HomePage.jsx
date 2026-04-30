import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w342";
const BACKDROP = "https://image.tmdb.org/t/p/w780";

const get = (path) =>
  fetch(`${BASE}${path}?api_key=${TMDB_KEY}&language=en-US`)
    .then((r) => {
      if (!r.ok) throw new Error(`TMDB ${r.status}`);
      return r.json();
    });

// ─── HOOKS ───────────────────────────────────────────────────────────────────
const useTrending    = () => useQuery({ queryKey: ["trending"],    queryFn: () => get("/trending/movie/week") });
const usePopActors   = () => useQuery({ queryKey: ["popActors"],   queryFn: () => get("/person/popular") });
const useTrendingTV  = () => useQuery({ queryKey: ["trendingTV"],  queryFn: () => get("/trending/tv/week") });
const useTopRated    = () => useQuery({ queryKey: ["topRated"],    queryFn: () => get("/movie/top_rated") });
const useActorMovies = (actorId) =>
  useQuery({
    queryKey: ["actorMovies", actorId],
    queryFn: () => get(`/person/${actorId}/movie_credits`),
    enabled: !!actorId,
  });

// ─── SKELETON CARD ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 rounded-lg overflow-hidden"
      style={{ width: 150, height: 225, background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }}
    />
  );
}

// ─── MOVIE CARD ──────────────────────────────────────────────────────────────
function MovieCard({ item }) {
  const src  = item.poster_path ? `${IMG}${item.poster_path}` : null;
  const name = item.title || item.name || "Untitled";

  return (
    <div className="movie-card flex-shrink-0 cursor-pointer group" style={{ width: 150 }}>
      <div className="relative rounded-lg overflow-hidden" style={{ height: 225 }}>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center p-3"
            style={{ background: "rgba(255,255,255,0.07)", color: "#aaa", fontSize: 12 }}>
            {name}
          </div>
        )}
        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}
        >
          <p className="text-white font-semibold truncate" style={{ fontSize: 12 }}>{name}</p>
          {item.vote_average > 0 && (
            <span style={{ fontSize: 11, color: "#f5c518" }}>★ {item.vote_average?.toFixed(1)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ACTOR CARD ──────────────────────────────────────────────────────────────
function ActorCard({ actor }) {
  const src  = actor.profile_path ? `${IMG}${actor.profile_path}` : null;
  return (
    <div className="flex-shrink-0 text-center group cursor-pointer" style={{ width: 130 }}>
      <div className="mx-auto rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{ width: 100, height: 100, border: "2px solid rgba(220,180,80,0.4)" }}>
        {src ? (
          <img src={src} alt={actor.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.07)", fontSize: 28 }}>👤</div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium truncate" style={{ color: "#e0d0b0", fontSize: 12 }}>{actor.name}</p>
      <p className="text-xs" style={{ color: "#888", fontSize: 11 }}>{actor.known_for_department}</p>
    </div>
  );
}

// ─── SCROLL ROW ──────────────────────────────────────────────────────────────
function ScrollRow({ title, children, isLoading, error }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-xl font-bold tracking-wide" style={{ color: "#f0e0c0", fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="scroll-btn" aria-label="scroll left">‹</button>
          <button onClick={() => scroll(1)}  className="scroll-btn" aria-label="scroll right">›</button>
        </div>
      </div>

      {error && (
        <p className="px-6 text-sm" style={{ color: "#e07070" }}>
          Could not load — check your TMDB API key.
        </p>
      )}

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-3 px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : children}
      </div>
    </section>
  );
}

// ─── HERO BANNER ─────────────────────────────────────────────────────────────
function Hero({ movie }) {
  if (!movie) return null;
  const bg = movie.backdrop_path ? `${BACKDROP}${movie.backdrop_path}` : null;
  return (
    <div
      className="relative w-full flex items-end"
      style={{ height: 480, background: bg ? undefined : "#111" }}
    >
      {bg && (
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0f 30%, transparent 100%)" }} />
      <div className="relative z-10 px-8 pb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#f5c518", fontFamily: "monospace" }}>
          ✦ Top Pick This Week
        </p>
        <h1 className="text-5xl font-black leading-tight mb-3"
          style={{ color: "#fff", fontFamily: "'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
          {movie.title}
        </h1>
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#ccc" }}>{movie.overview}</p>
        <div className="flex gap-3 mt-5">
          <button className="hero-btn-primary">▶ Watch Now</button>
          <button className="hero-btn-secondary">+ Watchlist</button>
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.95) 0%, transparent 100%)", backdropFilter: "blur(6px)" }}>
      <div className="flex items-center gap-2">
        <span style={{ color: "#f5c518", fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
          Cine<span style={{ color: "#fff" }}>Match</span>
        </span>
      </div>
      <div className="flex items-center gap-6 text-sm" style={{ color: "#aaa" }}>
        <a href="#" className="nav-link">Movies</a>
        <a href="#" className="nav-link">TV Shows</a>
        <a href="#" className="nav-link">My List</a>
      </div>
      <button
        onClick={() => navigate("/")}
        className="text-xs px-4 py-2 rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ccc", background: "transparent" }}
      >
        Sign Out
      </button>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { selectedActors, selectedGenres } = useUserStore();

  const trending   = useTrending();
  const popActors  = usePopActors();
  const trendingTV = useTrendingTV();
  const topRated   = useTopRated();

  // First stored actor (if any) — fetch their movies
  const firstActor     = selectedActors?.[0];
  const actorMovies    = useActorMovies(firstActor?.id);
  const actorMovieList = actorMovies.data?.cast?.slice(0, 10) ?? [];

  const heroMovie = trending.data?.results?.[0];

  return (
    <>
      {/* ── Injected styles (keeps file self-contained) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a0f; color: #e8e0d0; font-family: 'DM Sans', sans-serif; }

        .scroll-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: #ccc;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .scroll-btn:hover { background: rgba(245,197,24,0.15); color: #f5c518; border-color: rgba(245,197,24,0.4); }

        .hero-btn-primary {
          padding: 10px 28px;
          border-radius: 4px;
          background: #f5c518;
          color: #111;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .hero-btn-primary:hover { background: #ffd94a; transform: translateY(-1px); }

        .hero-btn-secondary {
          padding: 10px 24px;
          border-radius: 4px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer;
          transition: background 0.2s;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.22); }

        .nav-link {
          text-decoration: none;
          color: #aaa;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }

        /* Hide scrollbar but keep scroll */
        ::-webkit-scrollbar { display: none; }

        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
        <Navbar />

        {/* Hero */}
        <div className="pt-0">
          <Hero movie={heroMovie} />
        </div>

        {/* Content rows */}
        <div className="pt-8">

          {/* 1 — Top Picks For You */}
          <ScrollRow
            title="Top Picks For You"
            isLoading={trending.isLoading}
            error={trending.error}
          >
            {trending.data?.results?.slice(0, 10).map((m) => (
              <MovieCard key={m.id} item={m} />
            ))}
          </ScrollRow>

          {/* 2 — Actors You May Like */}
          <ScrollRow
            title="Actors You May Like"
            isLoading={popActors.isLoading}
            error={popActors.error}
          >
            {popActors.data?.results?.slice(0, 10).map((a) => (
              <ActorCard key={a.id} actor={a} />
            ))}
          </ScrollRow>

          {/* 3 — Trending Now (TV) */}
          <ScrollRow
            title="Trending Now"
            isLoading={trendingTV.isLoading}
            error={trendingTV.error}
          >
            {trendingTV.data?.results?.slice(0, 10).map((m) => (
              <MovieCard key={m.id} item={m} />
            ))}
          </ScrollRow>

          {/* 4 — Top Rated All Time */}
          <ScrollRow
            title="All-Time Classics"
            isLoading={topRated.isLoading}
            error={topRated.error}
          >
            {topRated.data?.results?.slice(0, 10).map((m) => (
              <MovieCard key={m.id} item={m} />
            ))}
          </ScrollRow>

          {/* 5 — Because You Like [Actor] (Zustand-powered) */}
          {firstActor && (
            <ScrollRow
              title={`Because You Like ${firstActor.name}`}
              isLoading={actorMovies.isLoading}
              error={actorMovies.error}
            >
              {actorMovieList.map((m) => (
                <MovieCard key={m.id} item={m} />
              ))}
            </ScrollRow>
          )}

          {/* 6 — Genre tags from Zustand (cosmetic ribbon) */}
          {selectedGenres?.length > 0 && (
            <div className="px-6 mb-10">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#888", fontFamily: "monospace" }}>
                Your genres
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((g, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(245,197,24,0.12)", color: "#f5c518", border: "1px solid rgba(245,197,24,0.25)" }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}