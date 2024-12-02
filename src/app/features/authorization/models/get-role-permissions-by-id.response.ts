export interface Permission {
  permissionId: string;
  action: string;
  isAssigned: boolean;
}

export interface ModulePermission {
  moduleName: string;
  permissions: Permission[];
}

export interface GetRolePermissionsByIdResponse {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleIsEditable: boolean;
  permissions: ModulePermission[];
}
