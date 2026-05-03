import { useQuery } from "@tanstack/react-query";
import { tmdb } from "../api/tmdb";

export const useTrending = () =>
  useQuery({
    queryKey: ["trending"],
    queryFn: tmdb.getTrending,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const usePopularActors = () =>
  useQuery({
    queryKey: ["popularActors"],
    queryFn: tmdb.getPopularActors,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

export const useTopRated = () =>
  useQuery({
    queryKey: ["topRated"],
    queryFn: tmdb.getTopRated,
    staleTime: 1000 * 60 * 60,
  });

export const useNowPlaying = () =>
  useQuery({
    queryKey: ["nowPlaying"],
    queryFn: tmdb.getNowPlaying,
    staleTime: 1000 * 60 * 60,
  });

export const useMoviesByActor = (actorId) =>
  useQuery({
    queryKey: ["moviesByActor", actorId],
    queryFn: () => tmdb.getMoviesByActor(actorId),
    enabled: !!actorId,
    staleTime: 1000 * 60 * 60,
  });
