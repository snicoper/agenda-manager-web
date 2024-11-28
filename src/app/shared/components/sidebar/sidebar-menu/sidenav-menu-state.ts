export interface SidenavMenuItem {
  name: string;
  open: boolean;
}

export type SidenavMenuState = SidenavMenuItem[];

// TODO: Revisar secciones de menu
export const SidenavMenus: SidenavMenuState = [
  { name: 'administration', open: false },
  { name: 'calendar-management', open: false },
  { name: 'resources', open: false },
  { name: 'user-settings', open: false },
  { name: 'client-view', open: false },
];
