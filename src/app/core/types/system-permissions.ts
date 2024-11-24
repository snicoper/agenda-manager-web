export interface Permission {
  Create: string;
  Read: string;
  Update: string;
  Delete: string;
}

export interface SystemPermissionsType {
  Appointments: Permission;
  AppointmentStatuses: Permission;
  Calendars: Permission;
  CalendarHolidays: Permission;
  Resources: Permission;
  ResourceSchedules: Permission;
  ResourceTypes: Permission;
  Services: Permission;
  Users: Permission;
  UserTokens: Permission;
  Roles: Permission;
  Permissions: Permission;
}

export const SystemPermissions: SystemPermissionsType = {
  Appointments: {
    Create: 'appointment:create',
    Read: 'appointment:read',
    Update: 'appointment:update',
    Delete: 'appointment:delete',
  },

  AppointmentStatuses: {
    Create: 'appointment-status:create',
    Read: 'appointment-status:read',
    Update: 'appointment-status:update',
    Delete: 'appointment-status:delete',
  },

  Calendars: {
    Create: 'calendar:create',
    Read: 'calendar:read',
    Update: 'calendar:update',
    Delete: 'calendar:delete',
  },

  CalendarHolidays: {
    Create: 'calendar-holiday:create',
    Read: 'calendar-holiday:read',
    Update: 'calendar-holiday:update',
    Delete: 'calendar-holiday:delete',
  },

  Resources: {
    Create: 'resource:create',
    Read: 'resource:read',
    Update: 'resource:update',
    Delete: 'resource:delete',
  },

  ResourceSchedules: {
    Create: 'resource-schedule:create',
    Read: 'resource-schedule:read',
    Update: 'resource-schedule:update',
    Delete: 'resource-schedule:delete',
  },

  ResourceTypes: {
    Create: 'resource-type:create',
    Read: 'resource-type:read',
    Update: 'resource-type:update',
    Delete: 'resource-type:delete',
  },

  Services: {
    Create: 'service:create',
    Read: 'service:read',
    Update: 'service:update',
    Delete: 'service:delete',
  },

  Users: {
    Create: 'user:create',
    Read: 'user:read',
    Update: 'user:update',
    Delete: 'user:delete',
  },

  UserTokens: {
    Create: 'user-tokens:create',
    Read: 'user-tokens:read',
    Update: 'user-tokens:update',
    Delete: 'user-tokens:delete',
  },

  Roles: {
    Create: 'role:create',
    Read: 'role:read',
    Update: 'role:update',
    Delete: 'role:delete',
  },

  Permissions: {
    Create: 'permission:create',
    Read: 'permission:read',
    Update: 'permission:update',
    Delete: 'permission:delete',
  },
};
