export const societyQueries = {
  create: {
    key: ["create-society"],
    endpoint: "/societies",
  },
  me: {
    key: ["my-society"],
    endpoint: "/societies/me",
  },
  details: (societyId: string) => ({
    key: ["society-details", societyId],
    endpoint: `/societies/${societyId}`,
  }),
  update: (societyId: string) => ({
    key: ["update-society", societyId],
    endpoint: `/societies/${societyId}`,
  }),
  stats: {
    key: ["society-stats"],
    endpoint: "/societies/stats",
  },
} as const;
