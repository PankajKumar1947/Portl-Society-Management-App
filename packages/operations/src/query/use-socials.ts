import { useQuery } from "@tanstack/react-query";
import { getSocialsFeed, getSocialsPostDetail, socialsQueries, SocialsFeedParams } from "@repo/api-client";
import { PostListResponse, PostResponse, SocialsPost } from "@repo/schema";

export const useGetSocialsFeed = (params?: SocialsFeedParams) => {
  return useQuery({
    queryKey: [...socialsQueries.getFeed.key, params],
    queryFn: () => getSocialsFeed(params),
    select: (response: PostListResponse): SocialsPost[] => response.data,
  });
};

export const useGetSocialsPostDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: socialsQueries.getPostDetail(id).key,
    queryFn: () => getSocialsPostDetail(id),
    select: (response: PostResponse): SocialsPost => response.data,
    enabled: options?.enabled ?? !!id,
  });
};
