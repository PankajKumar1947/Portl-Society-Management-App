import { useQuery } from "@tanstack/react-query";
import { getAmenities, getAmenityDetail, amenityQueries } from "@repo/api-client";
import { AmenityData } from "@repo/schema";

export const useGetAmenities = () => {
  return useQuery<AmenityData[]>({
    queryKey: amenityQueries.list.key,
    queryFn: () => getAmenities(),
  });
};

export const useGetAmenityDetail = (id: string, options?: { enabled?: boolean }) => {
  const query = amenityQueries.detail(id);
  return useQuery<AmenityData>({
    queryKey: query.key,
    queryFn: () => getAmenityDetail(id),
    enabled: options?.enabled ?? !!id,
  });
};
