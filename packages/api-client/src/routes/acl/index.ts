import { AclResponse } from "@repo/schema";
import { aclQueries } from "../../react-queries/acl";
import { apiClient } from "../../services/axios-instance";

export const getAcl = async (): Promise<AclResponse> => {
  const res = await apiClient.get<AclResponse>(aclQueries.get.endpoint);
  return res.data;
};
