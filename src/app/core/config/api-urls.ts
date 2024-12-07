export const ApiUrls = {
  auth: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
  },
  accounts: {
    recoveryPassword: '/accounts/recovery-password',
    confirmRecoveryPassword: '/accounts/confirm-recovery-password',
    confirmEmailResent: '/accounts/confirm-email-resent',
    confirmEmailVerify: '/accounts/confirm-email-verify',
  },
  roles: {
    getRolesPaginated: '/roles/paginated',
    getRoleById: '/roles/{roleId}',
    getRolePermissionsById: '/roles/{roleId}/permissions',
    createRole: '/roles',
    updateRol: '/roles/{roleId}',
    updatePermissionForRole: '/roles/{roleId}/permissions/{permissionId}',
    deleteRole: '/roles/{roleId}',
  },
  userRoles: {
    getUsersByRoleId: '/user-roles/{roleId}/users',
    getUsersNotInRoleId: '/user-roles/{roleId}/exclude-users',
    assignUserToRole: '/user-roles/{roleId}/assign-user/{userId}',
    unAssignedUserFromRole: '/user-roles/{roleId}/unassigned-user/{userId}',
  },
};
