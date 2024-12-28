import { SiteUrls } from '../../../../../core/config/site-urls';
import { SystemPermissions } from '../../../../../core/modules/auth/constants/system-permissions.const';
import { SystemRoles } from '../../../../../core/modules/auth/constants/system-roles.const';
import { AllPermissions } from '../../../../../core/modules/auth/types/all-permissions.type';
import { SystemRole } from '../../../../../core/modules/auth/types/system-roles.type';

interface SidebarMenuItem {
  id: string;
  icon: string;
  title: string;
  role?: SystemRole | SystemRole[];
  permission?: AllPermissions | AllPermissions[];
  items: SubMenuItem[];
}

interface SubMenuItem {
  icon: string;
  text: string;
  role?: SystemRole | SystemRole[];
  permission?: AllPermissions | AllPermissions[];
  route: keyof typeof SiteUrls | string;
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  // Administración del Sistema.
  {
    id: 'administration',
    icon: 'admin_panel_settings',
    title: 'Administración',
    role: [SystemRoles.Administrator],
    items: [
      {
        icon: 'manage_accounts',
        text: 'Roles',
        permission: [SystemPermissions.Roles.Read],
        route: SiteUrls.roles.list,
      },
      { icon: 'group', text: 'Usuarios', route: SiteUrls.accounts.list },
      { icon: 'history', text: 'Auditoría', route: 'SiteUrls.audit' },
    ],
  },

  // Gestión de Calendarios.
  {
    id: 'calendar-management',
    icon: 'calendar_month',
    title: 'Gestión de Calendarios',
    permission: [SystemPermissions.Calendars.Read],
    items: [
      { icon: 'event_note', text: 'Calendarios', route: SiteUrls.calendars.list },
      { icon: 'calendar_view_month', text: 'Vista Administrativa', route: 'SiteUrls.adminCalendar' },
    ],
  },

  // Recursos y Servicios.
  {
    id: 'resources',
    icon: 'inventory',
    title: 'Recursos y Servicios',
    role: [SystemRoles.Administrator, SystemRoles.Employee],
    items: [
      { icon: 'schedule', text: 'Horarios', route: 'SiteUrls.schedules' },
      { icon: 'category', text: 'Tipos de Recursos', route: SiteUrls.resourceTypes.list },
      { icon: 'apps', text: 'Servicios', route: 'SiteUrls.services' },
    ],
  },

  // Configuración de Usuario.
  {
    id: 'user-settings',
    icon: 'account_circle',
    title: 'Mi Perfil',
    // No ponemos role ni permission para que sea accesible a todos los usuarios autenticados.
    items: [
      { icon: 'person', text: 'Datos Personales', route: 'SiteUrls.userProfile' },
      { icon: 'notifications', text: 'Notificaciones', route: 'SiteUrls.userNotifications' },
      { icon: 'language', text: 'Preferencias', route: 'SiteUrls.userPreferences' },
      { icon: 'security', text: 'Seguridad', route: 'SiteUrls.userSecurity' },
    ],
  },

  // Vista de Cliente.
  {
    id: 'client-view',
    icon: 'person',
    title: 'Mi Agenda',
    role: [SystemRoles.Customer],
    items: [
      { icon: 'event', text: 'Mis Citas', route: 'SiteUrls.clientAppointments' },
      { icon: 'history', text: 'Historial', route: 'SiteUrls.appointmentHistory' },
      { icon: 'add_circle', text: 'Nueva Cita', route: 'SiteUrls.newAppointment' },
    ],
  },
];
