import { SystemPermissionsType } from '../interfaces/system-permissions.interface';

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

  AuditRecords: {
    Create: 'audit-record:create',
    Read: 'audit-record:read',
    Update: 'audit-record:update',
    Delete: 'audit-record:delete',
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

  CalendarConfigurations: {
    Create: 'calendar-configuration:create',
    Read: 'calendar-configuration:read',
    Update: 'calendar-configuration:update',
    Delete: 'calendar-configuration:delete',
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
} as const;
