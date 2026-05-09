import { useQuery, useQueries } from "@tanstack/react-query";
import { tmdbExt } from "../api/tmdb";

export const useMovieDetails = (id) =>
  useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => tmdbExt.getMovieDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });

export const useWatchlistMinimal = (movies) =>
  useQueries({
    queries: (movies || []).map((m) => ({
      queryKey: ["movieMinimal", m.id],
      queryFn: () => tmdbExt.getMovieMinimal(m.id),
      staleTime: 1000 * 60 * 60,
    })),
  });

export const useSearchMulti = (query) =>
  useQuery({
    queryKey: ["searchMulti", query],
    queryFn: () => tmdbExt.searchMulti(query),
    enabled: query?.trim().length > 1,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

export const useRecommended = (id) =>
  useQuery({
    queryKey: ["recommended", id],
    queryFn: () => tmdbExt.getRecommended(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

export const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: tmdbExt.getGenres,
    staleTime: Infinity,
  });
