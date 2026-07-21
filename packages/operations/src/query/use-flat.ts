import { useQuery } from "@tanstack/react-query";
import { getFlats, getFlatDetails, flatQueries } from "@repo/api-client";

export const useGetFlats = (towerId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: flatQueries.list(towerId).key,
    queryFn: () => getFlats(towerId),
    enabled: !!towerId && options?.enabled,
  });
};

export const useGetFlatDetails = (flatId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: flatQueries.details(flatId).key,
    queryFn: () => getFlatDetails(flatId),
    enabled: !!flatId && options?.enabled,
  });
};
