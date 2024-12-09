export interface RoleToAdd {
  roleId: string;
}

export interface AccountCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
  roles: RoleToAdd[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  isCollaborator: boolean;
}
