import z from "zod";
import {
  registerSchema,
  loginSchema,
  registerRequestSchema,
  phoneSchema,
  otpSchema,
  forgotPasswordRequestSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.schema";

export type RegisterBody = z.infer<typeof registerSchema>;
export type RegisterRequestBody = z.infer<typeof registerRequestSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type PhoneBody = z.infer<typeof phoneSchema>;
export type OtpBody = z.infer<typeof otpSchema>;
export type ForgotPasswordRequestBody = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type LoginData = {
  message: string;
  accessToken: string;
  refreshToken: string;
  isSocietyCreated: boolean;
  name?: string;
};

export type RegisterData = {
  message: string;
  email: string;
};

export type VerifyOtpData = {
  message: string;
  accessToken: string;
  refreshToken: string;
  isSocietyCreated: boolean;
  name?: string;
};

export type ResendOtpData = {
  message: string;
  email: string;
};
