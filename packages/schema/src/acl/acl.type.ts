import { ApiResponse } from "../shared/api.type";

export interface ResourcePermissions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export type AclResources = Record<string, ResourcePermissions>;

export interface AclData {
  role: string;
  resources: AclResources;
}

export type AclResponse = ApiResponse<AclData>;
