export const guardQueries = {
  onboardPersonal: {
    key: ["onboard-guard-personal"],
    endpoint: "/guards/onboard/personal",
  },
  onboardDuty: {
    key: ["onboard-guard-duty"],
    endpoint: "/guards/onboard/duty",
  },
  getGuards: {
    key: ["get-guards"],
    endpoint: "/guards",
  },
  getGuardDetail: (guardId: string) => ({
    key: ["get-guard-detail", guardId],
    endpoint: `/guards/${guardId}`,
  }),
  update: (guardId: string) => ({
    key: ["update-guard", guardId],
    endpoint: `/guards/${guardId}`,
  }),
  delete: (guardId: string) => ({
    key: ["delete-guard", guardId],
    endpoint: `/guards/${guardId}`,
  }),
} as const;
