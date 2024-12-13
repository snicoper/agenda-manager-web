export const ApiUrls = {
  auth: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
  },
  accounts: {
    getAccountsPaginated: '/accounts/paginated',
    getAccountDetails: '/accounts/{userId}',
    createAccount: '/accounts',
    confirmAccount: '/accounts/confirm-account',
    requestPasswordReset: '/accounts/request-password-reset',
    resetPassword: '/accounts/reset-password',
    resendEmailConfirmation: '/accounts/resend-email-confirmation',
    verifyEmail: '/accounts/verify-email',
  },
  roles: {
    getRolesPaginated: '/roles/paginated',
    getAllRoles: '/roles',
    getRoleById: '/roles/{roleId}',
    getRolePermissionsById: '/roles/{roleId}/permissions',
    createRole: '/roles',
    updateRol: '/roles/{roleId}',
    updatePermissionForRole: '/roles/{roleId}/permissions/{permissionId}',
    deleteRole: '/roles/{roleId}',
  },
  userRoles: {
    getUsersByRoleIdPaginated: '/user-roles/{roleId}/users/paginated',
    getUsersNotInRoleIdPaginated: '/user-roles/{roleId}/exclude-users/paginated',
    assignUserToRole: '/user-roles/{roleId}/assign-user/{userId}',
    unAssignedUserFromRole: '/user-roles/{roleId}/unassigned-user/{userId}',
  },
};
