import { useQuery } from "@tanstack/react-query";
import { getMySociety, getSocietyDetails, getSocietyStats, societyQueries } from "@repo/api-client";
import type { SocietyStats } from "@repo/schema";

export const useGetMySociety = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: societyQueries.me.key,
    queryFn: () => getMySociety(),
    enabled: options?.enabled,
  });
};

export const useGetSocietyDetails = (
  societyId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: societyQueries.details(societyId).key,
    queryFn: () => getSocietyDetails(societyId),
    enabled: !!societyId && options?.enabled,
  });
};

export const useGetSocietyStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: societyQueries.stats.key,
    queryFn: getSocietyStats,
    select: (data: SocietyStats) => data,
    enabled: options?.enabled ?? true,
  });
};
