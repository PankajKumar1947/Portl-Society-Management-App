export const familyMemberQueries = {
  list: {
    key: ["family-members"],
    endpoint: "/residents/family-members",
  },
  add: {
    key: ["add-family-member"],
    endpoint: "/residents/family-members",
  },
} as const;
