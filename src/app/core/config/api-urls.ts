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
    getPaginated: '/roles/paginated',
    getById: '/roles/{roleId}',
    getRolePermissionsById: '/roles/{roleId}/permissions',
    createRole: '/roles',
    updatePermissionForRole: '/roles/{roleId}/permissions/{permissionId}',
    deleteRole: '/roles/{roleId}',
  },
};
