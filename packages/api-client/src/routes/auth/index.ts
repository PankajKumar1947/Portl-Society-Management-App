import {
  LoginBody,
  RegisterBody,
  LoginData,
  RegisterData,
  VerifyOtpData,
  ResendOtpData,
  RefreshTokenBody,
  RefreshTokenData,
  ForgotPasswordRequestBody,
  ForgotPasswordData,
  ResetPasswordBody,
  ResetPasswordData,
} from "@repo/schema";
import { authQueries } from "../../react-queries/auth";
import { apiClient } from "../../services/axios-instance";

export const login = async (data: LoginBody): Promise<LoginData> => {
  const res = await apiClient.post(authQueries.login.endpoint, data);
  return res.data;
};

export const register = async (data: RegisterBody): Promise<RegisterData> => {
  const res = await apiClient.post(authQueries.register.endpoint, data);
  return res.data;
};

export const verifyOtp = async (data: {
  email: string;
  otp: string;
}): Promise<VerifyOtpData> => {
  const res = await apiClient.post(authQueries.verifyOtp.endpoint, data);
  return res.data;
};

export const resendOtp = async (data: {
  email: string;
}): Promise<ResendOtpData> => {
  const res = await apiClient.post(authQueries.resendOtp.endpoint, data);
  return res.data;
};

export const refreshToken = async (
  data: RefreshTokenBody,
): Promise<RefreshTokenData> => {
  const res = await apiClient.post(authQueries.refreshToken.endpoint, data);
  return res.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequestBody,
): Promise<ForgotPasswordData> => {
  const res = await apiClient.post(authQueries.forgotPassword.endpoint, data);
  return res.data;
};

export const resetPassword = async (
  data: ResetPasswordBody,
): Promise<ResetPasswordData> => {
  const res = await apiClient.post(authQueries.resetPassword.endpoint, data);
  return res.data;
};
