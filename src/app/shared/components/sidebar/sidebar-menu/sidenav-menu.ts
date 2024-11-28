export interface SidenavMenuItem {
  name: string;
  open: boolean;
}

export type SidenavMenu = SidenavMenuItem[];

// TODO: Revisar secciones de menu
export const SidenavMenus: SidenavMenu = [
  { name: 'administration', open: false },
  { name: 'enterprise', open: false },
  { name: 'calendars', open: false },
  { name: 'employee', open: false },
];
