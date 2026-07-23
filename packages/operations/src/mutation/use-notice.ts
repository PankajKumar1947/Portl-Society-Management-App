import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotice, updateNotice, deleteNotice, publishNotice, noticeQueries } from "@repo/api-client";
import { CreateNoticeBody, UpdateNoticeBody } from "@repo/schema";

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: noticeQueries.create.key,
    mutationFn: (data: CreateNoticeBody) => createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNotices.key });
    },
  });
};

export const useUpdateNotice = (noticeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: noticeQueries.update(noticeId).key,
    mutationFn: (data: UpdateNoticeBody) => updateNotice(noticeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNoticeDetail(noticeId).key });
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNotices.key });
    },
  });
};

export const useDeleteNotice = (noticeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: noticeQueries.delete(noticeId).key,
    mutationFn: () => deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNotices.key });
    },
  });
};

export const usePublishNotice = (noticeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: noticeQueries.publish(noticeId).key,
    mutationFn: () => publishNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNoticeDetail(noticeId).key });
      queryClient.invalidateQueries({ queryKey: noticeQueries.getNotices.key });
    },
  });
};
