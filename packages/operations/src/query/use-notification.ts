import { useQuery } from "@tanstack/react-query";
import { getNotifications, getUnreadCount, notificationQueries } from "@repo/api-client";
import type { NotificationData } from "@repo/schema";

export const useGetNotifications = (params?: { limit?: number; skip?: number }) => {
  return useQuery({
    queryKey: [...notificationQueries.getNotifications.key, params],
    queryFn: () => getNotifications(params),
    select: (response): NotificationData[] => response.data,
  });
};

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: notificationQueries.getUnreadCount.key,
    queryFn: getUnreadCount,
    select: (response): number => response.data.count,
  });
};
