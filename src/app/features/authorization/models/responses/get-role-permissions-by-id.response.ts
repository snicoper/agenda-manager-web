export interface PermissionDetail {
  permissionId: string;
  action: string;
  isAssigned: boolean;
}

export interface ModulePermission {
  moduleName: string;
  permissions: PermissionDetail[];
}

export interface GetRolePermissionsByIdResponse {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleIsEditable: boolean;
  permissions: ModulePermission[];
}
