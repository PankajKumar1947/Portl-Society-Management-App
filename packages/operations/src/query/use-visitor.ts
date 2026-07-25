import { useQuery } from "@tanstack/react-query";
import { getVisitors, getVisitorDetails, visitorQueries } from "@repo/api-client";
import { VisitorListResponse, VisitorResponse, VisitorData } from "@repo/schema";

export const useGetVisitors = (query?: { status?: string; type?: string }) => {
  return useQuery({
    queryKey: [...visitorQueries.getVisitors.key, query],
    queryFn: () => getVisitors(query),
    select: (response: VisitorListResponse): VisitorData[] => response.data,
  });
};

export const useGetVisitorDetail = (visitorId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: visitorQueries.getVisitorDetail(visitorId).key,
    queryFn: () => getVisitorDetails(visitorId),
    select: (response: VisitorResponse): VisitorData => response.data,
    enabled: options?.enabled ?? !!visitorId,
  });
};
