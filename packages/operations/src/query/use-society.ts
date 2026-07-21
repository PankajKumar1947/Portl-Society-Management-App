import { useQuery } from "@tanstack/react-query";
import { getMySociety, getSocietyDetails, societyQueries } from "@repo/api-client";

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
