/** Permisos del sistema. */
export interface Permission {
  Create: string;
  Read: string;
  Update: string;
  Delete: string;
}

export interface SystemPermissionsType {
  Appointments: Permission;
  AppointmentStatuses: Permission;
  AuditRecords: Permission;
  Roles: Permission;
  Permissions: Permission;
  Calendars: Permission;
  CalendarHolidays: Permission;
  CalendarConfigurations: Permission;
  Resources: Permission;
  ResourceSchedules: Permission;
  ResourceTypes: Permission;
  Services: Permission;
  Users: Permission;
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
};

/** Mapea los permisos a nombres de human readable. */
export interface ModuleRoleDisplayNameType {
  appointment: string;
  'appointment-status': string;
  'audit-record': string;
  role: string;
  permission: string;
  calendar: string;
  'calendar-holiday': string;
  'calendar-configuration': string;
  resource: string;
  'resource-schedule': string;
  'resource-type': string;
  service: string;
  user: string;
  'user-token': string;

  get(key: string): string;
  fromPermission(permissionName: string): string;
}

export const ModuleRoleDisplayName: ModuleRoleDisplayNameType = {
  appointment: 'Citas',
  'appointment-status': 'Estados de la cita',
  'audit-record': 'Registros de auditoría',
  role: 'Roles',
  permission: 'Permisos',
  calendar: 'Calendarios',
  'calendar-holiday': 'Días festivos del calendario',
  'calendar-configuration': 'Configuraciones del calendario',
  resource: 'Recursos',
  'resource-schedule': 'Horarios de los recursos',
  'resource-type': 'Tipos de recursos',
  service: 'Servicios',
  user: 'Usuarios',
  'user-token': 'Tokens de usuario',

  get(key: string): string {
    return this[key as keyof Omit<ModuleRoleDisplayNameType, 'get' | 'fromPermission'>];
  },

  fromPermission(permissionName: string): string {
    const moduleName = permissionName.split(':')[0];

    return ModuleRoleDisplayName.get(moduleName);
  },
};
