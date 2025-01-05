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

  resources: {
    list: '/resources',
  },

  roles: {
    list: '/authorization/roles',
    details: '/authorization/roles/{id}',
  },

  resourceTypes: {
    list: '/resource-types',
    details: '/resource-types/{id}',
  },
} as const;
