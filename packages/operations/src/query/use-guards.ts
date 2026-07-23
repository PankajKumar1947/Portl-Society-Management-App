import { useQuery } from "@tanstack/react-query";
import { getGuards, getGuardDetails, guardQueries } from "@repo/api-client";
import { GuardListResponse, GuardDetailResponse, GuardData } from "@repo/schema";

export const useGetGuards = (query?: { type?: string; search?: string }) => {
  return useQuery({
    queryKey: [...guardQueries.getGuards.key, query],
    queryFn: () => getGuards(query),
    select: (response: GuardListResponse): GuardData[] => response.data,
  });
};

export const useGetGuardDetail = (guardId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: guardQueries.getGuardDetail(guardId).key,
    queryFn: () => getGuardDetails(guardId),
    select: (response: GuardDetailResponse): GuardData => response.data,
    enabled: options?.enabled ?? !!guardId,
  });
};
