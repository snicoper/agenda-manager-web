export const SiteUrls = {
  // Pagina principal una vez se haya autenticado.
  home: '/',

  accounts: {
    list: '/accounts',
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

  calendars: {
    list: '/calendars',
    details: '/calendars/{id}',
  },

  errors: {
    notFound: '/errors/404',
    forbidden: '/errors/403',
  },

  roles: {
    list: '/authorization/roles',
    permissions: '/authorization/roles/{id}/permissions',
    roleUserAssignments: '/authorization/roles/{id}/user-assignments',
  },

  resourceTypes: {
    list: '/resource-types',
  },
} as const;
