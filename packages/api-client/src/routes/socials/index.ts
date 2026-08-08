import {
  CreatePostInput,
  CreateCommentInput,
  PostResponse,
  PostListResponse,
  CommentResponse,
} from "@repo/schema";
import { socialsQueries } from "../../react-queries/socials";
import { apiClient } from "../../services/axios-instance";

export const getSocialsFeed = async (): Promise<PostListResponse> => {
  const res = await apiClient.get(socialsQueries.getFeed.endpoint);
  return res.data;
};

export const getSocialsPostDetail = async (id: string): Promise<PostResponse> => {
  const res = await apiClient.get(socialsQueries.getPostDetail(id).endpoint);
  return res.data;
};

export const createSocialsPost = async (data: CreatePostInput): Promise<PostResponse> => {
  const res = await apiClient.post(socialsQueries.createPost.endpoint, data);
  return res.data;
};

export const addSocialsComment = async (id: string, data: CreateCommentInput): Promise<CommentResponse> => {
  const res = await apiClient.post(socialsQueries.addComment(id).endpoint, data);
  return res.data;
};

export const toggleSocialsLike = async (id: string): Promise<PostResponse> => {
  const res = await apiClient.post(socialsQueries.toggleLike(id).endpoint);
  return res.data;
};
