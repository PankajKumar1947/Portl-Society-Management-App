import z from "zod";
import {
  notificationSchema,
  createNotificationSchema,
  registerFcmTokenSchema,
  notificationTypeSchema,
} from "./notification.schema";
import { ApiResponse } from "../shared/api.type";

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationData = z.infer<typeof notificationSchema>;
export type CreateNotificationBody = z.infer<typeof createNotificationSchema>;
export type RegisterFcmTokenBody = z.infer<typeof registerFcmTokenSchema>;
export type NotificationResponse = ApiResponse<NotificationData>;
export type NotificationListResponse = ApiResponse<NotificationData[]>;
