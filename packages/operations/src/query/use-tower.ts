import { useQuery } from "@tanstack/react-query";
import { getTowers, getTowerDetails, towerQueries } from "@repo/api-client";

export const useGetTowers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: towerQueries.list.key,
    queryFn: () => getTowers(),
    enabled: options?.enabled ?? true,
  });
};

export const useGetTowerDetails = (towerId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: towerQueries.details(towerId).key,
    queryFn: () => getTowerDetails(towerId),
    enabled: !!towerId && options?.enabled,
  });
};
