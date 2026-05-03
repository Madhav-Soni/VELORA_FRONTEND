const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

export const fetcher = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
};

// Extended endpoints for full app
export const tmdbExt = {
  getMovieDetails: (id) => fetcher(`/movie/${id}?append_to_response=credits,watch/providers,videos`),
  getActorDetails: (id) => fetcher(`/person/${id}?append_to_response=movie_credits`),
  searchMulti: (query) => fetcher(`/search/multi?query=${encodeURIComponent(query)}`),
  getRecommended: (id) => fetcher(`/movie/${id}/recommendations`),
  getSimilar: (id) => fetcher(`/movie/${id}/similar`),
  getGenres: () => fetcher(`/genre/movie/list`),
};

// Base endpoints
export const tmdb = {
  getTrending: () => fetcher("/trending/movie/week"),
  getPopularActors: () => fetcher("/person/popular"),
  getTopRated: () => fetcher("/movie/top_rated"),
  getNowPlaying: () => fetcher("/movie/now_playing"),
  getMoviesByActor: (id) => fetcher(`/person/${id}/movie_credits`),
};
