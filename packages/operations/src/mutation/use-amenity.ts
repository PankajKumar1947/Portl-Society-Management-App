import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAmenity, updateAmenity, deleteAmenity, amenityQueries } from "@repo/api-client";
import { CreateAmenityBody, UpdateAmenityBody, AmenityData } from "@repo/schema";

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation<AmenityData, Error, CreateAmenityBody>({
    mutationKey: amenityQueries.create.key,
    mutationFn: (data: CreateAmenityBody) => createAmenity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amenityQueries.list.key });
    },
  });
};

export const useUpdateAmenity = (id: string) => {
  const queryClient = useQueryClient();
  const query = amenityQueries.update(id);
  return useMutation<AmenityData, Error, UpdateAmenityBody>({
    mutationKey: query.key,
    mutationFn: (data: UpdateAmenityBody) => updateAmenity(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: amenityQueries.list.key });
      queryClient.invalidateQueries({ queryKey: amenityQueries.detail(id).key });
    },
  });
};

export const useDeleteAmenity = (id: string) => {
  const queryClient = useQueryClient();
  const query = amenityQueries.delete(id);
  return useMutation<boolean, Error, void>({
    mutationKey: query.key,
    mutationFn: () => deleteAmenity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amenityQueries.list.key });
      queryClient.invalidateQueries({ queryKey: amenityQueries.detail(id).key });
    },
  });
};
