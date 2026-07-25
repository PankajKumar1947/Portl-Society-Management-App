import z from "zod";

export const NOTIFICATION_TYPES = ["visitor_request", "visitor_approved", "visitor_rejected", "general"] as const;
export const NOTIFICATION_TYPE = {
  VISITOR_REQUEST: "visitor_request",
  VISITOR_APPROVED: "visitor_approved",
  VISITOR_REJECTED: "visitor_rejected",
  GENERAL: "general",
} as const;
export const notificationTypeSchema = z.enum(NOTIFICATION_TYPES);

export const notificationSchema = z.object({
  notificationId: z.string().min(1),
  userId: z.string().min(1),
  type: notificationTypeSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
  read: z.boolean().default(false),
  createdAt: z.string().optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  type: notificationTypeSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const registerFcmTokenSchema = z.object({
  token: z.string().min(1),
});
