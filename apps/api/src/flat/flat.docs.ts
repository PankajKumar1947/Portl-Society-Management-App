import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiCreateFlat() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new flat (Admin only)' }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Flat successfully created.' }),
    ApiResponse({ status: 400, description: 'Bad request / Validation error.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetFlats() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all flats in a tower' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetFlat() {
  return applyDecorators(
    ApiOperation({ summary: 'Get flat details by flatId' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Flat not found.' }),
  );
}

export function ApiUpdateFlat() {
  return applyDecorators(
    ApiOperation({ summary: 'Update flat details' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Flat updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Flat not found.' }),
  );
}

export function ApiDeleteFlat() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a flat' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Flat deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Flat not found.' }),
  );
}
