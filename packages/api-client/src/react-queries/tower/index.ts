export const towerQueries = {
  create: {
    key: ["create-tower"],
    endpoint: "/towers",
  },
  list: (societyId: string) => ({
    key: ["towers-list", societyId],
    endpoint: `/towers?societyId=${societyId}`,
  }),
  details: (towerId: string) => ({
    key: ["tower-details", towerId],
    endpoint: `/towers/${towerId}`,
  }),
  update: (towerId: string) => ({
    key: ["update-tower", towerId],
    endpoint: `/towers/${towerId}`,
  }),
  delete: (towerId: string) => ({
    key: ["delete-tower", towerId],
    endpoint: `/towers/${towerId}`,
  }),
} as const;
