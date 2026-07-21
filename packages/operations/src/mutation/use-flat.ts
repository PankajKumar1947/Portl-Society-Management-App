import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlat, updateFlat, deleteFlat, flatQueries } from "@repo/api-client";
import { CreateFlatBody, UpdateFlatBody } from "@repo/schema";

export const useCreateFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: flatQueries.create.key,
    mutationFn: (data: CreateFlatBody) => createFlat(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: flatQueries.list(data.towerId).key,
      });
    },
  });
};

export const useUpdateFlat = (flatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: flatQueries.update(flatId).key,
    mutationFn: (data: UpdateFlatBody) => updateFlat(flatId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: flatQueries.details(flatId).key,
      });
      queryClient.invalidateQueries({
        queryKey: flatQueries.list(data.towerId).key,
      });
    },
  });
};

export const useDeleteFlat = (flatId: string, towerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: flatQueries.delete(flatId).key,
    mutationFn: () => deleteFlat(flatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flatQueries.list(towerId).key,
      });
    },
  });
};
