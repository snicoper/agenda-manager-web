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
    getRoleWithPermissionAvailabilityById: '/roles/{roleId}/permission-availability',
    updatePermissionForRole: '/roles/{roleId}/permissions/{permissionId}',
  },
};
