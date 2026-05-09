import { useQuery } from "@tanstack/react-query";
import { tmdb } from "../api/tmdb";

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
    queryFn: () => genreId ? tmdb.getDiscover(genreId) : tmdb.getTopRated(),
    staleTime: 1000 * 60 * 60,
  });

export const useNowPlaying = (genreId) =>
  useQuery({
    queryKey: ["nowPlaying", genreId],
    queryFn: () => genreId ? tmdb.getDiscover(genreId) : tmdb.getNowPlaying(),
    staleTime: 1000 * 60 * 60,
  });

export const useMoviesByActor = (actorId) =>
  useQuery({
    queryKey: ["moviesByActor", actorId],
    queryFn: () => tmdb.getMoviesByActor(actorId),
    enabled: !!actorId,
    staleTime: 1000 * 60 * 60,
  });
