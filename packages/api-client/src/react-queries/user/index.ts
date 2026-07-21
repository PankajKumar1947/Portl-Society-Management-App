export const userQueries = {
  me: {
    key: ["user-me"],
    endpoint: "/users/me",
  },
  update: (userId: string) => ({
    key: ["update-user", userId],
    endpoint: `/users/${userId}`,
  }),
} as const;
