import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia, deleteMedia, UploadMediaParams, mediaQueries } from "@repo/api-client";

export const useUploadMedia = () => {
  return useMutation({
    mutationKey: mediaQueries.uploadMedia.key,
    mutationFn: (params: UploadMediaParams) => uploadMedia(params),
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mediaQueries.delete("").key,
    mutationFn: (mediaId: string) => deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaQueries.getMediaList.key });
    },
  });
};
