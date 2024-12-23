export interface RoleToAdd {
  roleId: string;
}

export interface AccountCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  isCollaborator: boolean;
  roles: RoleToAdd[];
}
