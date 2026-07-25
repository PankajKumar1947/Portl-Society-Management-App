export const visitorQueries = {
  getVisitors: {
    key: ["get-visitors"],
    endpoint: "/visitors",
  },
  getVisitorDetail: (visitorId: string) => ({
    key: ["get-visitor-detail", visitorId],
    endpoint: `/visitors/${visitorId}`,
  }),
  create: {
    key: ["create-visitor"],
    endpoint: "/visitors",
  },
  updateStatus: (visitorId: string) => ({
    key: ["update-visitor-status", visitorId],
    endpoint: `/visitors/${visitorId}/status`,
  }),
  verifyPassCode: (passCode: string) => ({
    key: ["verify-pass-code", passCode],
    endpoint: `/visitors/verify/${passCode}`,
  }),
} as const;
