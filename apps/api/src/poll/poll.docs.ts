import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiCreatePoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new poll (draft or publish)' }),
    ApiResponse({ status: 201, description: 'Poll created successfully.' }),
  );
}

export function ApiGetPolls() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all polls for the society' }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'status', required: false }),
    ApiQuery({ name: 'recipient', required: false }),
    ApiResponse({ status: 200, description: 'Polls retrieved successfully.' }),
  );
}

export function ApiGetPoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific poll by ID' }),
    ApiResponse({ status: 200, description: 'Poll details retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Poll not found.' }),
  );
}

export function ApiUpdatePoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a poll' }),
    ApiResponse({ status: 200, description: 'Poll updated successfully.' }),
    ApiResponse({ status: 404, description: 'Poll not found.' }),
  );
}

export function ApiDeletePoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a poll' }),
    ApiResponse({ status: 200, description: 'Poll deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Poll not found.' }),
  );
}

export function ApiPublishPoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Publish a draft poll' }),
    ApiResponse({ status: 200, description: 'Poll published successfully.' }),
    ApiResponse({ status: 404, description: 'Poll not found.' }),
  );
}

export function ApiClosePoll() {
  return applyDecorators(
    ApiOperation({ summary: 'Close an active poll' }),
    ApiResponse({ status: 200, description: 'Poll closed successfully.' }),
    ApiResponse({ status: 404, description: 'Poll not found.' }),
  );
}

export function ApiCastVote() {
  return applyDecorators(
    ApiOperation({ summary: 'Cast a vote on a poll' }),
    ApiResponse({ status: 201, description: 'Vote cast successfully.' }),
    ApiResponse({ status: 409, description: 'Already voted.' }),
    ApiResponse({ status: 400, description: 'Poll expired or invalid option.' }),
  );
}

export function ApiGetResults() {
  return applyDecorators(
    ApiOperation({ summary: 'Get poll results with vote counts' }),
    ApiResponse({ status: 200, description: 'Poll results retrieved successfully.' }),
  );
}
