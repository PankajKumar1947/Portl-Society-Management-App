import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VISITOR_STATUSES, VISITOR_TYPES } from '@repo/schema';

export function ApiCreateVisitor() {
  return applyDecorators(
    ApiOperation({ summary: 'Create or pre-approve a visitor' }),
    ApiResponse({ status: 201, description: 'Visitor record created successfully.' }),
  );
}

export function ApiGetVisitors() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of visitors' }),
    ApiQuery({ name: 'status', required: false, enum: VISITOR_STATUSES }),
    ApiQuery({ name: 'type', required: false, enum: VISITOR_TYPES }),
    ApiResponse({ status: 200, description: 'Visitors retrieved successfully.' }),
  );
}

export function ApiGetVisitor() {
  return applyDecorators(
    ApiOperation({ summary: 'Get specific visitor details' }),
    ApiResponse({ status: 200, description: 'Visitor retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Visitor not found.' }),
  );
}

export function ApiUpdateVisitorStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Approve, reject, check-in, or check-out a visitor' }),
    ApiResponse({ status: 200, description: 'Visitor status updated successfully.' }),
    ApiResponse({ status: 404, description: 'Visitor not found.' }),
  );
}

export function ApiVerifyPassCode() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify visitor QR pass code' }),
    ApiResponse({ status: 200, description: 'Pass code verified successfully.' }),
    ApiResponse({ status: 404, description: 'Invalid or expired pass code.' }),
  );
}
