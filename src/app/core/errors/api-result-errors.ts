/** Errores parciales de la API, se obtienen en caso de usarlos en el frontend. */
export const ApiResultErrors = {
  users: {
    userIsNotActive: 'UserErrors.UserIsNotActive',
    userNotFound: 'UserErrors.UserNotFound',
    emailIsNotConfirmed: 'UserErrors.EmailIsNotConfirmed',
  },

  userTokens: {
    userTokenNotFoundOrExpired: 'UserTokenErrors.UserTokenNotFoundOrExpired',
  },

  userProfiles: {
    identityDocumentAlreadyExists: 'UserProfileErrors.IdentityDocumentAlreadyExists',
    phoneNumberAlreadyExists: 'UserProfileErrors.PhoneNumberAlreadyExists',
  },

  roles: {
    roleHasUsersAssigned: 'RoleErrors.RoleHasUsersAssigned',
  },

  resourceTypes: {
    cannotDeleteResourceType: 'ResourceTypeErrors.CannotDeleteResourceType',
  },
};
