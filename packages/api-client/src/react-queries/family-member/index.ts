export const familyMemberQueries = {
  list: {
    key: ["family-members"],
    endpoint: "/residents/family-members",
  },
  add: {
    key: ["add-family-member"],
    endpoint: "/residents/family-members",
  },
  detail: (id: string) => ({
    key: ["family-member", id],
    endpoint: `/residents/family-members/${id}`,
  }),
  update: (id: string) => ({
    key: ["update-family-member", id],
    endpoint: `/residents/family-members/${id}`,
  }),
  delete: (id: string) => ({
    key: ["delete-family-member", id],
    endpoint: `/residents/family-members/${id}`,
  }),
} as const;
