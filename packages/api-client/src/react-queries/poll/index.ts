export const pollQueries = {
  getPolls: {
    key: ["get-polls"],
    endpoint: "/polls",
  },
  getPollDetail: (pollId: string) => ({
    key: ["get-poll-detail", pollId],
    endpoint: `/polls/${pollId}`,
  }),
  create: {
    key: ["create-poll"],
    endpoint: "/polls",
  },
  update: (pollId: string) => ({
    key: ["update-poll", pollId],
    endpoint: `/polls/${pollId}`,
  }),
  delete: (pollId: string) => ({
    key: ["delete-poll", pollId],
    endpoint: `/polls/${pollId}`,
  }),
  publish: (pollId: string) => ({
    key: ["publish-poll", pollId],
    endpoint: `/polls/${pollId}/publish`,
  }),
  close: (pollId: string) => ({
    key: ["close-poll", pollId],
    endpoint: `/polls/${pollId}/close`,
  }),
  castVote: (pollId: string) => ({
    key: ["cast-vote", pollId],
    endpoint: `/polls/${pollId}/vote`,
  }),
  getResults: (pollId: string) => ({
    key: ["get-poll-results", pollId],
    endpoint: `/polls/${pollId}/results`,
  }),
} as const;
