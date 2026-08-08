import z from "zod";

import { userRoleSchema } from "../user/user.schema";

export const commentSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  authorRole: userRoleSchema,
  authorRoleLabel: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string().min(1, "Comment content cannot be empty"),
  time: z.string(),
  createdAt: z.string(),
});

export const postSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  authorRole: userRoleSchema,
  authorRoleLabel: z.string(),
  authorAvatar: z.string().optional(),
  time: z.string(),
  content: z.string().min(1, "Post content cannot be empty"),
  images: z.array(z.string()).optional().default([]),
  likes: z.number().default(0),
  commentsCount: z.number().default(0),
  comments: z.array(commentSchema).default([]),
  hasLiked: z.boolean().default(false),
  createdAt: z.string(),
});

export const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  images: z.array(z.string()).optional().default([]),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});
