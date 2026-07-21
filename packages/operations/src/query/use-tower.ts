import { useQuery } from "@tanstack/react-query";
import { getTowers, getTowerDetails, towerQueries } from "@repo/api-client";

export const useGetTowers = (societyId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: towerQueries.list(societyId).key,
    queryFn: () => getTowers(societyId),
    enabled: !!societyId && options?.enabled,
  });
};

export const useGetTowerDetails = (towerId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: towerQueries.details(towerId).key,
    queryFn: () => getTowerDetails(towerId),
    enabled: !!towerId && options?.enabled,
  });
};
