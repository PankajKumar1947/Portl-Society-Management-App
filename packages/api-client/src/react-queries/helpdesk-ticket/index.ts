export const helpdeskTicketQueries = {
  create: {
    key: ["create-helpdesk-ticket"],
    endpoint: "/helpdesk-tickets",
  },
  list: {
    key: ["list-helpdesk-tickets"],
    endpoint: "/helpdesk-tickets",
  },
  detail: (id: string) => ({
    key: ["detail-helpdesk-ticket", id],
    endpoint: `/helpdesk-tickets/${id}`,
  }),
  update: (id: string) => ({
    key: ["update-helpdesk-ticket", id],
    endpoint: `/helpdesk-tickets/${id}`,
  }),
  delete: (id: string) => ({
    key: ["delete-helpdesk-ticket", id],
    endpoint: `/helpdesk-tickets/${id}`,
  }),
  addTimeline: (id: string) => ({
    key: ["add-helpdesk-ticket-timeline", id],
    endpoint: `/helpdesk-tickets/${id}/timeline`,
  }),
  resolve: (id: string) => ({
    key: ["resolve-helpdesk-ticket", id],
    endpoint: `/helpdesk-tickets/${id}/resolve`,
  }),
};
