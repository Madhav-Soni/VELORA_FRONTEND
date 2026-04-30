import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export default function useActorSearch() {
  const [query, setQuery] = useState("");

  const searchActors = async () => {
    if (!query) return [];

    const res = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    return data.results
      .filter((p) => p.known_for_department === "Acting")
      .slice(0, 8);
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["actors", query],
    queryFn: searchActors,
    enabled: !!query, // 🔥 ONLY run when user types
  });

  return {
    actors: data,
    isLoading,
    setQuery, // 🔥 THIS is how UI triggers search
  };
}

export function usePopularActors() {
  return useQuery({
    queryKey: ["popular_actors"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}`);
      if (!res.ok) throw new Error("Failed to fetch popular actors");
      const data = await res.json();
      return data.results
        .filter((p) => p.known_for_department === "Acting")
        .slice(0, 8);
    },
  });
}