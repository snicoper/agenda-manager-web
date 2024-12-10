export const ApiResultErrors = {
  users: {
    userIsNotActive: 'UserErrors.UserIsNotActive',
    userNotFound: 'UserErrors.UserNotFound',
    emailIsNotConfirmed: 'UserErrors.EmailIsNotConfirmed',
  },

  userTokens: {
    userTokenNotFoundOrExpired: 'UserTokenErrors.UserTokenNotFoundOrExpired',
  },

  roles: {
    roleHasUsersAssigned: 'RoleErrors.RoleHasUsersAssigned',
  },
};
