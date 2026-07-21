import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiCreateTower() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new tower (Admin only)' }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Tower successfully created.' }),
    ApiResponse({ status: 400, description: 'Bad request / Validation error.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetTowers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all towers in a society' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetTower() {
  return applyDecorators(
    ApiOperation({ summary: 'Get tower details by towerId' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Tower not found.' }),
  );
}

export function ApiUpdateTower() {
  return applyDecorators(
    ApiOperation({ summary: 'Update tower details' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Tower updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Tower not found.' }),
  );
}

export function ApiDeleteTower() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a tower' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Tower deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Tower not found.' }),
  );
}
