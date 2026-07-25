export const visitorQueries = {
  getVisitors: {
    key: ["get-visitors"],
    endpoint: "/visitors",
  },
  getVisitorDetail: (logId: string) => ({
    key: ["get-visitor-detail", logId],
    endpoint: `/visitors/${logId}`,
  }),
  getVisitorVisits: (logId: string) => ({
    key: ["get-visitor-visits", logId],
    endpoint: `/visitors/${logId}/visits`,
  }),
  getVisitorLogs: {
    key: ["get-visitor-logs"],
    endpoint: "/visitor-logs",
  },
  create: {
    key: ["create-visitor"],
    endpoint: "/visitors",
  },
  updateStatus: (logId: string) => ({
    key: ["update-visitor-status", logId],
    endpoint: `/visitors/${logId}/status`,
  }),
  scanPassCode: (passCode: string) => ({
    key: ["scan-pass-code", passCode],
    endpoint: `/visitors/scan/${passCode}`,
  }),
  requestEntry: {
    key: ["request-entry"],
    endpoint: "/visitors/request-entry",
  },
} as const;
