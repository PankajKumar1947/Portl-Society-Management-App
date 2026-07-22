import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiCreateResident() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new resident (Admin only)' }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Resident successfully created.' }),
    ApiResponse({ status: 400, description: 'Bad request / Validation error.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetResidents() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all residents' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiGetResident() {
  return applyDecorators(
    ApiOperation({ summary: 'Get resident details' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Resident not found.' }),
  );
}

export function ApiUpdateResident() {
  return applyDecorators(
    ApiOperation({ summary: 'Update resident details' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Resident updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Resident not found.' }),
  );
}

export function ApiDeleteResident() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a resident' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Resident deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Resident not found.' }),
  );
}
