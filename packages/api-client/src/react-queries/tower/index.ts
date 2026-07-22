export const towerQueries = {
  create: {
    key: ["create-tower"],
    endpoint: "/towers",
  },
  list: {
    key: ["towers-list"],
    endpoint: '/towers',
  },
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
