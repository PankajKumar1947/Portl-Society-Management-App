import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerFcmToken, markAsRead, markAllAsRead, notificationQueries } from "@repo/api-client";
import type { RegisterFcmTokenBody } from "@repo/schema";

export const useRegisterFcmToken = () => {
  return useMutation({
    mutationKey: notificationQueries.registerToken.key,
    mutationFn: (data: RegisterFcmTokenBody) => registerFcmToken(data),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueries.getNotifications.key });
      queryClient.invalidateQueries({ queryKey: notificationQueries.getUnreadCount.key });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: notificationQueries.markAllAsRead.key,
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueries.getNotifications.key });
      queryClient.invalidateQueries({ queryKey: notificationQueries.getUnreadCount.key });
    },
  });
};
