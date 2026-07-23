import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiCreateNotice() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new notice (draft or publish)' }),
    ApiResponse({ status: 201, description: 'Notice created successfully.' }),
  );
}

export function ApiGetNotices() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all notices for the society' }),
    ApiQuery({ name: 'search', required: false, description: 'Search by title or description' }),
    ApiQuery({ name: 'status', required: false, description: 'Filter by status: draft, published, all' }),
    ApiQuery({ name: 'recipient', required: false, description: 'Filter by recipient: guard, residents, all' }),
    ApiResponse({ status: 200, description: 'Notices retrieved successfully.' }),
  );
}

export function ApiGetNotice() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific notice by ID' }),
    ApiResponse({ status: 200, description: 'Notice details retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Notice not found.' }),
  );
}

export function ApiUpdateNotice() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a notice' }),
    ApiResponse({ status: 200, description: 'Notice updated successfully.' }),
    ApiResponse({ status: 404, description: 'Notice not found.' }),
  );
}

export function ApiDeleteNotice() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a notice' }),
    ApiResponse({ status: 200, description: 'Notice deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Notice not found.' }),
  );
}

export function ApiPublishNotice() {
  return applyDecorators(
    ApiOperation({ summary: 'Publish a draft notice' }),
    ApiResponse({ status: 200, description: 'Notice published successfully.' }),
    ApiResponse({ status: 404, description: 'Notice not found.' }),
  );
}
