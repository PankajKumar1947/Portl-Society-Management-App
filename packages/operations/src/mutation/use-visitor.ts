import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisitor, updateVisitorStatus, verifyPassCode, visitorQueries } from "@repo/api-client";
import { CreateVisitorBody } from "@repo/schema";

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

export const useUpdateVisitorStatus = (visitorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: visitorQueries.updateStatus(visitorId).key,
    mutationFn: (status: 'approved' | 'rejected' | 'completed') =>
      updateVisitorStatus(visitorId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitorDetail(visitorId).key });
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitors.key });
    },
  });
};

export const useVerifyPassCode = (passCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: visitorQueries.verifyPassCode(passCode).key,
    mutationFn: () => verifyPassCode(passCode),
    onSuccess: (res) => {
      if (res.data?.visitorId) {
        queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitorDetail(res.data.visitorId).key });
      }
      queryClient.invalidateQueries({ queryKey: visitorQueries.getVisitors.key });
    },
  });
};
