import { useQuery } from "@tanstack/react-query";
import { getMediaDetail, getMediaList, mediaQueries } from "@repo/api-client";
import { EntityType } from "@repo/schema";

export const useGetMediaDetail = (mediaId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: mediaQueries.getMediaDetail(mediaId).key,
    queryFn: () => getMediaDetail(mediaId),
    enabled: options?.enabled,
  });
};

export const useGetMediaList = (
  params: { entityType: EntityType; entityId: string },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...mediaQueries.getMediaList.key, params.entityType, params.entityId],
    queryFn: () => getMediaList(params),
    enabled: options?.enabled,
    select: (res) => res.data,
  });
};
