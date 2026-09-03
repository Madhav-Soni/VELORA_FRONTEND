import { useQuery } from "@tanstack/react-query";
import { tmdb, fetcher } from "../api/tmdb";

export const useTrending = (genreId) =>
  useQuery({
    queryKey: ["trending", genreId],
    queryFn: () => genreId ? tmdb.getDiscover(genreId) : tmdb.getTrending(),
    staleTime: 1000 * 60 * 60,
  });

export const usePopularActors = () =>
  useQuery({
    queryKey: ["popularActors"],
    queryFn: tmdb.getPopularActors,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useTopRated = (genreId) =>
  useQuery({
    queryKey: ["topRated", genreId],
    queryFn: () =>
      genreId
        ? fetcher(`/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=200`)
        : tmdb.getTopRated(),
    staleTime: 1000 * 60 * 60,
  });

export const useNowPlaying = (genreId) => {
  const today = new Date().toISOString().split("T")[0];
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  return useQuery({
    queryKey: ["nowPlaying", genreId],
    queryFn: () =>
      genreId
        ? fetcher(`/discover/movie?with_genres=${genreId}&primary_release_date.gte=${fortyFiveDaysAgo}&primary_release_date.lte=${today}`)
        : tmdb.getNowPlaying(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useMoviesByActor = (actorId) =>
  useQuery({
    queryKey: ["moviesByActor", actorId],
    queryFn: () => tmdb.getMoviesByActor(actorId),
    enabled: !!actorId,
    staleTime: 1000 * 60 * 60,
  });
