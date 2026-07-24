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

export function ApiGetMyResident() {
  return applyDecorators(
    ApiOperation({ summary: 'Get the current user\'s resident profile' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Resident profile fetched successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 404, description: 'Resident profile not found.' }),
  );
}

export function ApiGetFamilyMembers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get family members for current user\'s flat' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Family members fetched successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiAddFamilyMember() {
  return applyDecorators(
    ApiOperation({ summary: 'Add a family member to the current user\'s flat' }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Family member added successfully.' }),
    ApiResponse({ status: 400, description: 'Validation error.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}
