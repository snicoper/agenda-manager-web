import { ModuleRoleDisplayNameType } from '../interfaces/system-permissions.interface';

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
