export const amenityQueries = {
  create: {
    key: ["create-amenity"],
    endpoint: "/amenities",
  },
  list: {
    key: ["list-amenities"],
    endpoint: "/amenities",
  },
  detail: (id: string) => ({
    key: ["detail-amenity", id],
    endpoint: `/amenities/${id}`,
  }),
  update: (id: string) => ({
    key: ["update-amenity", id],
    endpoint: `/amenities/${id}`,
  }),
  delete: (id: string) => ({
    key: ["delete-amenity", id],
    endpoint: `/amenities/${id}`,
  }),
} as const;
