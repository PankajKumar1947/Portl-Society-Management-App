import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({ status: 201, description: 'User successfully created.' }),
    ApiResponse({ status: 400, description: 'Validation failed.' }),
    ApiResponse({ status: 409, description: 'User already exists.' }),
  );
}

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({ status: 200, description: 'Return all users.' }),
  );
}

export function ApiFindOneUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by userId' }),
    ApiResponse({ status: 200, description: 'Return user details.' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user details' }),
    ApiResponse({ status: 200, description: 'User successfully updated.' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user' }),
    ApiResponse({ status: 200, description: 'User successfully deleted.' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );
}
