import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSociety, updateSociety, societyQueries } from "@repo/api-client";
import { CreateSocietyBody, UpdateSocietyBody } from "@repo/schema";

export const useCreateSociety = () => {
  return useMutation({
    mutationKey: societyQueries.create.key,
    mutationFn: (data: CreateSocietyBody) => createSociety(data),
  });
};

export const useUpdateSociety = (societyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: societyQueries.update(societyId).key,
    mutationFn: (data: UpdateSocietyBody) => updateSociety(societyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: societyQueries.details(societyId).key
      });
    },
  });
};
