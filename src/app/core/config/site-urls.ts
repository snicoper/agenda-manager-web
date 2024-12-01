export const SiteUrls = {
  // Pagina principal una vez se haya autenticado.
  home: '/',

  accounts: {
    recoveryPassword: '/accounts/recovery-password',
    confirmEmailResent: '/accounts/confirm-email-resent',
    confirmEmailVerify: '/accounts/confirm-email-verify',
  },

  auth: {
    login: '/auth/login',
  },

  roles: {
    list: '/authorization/roles',
    details: '/authorization/roles/{id}',
    roleUserAssignments: '/authorization/roles/{id}/user-assignments',
  },

  errors: {
    notFound: '/errors/404',
    forbidden: '/errors/403',
  },
};
