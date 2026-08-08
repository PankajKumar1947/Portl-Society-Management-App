import z from "zod";
import {
  postSchema,
  commentSchema,
  createPostSchema,
  createCommentSchema,
} from "./socials.schema";
import { ApiResponse } from "../shared/api.type";

export type SocialsComment = z.infer<typeof commentSchema>;
export type SocialsPost = z.infer<typeof postSchema>;

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export type PostResponse = ApiResponse<SocialsPost>;
export type PostListResponse = ApiResponse<SocialsPost[]>;
export type CommentResponse = ApiResponse<SocialsComment>;
