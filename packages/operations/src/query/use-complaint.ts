import { useQuery } from "@tanstack/react-query";
import { getComplaints, getComplaintDetail, complaintQueries } from "@repo/api-client";
import { ComplaintData, ComplaintFilterOptions } from "@repo/schema";

export const useGetComplaints = (params?: ComplaintFilterOptions) => {
  return useQuery<ComplaintData[]>({
    queryKey: [...complaintQueries.list.key, params],
    queryFn: () => getComplaints(params),
  });
};

export const useGetComplaintDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<ComplaintData>({
    queryKey: complaintQueries.detail(id).key,
    queryFn: () => getComplaintDetail(id),
    enabled: options?.enabled ?? !!id,
  });
};
