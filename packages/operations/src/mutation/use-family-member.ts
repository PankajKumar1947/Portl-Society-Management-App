import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFamilyMember, updateFamilyMember, deleteFamilyMember, familyMemberQueries } from "@repo/api-client";
import { AddFamilyMemberInput, UpdateFamilyMemberInput } from "@repo/schema";

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: familyMemberQueries.add.key,
    mutationFn: (data: AddFamilyMemberInput) => addFamilyMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familyMemberQueries.list.key,
      });
    },
  });
};

export const useUpdateFamilyMember = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: familyMemberQueries.update(id).key,
    mutationFn: (data: UpdateFamilyMemberInput) => updateFamilyMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familyMemberQueries.list.key,
      });
      queryClient.invalidateQueries({
        queryKey: familyMemberQueries.detail(id).key,
      });
    },
  });
};

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-family-member"],
    mutationFn: (id: string) => deleteFamilyMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familyMemberQueries.list.key,
      });
    },
  });
};
