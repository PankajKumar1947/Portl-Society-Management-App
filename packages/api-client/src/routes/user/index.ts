import { User, UpdateUserBody } from "@repo/schema";
import { userQueries } from "../../react-queries/user";
import { apiClient } from "../../services/axios-instance";

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get(userQueries.me.endpoint);
  return res.data;
};

export const updateUser = async (
  userId: string,
  data: UpdateUserBody,
): Promise<User> => {
  const res = await apiClient.patch(userQueries.update(userId).endpoint, data);
  return res.data;
};
