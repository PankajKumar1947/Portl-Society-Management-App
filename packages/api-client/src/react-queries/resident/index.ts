export const residentQueries = {
  create: {
    key: ["create-resident"],
    endpoint: "/residents",
  },
  list: (societyId: string) => ({
    key: ["residents-list", societyId],
    endpoint: `/residents`,
  }),
  details: (residentId: string) => ({
    key: ["resident-details", residentId],
    endpoint: `/residents/${residentId}`,
  }),
  update: (residentId: string) => ({
    key: ["update-resident", residentId],
    endpoint: `/residents/${residentId}`,
  }),
  delete: (residentId: string) => ({
    key: ["delete-resident", residentId],
    endpoint: `/residents/${residentId}`,
  }),
} as const;

