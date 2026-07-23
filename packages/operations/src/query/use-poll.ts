import { useQuery } from "@tanstack/react-query";
import { getPolls, getPollDetails, getPollResults, pollQueries } from "@repo/api-client";
import { PollListResponse, PollResponse, PollData } from "@repo/schema";

export const useGetPolls = (params?: { search?: string; status?: string; recipient?: string }) => {
  return useQuery({
    queryKey: [...pollQueries.getPolls.key, params],
    queryFn: () => getPolls(params),
    select: (response: PollListResponse): PollData[] => response.data,
  });
};

export const useGetPollDetail = (pollId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: pollQueries.getPollDetail(pollId).key,
    queryFn: () => getPollDetails(pollId),
    select: (response: PollResponse): PollData => response.data,
    enabled: options?.enabled ?? !!pollId,
  });
};

export const useGetPollResults = (pollId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: pollQueries.getResults(pollId).key,
    queryFn: () => getPollResults(pollId),
    enabled: options?.enabled ?? !!pollId,
  });
};
