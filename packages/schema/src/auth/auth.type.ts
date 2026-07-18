import z from "zod";
import {
  RegisterSchema,
  LoginSchema,
  RegisterRequestSchema,
  PhoneSchema,
  OtpSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
} from "./auth.schema";

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type RegisterRequestBody = z.infer<typeof RegisterRequestSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type PhoneBody = z.infer<typeof PhoneSchema>;
export type OtpBody = z.infer<typeof OtpSchema>;
export type ForgotPasswordRequestBody = z.infer<
  typeof ForgotPasswordRequestSchema
>;
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;

export type LoginData = {
  message: string;
  accessToken: string;
  refreshToken: string;
  onboardingCompleted: boolean;
  name?: string;
};

export type RegisterData = {
  message: string;
  name: string;
};
