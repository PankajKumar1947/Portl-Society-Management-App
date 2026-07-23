import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPoll,
  updatePoll,
  deletePoll,
  publishPoll,
  closePoll,
  castVote,
  pollQueries,
} from "@repo/api-client";
import { CreatePollBody, UpdatePollBody, CastVoteBody } from "@repo/schema";

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.create.key,
    mutationFn: (data: CreatePollBody) => createPoll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};

export const useUpdatePoll = (pollId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.update(pollId).key,
    mutationFn: (data: UpdatePollBody) => updatePoll(pollId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPollDetail(pollId).key });
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};

export const useDeletePoll = (pollId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.delete(pollId).key,
    mutationFn: () => deletePoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};

export const usePublishPoll = (pollId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.publish(pollId).key,
    mutationFn: () => publishPoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPollDetail(pollId).key });
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};

export const useClosePoll = (pollId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.close(pollId).key,
    mutationFn: () => closePoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPollDetail(pollId).key });
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};

export const useCastVote = (pollId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: pollQueries.castVote(pollId).key,
    mutationFn: (data: CastVoteBody) => castVote(pollId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollQueries.getPollDetail(pollId).key });
      queryClient.invalidateQueries({ queryKey: pollQueries.getResults(pollId).key });
      queryClient.invalidateQueries({ queryKey: pollQueries.getPolls.key });
    },
  });
};
