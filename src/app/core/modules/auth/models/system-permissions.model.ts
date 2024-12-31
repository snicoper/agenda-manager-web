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
  CalendarSettings: Permission;
  Resources: Permission;
  ResourceSchedules: Permission;
  ResourceTypes: Permission;
  Services: Permission;
  Users: Permission;
}

/** Mapea los permisos a nombres de human readable. */
export interface ModuleRoleDisplayNameType {
  appointment: string;
  'appointment-status': string;
  'audit-record': string;
  role: string;
  permission: string;
  calendar: string;
  'calendar-holiday': string;
  'calendar-settings': string;
  resource: string;
  'resource-schedule': string;
  'resource-type': string;
  service: string;
  user: string;
  'user-token': string;

  get(key: string): string;
  fromPermission(permissionName: string): string;
}
