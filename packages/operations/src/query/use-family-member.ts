import { useQuery } from "@tanstack/react-query";
import { getFamilyMembers, familyMemberQueries } from "@repo/api-client";
import { FamilyMemberListResponse } from "@repo/schema";

export const useGetFamilyMembers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: familyMemberQueries.list.key,
    queryFn: getFamilyMembers,
    select: (response: FamilyMemberListResponse) => response.data,
    enabled: options?.enabled ?? true,
  });
};
