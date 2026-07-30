import { useQuery } from "@tanstack/react-query";
import { getFamilyMembers, getFamilyMember, familyMemberQueries } from "@repo/api-client";
import { FamilyMemberListResponse, FamilyMemberResponse } from "@repo/schema";

export const useGetFamilyMembers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: familyMemberQueries.list.key,
    queryFn: getFamilyMembers,
    select: (response: FamilyMemberListResponse) => response.data,
    enabled: options?.enabled ?? true,
  });
};

export const useGetFamilyMemberDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: familyMemberQueries.detail(id).key,
    queryFn: () => getFamilyMember(id),
    select: (response: FamilyMemberResponse) => response.data,
    enabled: !!id && (options?.enabled ?? true),
  });
};
