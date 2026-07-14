import { LoginBody, RegisterBody, LoginData, RegisterData } from "@repo/schema";
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
