export interface Permission {
  permissionId: string;
  action: string;
  isAssigned: boolean;
}

export interface ModulePermission {
  moduleName: string;
  permissions: Permission[];
}

export interface RoleWithPermissionAvailabilityByIdResponse {
  roleId: string;
  roleName: string;
  roleDescription: string;
  permissions: ModulePermission[];
}
