import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSocialsPost, addSocialsComment, toggleSocialsLike, socialsQueries } from "@repo/api-client";
import { CreatePostInput, CreateCommentInput } from "@repo/schema";

export const useCreateSocialsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: socialsQueries.createPost.key,
    mutationFn: (data: CreatePostInput) => createSocialsPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialsQueries.getFeed.key });
    },
  });
};

export const useAddSocialsComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-socials-comment"],
    mutationFn: ({ id, data }: { id: string; data: CreateCommentInput }) => addSocialsComment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: socialsQueries.getPostDetail(id).key });
      queryClient.invalidateQueries({ queryKey: socialsQueries.getFeed.key });
    },
  });
};

export const useToggleSocialsLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["toggle-socials-like"],
    mutationFn: (id: string) => toggleSocialsLike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: socialsQueries.getPostDetail(id).key });
      queryClient.invalidateQueries({ queryKey: socialsQueries.getFeed.key });
    },
  });
};
