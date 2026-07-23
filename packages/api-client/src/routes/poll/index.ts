import {
  CreatePollBody,
  UpdatePollBody,
  PollResponse,
  PollListResponse,
  CastVoteBody,
  PollResultsData,
} from "@repo/schema";
import { pollQueries } from "../../react-queries/poll";
import { apiClient } from "../../services/axios-instance";

export const getPolls = async (params?: { search?: string; status?: string; recipient?: string }): Promise<PollListResponse> => {
  const res = await apiClient.get(pollQueries.getPolls.endpoint, { params });
  return res.data;
};

export const getPollDetails = async (pollId: string): Promise<PollResponse> => {
  const res = await apiClient.get(pollQueries.getPollDetail(pollId).endpoint);
  return res.data;
};

export const createPoll = async (data: CreatePollBody): Promise<PollResponse> => {
  const res = await apiClient.post(pollQueries.create.endpoint, data);
  return res.data;
};

export const updatePoll = async (pollId: string, data: UpdatePollBody): Promise<PollResponse> => {
  const res = await apiClient.patch(pollQueries.update(pollId).endpoint, data);
  return res.data;
};

export const deletePoll = async (pollId: string): Promise<void> => {
  await apiClient.delete(pollQueries.delete(pollId).endpoint);
};

export const publishPoll = async (pollId: string): Promise<PollResponse> => {
  const res = await apiClient.post(pollQueries.publish(pollId).endpoint);
  return res.data;
};

export const closePoll = async (pollId: string): Promise<PollResponse> => {
  const res = await apiClient.post(pollQueries.close(pollId).endpoint);
  return res.data;
};

export const castVote = async (pollId: string, data: CastVoteBody): Promise<{ success: boolean; message: string; data: { voteId: string } }> => {
  const res = await apiClient.post(pollQueries.castVote(pollId).endpoint, data);
  return res.data;
};

export const getPollResults = async (pollId: string): Promise<{ success: boolean; message: string; data: PollResultsData }> => {
  const res = await apiClient.get(pollQueries.getResults(pollId).endpoint);
  return res.data;
};
