import { createZodDto } from 'nestjs-zod';
import {
  RegisterSchema,
  LoginSchema,
  OtpSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
} from '@repo/schema';

export class RegisterDto extends createZodDto(RegisterSchema) {
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  password!: string;
  confirmPassword!: string;
}

export class LoginDto extends createZodDto(LoginSchema) {
  email!: string;
  password!: string;
}

export class VerifyOtpDto extends createZodDto(OtpSchema) {
  email!: string;
  otp!: string;
}

export class ForgotPasswordDto extends createZodDto(
  ForgotPasswordRequestSchema,
) {
  email!: string;
}

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
  email!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
}

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
}

export class ResendOtpDto extends createZodDto(ForgotPasswordRequestSchema) {
  email!: string;
}
