export const ApiResultErrors = {
  // Users.
  users: {
    userIsNotActive: 'UserErrors.UserIsNotActive',
    userNotFound: 'UserErrors.UserNotFound',
    emailIsNotConfirmed: 'UserErrors.EmailIsNotConfirmed',
  },

  // User tokens.
  userTokens: {
    userTokenNotFoundOrExpired: 'UserTokenErrors.UserTokenNotFoundOrExpired',
  },

  // Roles.
  roles: {
    roleHasUsersAssigned: 'RoleErrors.RoleHasUsersAssigned',
  },
};
