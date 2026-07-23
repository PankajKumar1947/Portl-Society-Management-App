export const mediaQueries = {
  uploadMedia: {
    key: ["upload-media"],
    endpoint: "/media/upload",
  },
  getMediaDetail: (mediaId: string) => ({
    key: ["get-media-detail", mediaId],
    endpoint: `/media/${mediaId}`,
  }),
  getMediaList: {
    key: ["get-media-list"],
    endpoint: "/media",
  },
  delete: (mediaId: string) => ({
    key: ["delete-media", mediaId],
    endpoint: `/media/${mediaId}`,
  }),
} as const;
