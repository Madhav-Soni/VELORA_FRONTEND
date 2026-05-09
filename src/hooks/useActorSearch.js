import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/backend";

export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export default function useActorSearch() {
  const [query, setQuery] = useState("");

  const searchActors = async () => {
    if (!query) return [];

    const res = await api.get(
      `/tmdb/search/person?query=${encodeURIComponent(query)}`
    );

    return res.data.results
      .filter((p) => p.known_for_department === "Acting")
      .slice(0, 8);
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["actors", query],
    queryFn: searchActors,
    enabled: !!query,
  });

  return {
    actors: data,
    isLoading,
    setQuery,
  };
}

export function usePopularActors() {
  return useQuery({
    queryKey: ["popular_actors"],
    queryFn: async () => {
      const res = await api.get(`/tmdb/person/popular`);
      return res.data.results
        .filter((p) => p.known_for_department === "Acting")
        .slice(0, 8);
    },
  });
}