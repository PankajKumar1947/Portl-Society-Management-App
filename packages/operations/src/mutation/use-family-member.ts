import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFamilyMember, familyMemberQueries } from "@repo/api-client";
import { AddFamilyMemberInput } from "@repo/schema";

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
