export const SiteUrls = {
  // Pagina principal una vez se haya autenticado.
  home: '/',

  accounts: {
    accounts: '/accounts',
    create: '/accounts/create',
    details: '/accounts/{id}',
    confirmAccount: '/accounts/confirm-account',
    requestPasswordReset: '/accounts/request-password-reset',
    resetPassword: '/accounts/reset-password',
    resendEmailConfirmation: '/accounts/resend-email-confirmation',
    verifyEmail: '/accounts/verify-email',
  },

  auth: {
    login: '/auth/login',
  },

  roles: {
    list: '/authorization/roles',
    permissions: '/authorization/roles/{id}/permissions',
    roleUserAssignments: '/authorization/roles/{id}/user-assignments',
  },

  errors: {
    notFound: '/errors/404',
    forbidden: '/errors/403',
  },
};
