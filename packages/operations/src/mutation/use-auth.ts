import { useMutation } from "@tanstack/react-query";
import { login, authQueries, register } from "@repo/api-client";
import { LoginBody, RegisterBody } from "@repo/schema";

export const useLogin = () => {
  return useMutation({
    mutationKey: authQueries.login.key,
    mutationFn: (data: LoginBody) => login(data),
    onSuccess: (data) => {
      console.log("Logged in successfully", data);
    },
    onError: (error) => {
      console.log("Failed to login", error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: authQueries.register.key,
    mutationFn: (data: RegisterBody) => register(data),
    onSuccess: (data) => {
      console.log("Registered successfully", data);
    },
    onError: (error) => {
      console.log("Failed to register", error);
    },
  });
};
