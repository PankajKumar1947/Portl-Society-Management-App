export const flatQueries = {
  create: {
    key: ["create-flat"],
    endpoint: "/flats",
  },
  list: (towerId: string) => ({
    key: ["flats-list", towerId],
    endpoint: `/flats?towerId=${towerId}`,
  }),
  details: (flatId: string) => ({
    key: ["flat-details", flatId],
    endpoint: `/flats/${flatId}`,
  }),
  update: (flatId: string) => ({
    key: ["update-flat", flatId],
    endpoint: `/flats/${flatId}`,
  }),
  delete: (flatId: string) => ({
    key: ["delete-flat", flatId],
    endpoint: `/flats/${flatId}`,
  }),
} as const;
