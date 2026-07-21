import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({
      status: 201,
      description: 'Registration successful. Verification OTP sent.',
    }),
    ApiResponse({ status: 400, description: 'Validation failed.' }),
    ApiResponse({
      status: 409,
      description: 'User with this email already exists.',
    }),
  );
}

export function ApiVerifyOtp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify OTP code to activate account and receive tokens',
    }),
    ApiResponse({
      status: 200,
      description: 'OTP verified successfully. Returns JWT tokens.',
    }),
    ApiResponse({ status: 400, description: 'Invalid or expired OTP.' }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate user with email and password' }),
    ApiResponse({
      status: 200,
      description: 'Login successful. Returns JWT tokens.',
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials or email not verified.',
    }),
  );
}

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Request password reset OTP via email' }),
    ApiResponse({
      status: 200,
      description: 'Reset password OTP sent successfully.',
    }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );
}

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset user password using OTP verification' }),
    ApiResponse({ status: 200, description: 'Password reset successful.' }),
    ApiResponse({
      status: 400,
      description: 'Invalid OTP or passwords mismatch.',
    }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Change password for authenticated user' }),
    ApiResponse({ status: 200, description: 'Password changed successfully.' }),
    ApiResponse({ status: 400, description: 'Incorrect old password.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
  );
}

export function ApiResendOtp() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend verification OTP email' }),
    ApiResponse({
      status: 200,
      description: 'Verification OTP resent successfully.',
    }),
    ApiResponse({ status: 400, description: 'Email is already verified.' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token using refresh token' }),
    ApiResponse({
      status: 200,
      description: 'New tokens generated successfully.',
    }),
    ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' }),
  );
}
