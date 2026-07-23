export const complaintQueries = {
  create: {
    key: ["create-complaint"],
    endpoint: "/complaints",
  },
  list: {
    key: ["list-complaints"],
    endpoint: "/complaints",
  },
  detail: (id: string) => ({
    key: ["detail-complaint", id],
    endpoint: `/complaints/${id}`,
  }),
  update: (id: string) => ({
    key: ["update-complaint", id],
    endpoint: `/complaints/${id}`,
  }),
  delete: (id: string) => ({
    key: ["delete-complaint", id],
    endpoint: `/complaints/${id}`,
  }),
  addTimeline: (id: string) => ({
    key: ["add-complaint-timeline", id],
    endpoint: `/complaints/${id}/timeline`,
  }),
};
