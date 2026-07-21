import { createZodDto } from 'nestjs-zod';
import {
  registerSchema,
  loginSchema,
  otpSchema,
  forgotPasswordRequestSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '@repo/schema';

export class RegisterDto extends createZodDto(registerSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  password!: string;
  confirmPassword!: string;
}

export class LoginDto extends createZodDto(loginSchema) {
  email!: string;
  password!: string;
}

export class VerifyOtpDto extends createZodDto(otpSchema) {
  email!: string;
  otp!: string;
}

export class ForgotPasswordDto extends createZodDto(
  forgotPasswordRequestSchema,
) {
  email!: string;
}

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {
  email!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
}

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
}

export class ResendOtpDto extends createZodDto(forgotPasswordRequestSchema) {
  email!: string;
}

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {
  refreshToken!: string;
}
