import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResident, updateResident, deleteResident, residentQueries } from "@repo/api-client";
import { CreateResidentBody, UpdateResidentBody } from "@repo/schema";

// Base prefix for all list queries — derived from the list key so there's no magic string
const residentsListBaseKey = residentQueries.list("").key;

export const useCreateResident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: residentQueries.create.key,
    mutationFn: (data: CreateResidentBody) => createResident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: residentsListBaseKey,
      });
    },
  });
};

export const useUpdateResident = (residentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: residentQueries.update(residentId).key,
    mutationFn: (data: UpdateResidentBody) => updateResident(residentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: residentQueries.details(residentId).key,
      });
      queryClient.invalidateQueries({
        queryKey: residentsListBaseKey,
      });
    },
  });
};

export const useDeleteResident = (residentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: residentQueries.delete(residentId).key,
    mutationFn: () => deleteResident(residentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: residentsListBaseKey,
      });
    },
  });
};


