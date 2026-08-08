import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new post in the society socials feed' }),
    ApiResponse({ status: 201, description: 'Post created successfully.' }),
  );
}

export function ApiGetPosts() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all socials posts for the society' }),
    ApiResponse({ status: 200, description: 'Posts retrieved successfully.' }),
  );
}

export function ApiGetPost() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific post by ID with comments' }),
    ApiResponse({ status: 200, description: 'Post details retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Post not found.' }),
  );
}

export function ApiCreateComment() {
  return applyDecorators(
    ApiOperation({ summary: 'Add a new comment to a post' }),
    ApiResponse({ status: 201, description: 'Comment added successfully.' }),
    ApiResponse({ status: 404, description: 'Post not found.' }),
  );
}

export function ApiToggleLike() {
  return applyDecorators(
    ApiOperation({ summary: 'Toggle like state on a post' }),
    ApiResponse({ status: 200, description: 'Like toggled successfully.' }),
    ApiResponse({ status: 404, description: 'Post not found.' }),
  );
}
