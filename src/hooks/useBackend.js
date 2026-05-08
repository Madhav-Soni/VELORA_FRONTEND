import { useQuery } from "@tanstack/react-query";
import { backend } from "../api/backend";

export const useRecommendations = (userId) =>
  useQuery({
    queryKey: ["recommendations", userId],
    queryFn: () => backend.getRecommendations(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
