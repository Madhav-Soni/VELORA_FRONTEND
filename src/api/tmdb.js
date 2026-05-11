import { BACKEND_URL, api } from "./backend";

const BASE_URL = `${BACKEND_URL}/tmdb`;

export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export const fetcher = async (endpoint) => {
  const res = await api.get(`/tmdb${endpoint}`);
  return res.data;
};

// Extended endpoints for full app
export const tmdbExt = {
  getMovieDetails: (id) => fetcher(`/movie/${id}?append_to_response=credits,watch/providers,videos`),
  getMovieMinimal: (id) => fetcher(`/movie/${id}`),
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
  getDiscover: (genreId) => fetcher(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`),
};