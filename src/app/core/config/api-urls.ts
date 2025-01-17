export const ApiUrls = {
  auth: {
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
  },
  accounts: {
    getAccountsPaginated: '/accounts/paginated',
    filterAccounts: '/accounts/filter?term={term}&pageSize={pageSize}',
    getAccountById: '/accounts/{userId}',
    createAccount: '/accounts',
    requestPasswordReset: '/accounts/request-password-reset',
    resendEmailConfirmation: '/accounts/resend-email-confirmation',
    confirmAccount: '/accounts/confirm-account',
    resetPassword: '/accounts/reset-password',
    verifyEmail: '/accounts/verify-email',
    updateAccount: '/accounts/{userId}',
    toggleIsActive: '/accounts/{userId}/toggle-is-active',
    confirmEmail: '/accounts/{userId}/confirm-email',
  },
  calendars: {
    getCalendarsPaginated: '/calendars/paginated',
    getCalendars: '/calendars',
    getCalendarById: '/calendars/{calendarId}',
    getCalendarSettings: '/calendars/{calendarId}/settings',
    getCalendarHolidaysInYear: '/calendars/{calendarId}/holidays/year/{year}',
    getCalendarHolidayById: '/calendars/{calendarId}/holidays/{holidayId}',
    createCalendar: '/calendars',
    createCalendarHoliday: '/calendars/{calendarId}/holidays',
    updateCalendar: '/calendars/{calendarId}',
    updateAvailableDays: '/calendars/{calendarId}/available-days',
    updateCalendarSettings: '/calendars/{calendarId}/settings',
    updateCalendarHoliday: '/calendars/{calendarId}/holidays/{holidayId}',
    toggleIsActive: '/calendars/{calendarId}/toggle-is-active',
    deleteCalendarHoliday: '/calendars/{calendarId}/holidays/{holidayId}',
  },
  resources: {
    getResourcesPaginated: '/resources/paginated',
    getResourceById: '/resources/{resourceId}',
    getSchedulesByResourceId: '/resources/{resourceId}/schedules',
    createResource: '/resources',
    deactivateResource: '/resources/{resourceId}/deactivate',
    activateResource: '/resources/{resourceId}/activate',
    updateResource: '/resources/{resourceId}',
    deleteResource: '/resources/{resourceId}',
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
    getRolesByUserId: '/user-roles/{userId}/roles',
    getAvailableRolesByUserId: '/user-roles/{userId}/available-roles',
    assignUserToRole: '/user-roles/{roleId}/assign-user/{userId}',
    unAssignedUserFromRole: '/user-roles/{roleId}/unassigned-user/{userId}',
  },
  resourceTypes: {
    getResourceTypesPaginated: '/resource-types/paginated',
    getResourceTypes: '/resource-types',
    getResourceTypeById: '/resource-types/{resourceTypeId}',
    createResourceType: '/resource-types',
    updateResourceType: '/resource-types/{resourceTypeId}',
    deleteResourceType: '/resource-types/{resourceTypeId}',
  },
} as const;
