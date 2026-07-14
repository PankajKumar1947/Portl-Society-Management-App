export const authQueries = {
  register: {
    key: ["register"],
    endpoint: "/auth/register",
  },
  login: {
    key: ["login"],
    endpoint: "/auth/login",
  },
} as const;
