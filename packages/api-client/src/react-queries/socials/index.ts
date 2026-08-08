export const socialsQueries = {
  getFeed: {
    key: ["get-socials-feed"],
    endpoint: "/socials",
  },
  getPostDetail: (id: string) => ({
    key: ["get-socials-post-detail", id],
    endpoint: `/socials/${id}`,
  }),
  createPost: {
    key: ["create-socials-post"],
    endpoint: "/socials",
  },
  addComment: (id: string) => ({
    key: ["add-socials-comment", id],
    endpoint: `/socials/${id}/comments`,
  }),
  toggleLike: (id: string) => ({
    key: ["toggle-socials-like", id],
    endpoint: `/socials/${id}/like`,
  }),
} as const;
