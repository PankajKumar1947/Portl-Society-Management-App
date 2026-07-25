import type { NotificationListResponse, NotificationResponse, RegisterFcmTokenBody } from "@repo/schema";
import { notificationQueries } from "../../react-queries/notification";
import { apiClient } from "../../services/axios-instance";

export const registerFcmToken = async (data: RegisterFcmTokenBody) => {
  const res = await apiClient.post(notificationQueries.registerToken.endpoint, data);
  return res.data;
};

export const getNotifications = async (params?: { limit?: number; skip?: number }): Promise<NotificationListResponse> => {
  const res = await apiClient.get(notificationQueries.getNotifications.endpoint, { params });
  return res.data;
};

export const getUnreadCount = async (): Promise<{ success: boolean; data: { count: number } }> => {
  const res = await apiClient.get(notificationQueries.getUnreadCount.endpoint);
  return res.data;
};

export const markAsRead = async (id: string): Promise<NotificationResponse> => {
  const res = await apiClient.patch(notificationQueries.markAsRead(id).endpoint);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await apiClient.post(notificationQueries.markAllAsRead.endpoint);
  return res.data;
};
