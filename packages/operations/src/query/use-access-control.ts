import { UserRoles, AclResourceName } from "@repo/schema";
import { useAccessControlContext } from "../access-control-context";

export const useAccessControl = (entity?: AclResourceName) => {
  const { data, isLoading } = useAccessControlContext();

  const role = data?.role ?? "";
  const isSuperUser = role === UserRoles.SUPER_ADMIN;
  const resources = data?.resources ?? {};

  const checkPermission = (ent: AclResourceName) =>
    resources[ent] ?? { view: false, create: false, update: false, delete: false };

  const canView = isSuperUser || (entity ? checkPermission(entity).view : false);
  const canCreate = isSuperUser || (entity ? checkPermission(entity).create : false);
  const canUpdate = isSuperUser || (entity ? checkPermission(entity).update : false);
  const canDelete = isSuperUser || (entity ? checkPermission(entity).delete : false);

  const canViewModule = (mod: AclResourceName) => isSuperUser || checkPermission(mod).view;

  return {
    isLoading,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canViewModule,
    isSuperUser,
  };
};
