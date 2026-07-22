import { useMutation } from "@tanstack/react-query";
import {
  login,
  register,
  verifyOtp,
  resendOtp,
  refreshToken,
  authQueries,
  setAccessToken,
  setRefreshToken,
} from "@repo/api-client";
import { LoginBody, RegisterBody } from "@repo/schema";

export const useLogin = () => {
  return useMutation({
    mutationKey: authQueries.login.key,
    mutationFn: (data: LoginBody) => login(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: authQueries.register.key,
    mutationFn: (data: RegisterBody) => register(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: authQueries.verifyOtp.key,
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });
};

export const useVerifyResidentOtp = () => {
  return useMutation({
    mutationKey: ["verify-resident-otp"],
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationKey: authQueries.resendOtp.key,
    mutationFn: (data: { email: string }) => resendOtp(data),
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationKey: authQueries.refreshToken.key,
    mutationFn: (data: { refreshToken: string }) => refreshToken(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });
};
