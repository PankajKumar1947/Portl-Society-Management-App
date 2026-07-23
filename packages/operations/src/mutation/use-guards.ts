import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  onboardGuardPersonal,
  onboardGuardDuty,
  updateGuard,
  deleteGuard,
  guardQueries,
} from "@repo/api-client";
import {
  GuardPersonalInput,
  GuardDutyInput,
  UpdateGuardBody,
} from "@repo/schema";

export const useOnboardGuardPersonal = () => {
  return useMutation({
    mutationKey: guardQueries.onboardPersonal.key,
    mutationFn: (data: GuardPersonalInput) => onboardGuardPersonal(data),
  });
};

export const useOnboardGuardDuty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: guardQueries.onboardDuty.key,
    mutationFn: (data: GuardDutyInput) => onboardGuardDuty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardQueries.getGuards.key });
    },
  });
};

export const useUpdateGuard = (guardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: guardQueries.update(guardId).key,
    mutationFn: (data: UpdateGuardBody) => updateGuard(guardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardQueries.getGuards.key });
      queryClient.invalidateQueries({ queryKey: guardQueries.getGuardDetail(guardId).key });
    },
  });
};

export const useDeleteGuard = (guardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: guardQueries.delete(guardId).key,
    mutationFn: () => deleteGuard(guardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardQueries.getGuards.key });
    },
  });
};
