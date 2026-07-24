import { ResourcePermissions, AclResource, AclResourceName } from '@repo/schema';

type PermissionMap = Record<AclResourceName, ResourcePermissions>;

export const ROLE_PERMISSIONS: Record<string, PermissionMap> = {
  SUPER_ADMIN: allResources(true),
  ADMIN: allResources(true),
  GUARD: {
    [AclResource.RESIDENTS]: { view: true, create: false, update: false, delete: false },
    [AclResource.FAMILY_MEMBERS]: { view: false, create: false, update: false, delete: false },
    [AclResource.GUARDS]: { view: false, create: false, update: false, delete: false },
    [AclResource.SOCIETY]: { view: false, create: false, update: false, delete: false },
    [AclResource.TOWERS]: { view: true, create: false, update: false, delete: false },
    [AclResource.FLATS]: { view: true, create: false, update: false, delete: false },
    [AclResource.AMENITIES]: { view: false, create: false, update: false, delete: false },
    [AclResource.NOTICES]: { view: true, create: false, update: false, delete: false },
    [AclResource.POLLS]: { view: true, create: false, update: false, delete: false },
    [AclResource.COMPLAINTS]: { view: true, create: false, update: false, delete: false },
    [AclResource.HELPDESK_TICKETS]: { view: true, create: false, update: false, delete: false },
    [AclResource.MEDIA]: { view: true, create: true, update: false, delete: true },
    [AclResource.USERS]: { view: false, create: false, update: false, delete: false },
  },
  RESIDENTS: {
    [AclResource.RESIDENTS]: { view: true, create: false, update: false, delete: false },
    [AclResource.FAMILY_MEMBERS]: { view: true, create: true, update: false, delete: false },
    [AclResource.GUARDS]: { view: false, create: false, update: false, delete: false },
    [AclResource.SOCIETY]: { view: true, create: false, update: false, delete: false },
    [AclResource.TOWERS]: { view: false, create: false, update: false, delete: false },
    [AclResource.FLATS]: { view: false, create: false, update: false, delete: false },
    [AclResource.AMENITIES]: { view: true, create: false, update: false, delete: false },
    [AclResource.NOTICES]: { view: true, create: false, update: false, delete: false },
    [AclResource.POLLS]: { view: true, create: false, update: false, delete: false },
    [AclResource.COMPLAINTS]: { view: true, create: true, update: false, delete: false },
    [AclResource.HELPDESK_TICKETS]: { view: true, create: true, update: false, delete: false },
    [AclResource.MEDIA]: { view: true, create: true, update: false, delete: true },
    [AclResource.USERS]: { view: true, create: false, update: false, delete: false },
  },
};

function allResources(val: boolean): PermissionMap {
  return {
    [AclResource.RESIDENTS]: { view: val, create: val, update: val, delete: val },
    [AclResource.FAMILY_MEMBERS]: { view: val, create: val, update: val, delete: val },
    [AclResource.GUARDS]: { view: val, create: val, update: val, delete: val },
    [AclResource.SOCIETY]: { view: val, create: val, update: val, delete: val },
    [AclResource.TOWERS]: { view: val, create: val, update: val, delete: val },
    [AclResource.FLATS]: { view: val, create: val, update: val, delete: val },
    [AclResource.AMENITIES]: { view: val, create: val, update: val, delete: val },
    [AclResource.NOTICES]: { view: val, create: val, update: val, delete: val },
    [AclResource.POLLS]: { view: val, create: val, update: val, delete: val },
    [AclResource.COMPLAINTS]: { view: val, create: val, update: val, delete: val },
    [AclResource.HELPDESK_TICKETS]: { view: val, create: val, update: val, delete: val },
    [AclResource.MEDIA]: { view: val, create: val, update: val, delete: val },
    [AclResource.USERS]: { view: val, create: val, update: val, delete: val },
  };
}
