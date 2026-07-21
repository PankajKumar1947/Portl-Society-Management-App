import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateUser, userQueries } from "@repo/api-client";
import { UpdateUserBody } from "@repo/schema";

export const useGetMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: userQueries.me.key,
    queryFn: () => getMe(),
    enabled: options?.enabled,
  });
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: userQueries.update(userId).key,
    mutationFn: (data: UpdateUserBody) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.me.key,
      });
    },
  });
};
