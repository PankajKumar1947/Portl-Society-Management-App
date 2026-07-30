import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiCreateSociety() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new society (Admin only)' }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Society successfully created.' }),
    ApiResponse({
      status: 400,
      description: 'Bad request / Validation error.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({
      status: 409,
      description: 'User already has a society registered.',
    }),
  );
}

export function ApiGetSocietyByUserId() {
  return applyDecorators(
    ApiOperation({ summary: 'Get society details of the logged in user' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({
      status: 404,
      description: 'No society registered for the user.',
    }),
  );
}

export function ApiGetSociety() {
  return applyDecorators(
    ApiOperation({ summary: 'Get society details by societyId' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Society not found.' }),
  );
}

export function ApiUpdateSociety() {
  return applyDecorators(
    ApiOperation({ summary: 'Update society details' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Society updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Society not found.' }),
  );
}

export function ApiGetSocietyStats() {
  return applyDecorators(
    ApiOperation({ summary: 'Get society statistics (Admin only)' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Society stats returned successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Society not found.' }),
  );
}
