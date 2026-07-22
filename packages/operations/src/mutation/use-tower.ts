import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTower, updateTower, deleteTower, towerQueries } from "@repo/api-client";
import { CreateTowerBody, UpdateTowerBody } from "@repo/schema";

export const useCreateTower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: towerQueries.create.key,
    mutationFn: (data: CreateTowerBody) => createTower(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: towerQueries.list.key,
      });
    },
  });
};

export const useUpdateTower = (towerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: towerQueries.update(towerId).key,
    mutationFn: (data: UpdateTowerBody) => updateTower(towerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: towerQueries.details(towerId).key,
      });
      queryClient.invalidateQueries({
        queryKey: towerQueries.list.key,
      });
    },
  });
};

export const useDeleteTower = (towerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: towerQueries.delete(towerId).key,
    mutationFn: () => deleteTower(towerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: towerQueries.list.key,
      });
    },
  });
};
