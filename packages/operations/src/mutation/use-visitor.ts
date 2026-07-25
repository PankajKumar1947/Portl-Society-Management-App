import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisitor, updateVisitorStatus, scanPassCode, visitorQueries } from "@repo/api-client";
import { CreateVisitorBody, UpdatableVisitorStatus, ScanDirection } from "@repo/schema";

export const useCreateVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: visitorQueries.create.key,
    mutationFn: (data: CreateVisitorBody) => createVisitor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitors.key });
    },
  });
};

export const useUpdateVisitorStatus = (logId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: visitorQueries.updateStatus(logId).key,
    mutationFn: (status: UpdatableVisitorStatus) =>
      updateVisitorStatus(logId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitorDetail(logId).key });
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitors.key });
    },
  });
};

export const useScanPassCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { passCode: string; type: ScanDirection }) => scanPassCode(params),
    onSuccess: (res) => {
      if (res.data?.logId) {
        queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitorDetail(res.data.logId).key });
      }
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitors.key });
    },
  });
};
