import { useQuery } from "@tanstack/react-query";
import { getVisitors, getVisitorDetails, getVisitorVisits, getVisitorLogs, visitorQueries } from "@repo/api-client";
import { VisitorListResponse, VisitorResponse, VisitorLogData } from "@repo/schema";

export const useGetVisitors = (query?: { status?: string; type?: string }) => {
  return useQuery({
    queryKey: [...visitorQueries.getVisitors.key, query],
    queryFn: () => getVisitors(query),
    select: (response: VisitorListResponse): VisitorLogData[] => response.data,
  });
};

export const useGetVisitorDetail = (logId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: visitorQueries.getVisitorDetail(logId).key,
    queryFn: () => getVisitorDetails(logId),
    select: (response: VisitorResponse): VisitorLogData => response.data,
    enabled: options?.enabled ?? !!logId,
  });
};

export const useGetVisitorVisits = (logId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: visitorQueries.getVisitorVisits(logId).key,
    queryFn: () => getVisitorVisits(logId),
    select: (response: VisitorListResponse): VisitorLogData[] => response.data,
    enabled: options?.enabled ?? !!logId,
  });
};

export const useGetVisitorLogs = () => {
  return useQuery({
    queryKey: visitorQueries.getVisitorLogs.key,
    queryFn: () => getVisitorLogs(),
    select: (response: VisitorListResponse): VisitorLogData[] => response.data,
  });
};
