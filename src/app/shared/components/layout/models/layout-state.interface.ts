import { Signal } from '@angular/core';

export interface LayoutState {
  navbarState: Signal<boolean>;
  sidebarState: Signal<boolean>;
  footerState: Signal<boolean>;
}
