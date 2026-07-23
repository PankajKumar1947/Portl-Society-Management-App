export const noticeQueries = {
  getNotices: {
    key: ["get-notices"],
    endpoint: "/notices",
  },
  getNoticeDetail: (noticeId: string) => ({
    key: ["get-notice-detail", noticeId],
    endpoint: `/notices/${noticeId}`,
  }),
  create: {
    key: ["create-notice"],
    endpoint: "/notices",
  },
  update: (noticeId: string) => ({
    key: ["update-notice", noticeId],
    endpoint: `/notices/${noticeId}`,
  }),
  delete: (noticeId: string) => ({
    key: ["delete-notice", noticeId],
    endpoint: `/notices/${noticeId}`,
  }),
  publish: (noticeId: string) => ({
    key: ["publish-notice", noticeId],
    endpoint: `/notices/${noticeId}/publish`,
  }),
} as const;
