import { useQuery } from "@tanstack/react-query";
import {
  getHelpdeskTickets,
  getHelpdeskTicketDetail,
  helpdeskTicketQueries,
} from "@repo/api-client";
import { HelpdeskTicketData, HelpdeskTicketFilterOptions } from "@repo/schema";

export const useGetHelpdeskTickets = (params?: HelpdeskTicketFilterOptions) => {
  return useQuery<HelpdeskTicketData[]>({
    queryKey: [...helpdeskTicketQueries.list.key, params],
    queryFn: () => getHelpdeskTickets(params),
  });
};

export const useGetHelpdeskTicketDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<HelpdeskTicketData>({
    queryKey: helpdeskTicketQueries.detail(id).key,
    queryFn: () => getHelpdeskTicketDetail(id),
    enabled: options?.enabled ?? !!id,
  });
};
