export const notificationQueries = {
  registerToken: {
    key: ["register-fcm-token"],
    endpoint: "/notifications/register-token",
  },
  getNotifications: {
    key: ["get-notifications"],
    endpoint: "/notifications",
  },
  getUnreadCount: {
    key: ["get-unread-count"],
    endpoint: "/notifications/unread-count",
  },
  markAsRead: (id: string) => ({
    key: ["mark-notification-read", id],
    endpoint: `/notifications/${id}/read`,
  }),
  markAllAsRead: {
    key: ["mark-all-notifications-read"],
    endpoint: "/notifications/mark-all-read",
  },
} as const;
