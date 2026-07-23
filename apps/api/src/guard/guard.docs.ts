import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiOnboardGuardPersonal() {
  return applyDecorators(
    ApiOperation({ summary: 'Onboard guard step 1: Personal details and OTP trigger' }),
    ApiResponse({ status: 201, description: 'OTP triggered. Verify email address.' }),
    ApiResponse({ status: 409, description: 'User with this email already exists.' }),
  );
}

export function ApiOnboardGuardDuty() {
  return applyDecorators(
    ApiOperation({ summary: 'Onboard guard step 2: Duty details allocation' }),
    ApiResponse({ status: 201, description: 'Guard onboarding complete.' }),
    ApiResponse({ status: 409, description: 'Guard is already onboarded.' }),
  );
}

export function ApiGetGuards() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of registered security guards' }),
    ApiQuery({ name: 'type', required: false, description: 'Filter by Shift: DAY, NIGHT, ROUTINE' }),
    ApiQuery({ name: 'search', required: false, description: 'Search name, phone, or gate' }),
    ApiResponse({ status: 200, description: 'List retrieved successfully.' }),
  );
}

export function ApiGetGuard() {
  return applyDecorators(
    ApiOperation({ summary: 'Get details of a specific security guard' }),
    ApiResponse({ status: 200, description: 'Guard details retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Guard not found.' }),
  );
}

export function ApiUpdateGuard() {
  return applyDecorators(
    ApiOperation({ summary: 'Update details of a security guard' }),
    ApiResponse({ status: 200, description: 'Guard updated successfully.' }),
    ApiResponse({ status: 404, description: 'Guard not found.' }),
  );
}

export function ApiDeleteGuard() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove a security guard' }),
    ApiResponse({ status: 200, description: 'Guard deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Guard not found.' }),
  );
}
