import z from "zod";
import {
  RegisterSchema,
  LoginSchema,
  RegisterRequestSchema,
} from "./auth.schema";

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type RegisterRequestBody = z.infer<typeof RegisterRequestSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;

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
